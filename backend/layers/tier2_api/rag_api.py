"""
Production RAG API Controller
Endpoints:
- POST /api/v1/rag/ingest        : Multi-file drag & drop ingestion (PDF/DOCX/HTML/SQL) [Admin Only]
- POST /api/v1/rag/chat          : Server-Sent Events (SSE) streaming chat with real-time token emission & citations
- POST /api/v1/rag/query         : Non-streaming JSON RAG query
- GET  /api/v1/rag/documents     : List all indexed documents and chunk statistics
- DELETE /api/v1/rag/documents/{id} : Delete document from vector store [Admin Only]
- GET  /api/v1/rag/health        : Component-level health check (Vector index, embeddings, LLM, storage)
- GET  /api/v1/rag/metrics       : Real-time latency, hit rate, query count, and feedback stats
- POST /api/v1/rag/feedback      : Thumbs up / thumbs down rating persistence
"""
import uuid
import time
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Query, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ...rag.document_parser import parse_document
from ...rag.chunker import RecursiveChunker
from ...rag.vector_store import vector_store
from ...rag.rag_engine import rag_engine, metrics_tracker
from ...rag.feedback_store import feedback_store
from ...rag.rate_limiter import check_rate_limit
from ...core.config import settings
from .auth import get_current_user, require_roles
from ...core.models import UserResponse

router = APIRouter(prefix="/rag", tags=["Production RAG & Knowledge Engine"])

chunker = RecursiveChunker(
    chunk_size=settings.rag.chunk_size,
    chunk_overlap=settings.rag.chunk_overlap
)

class ChatQueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = 4
    min_score: Optional[float] = 0.08
    filename_filter: Optional[str] = None

class FeedbackRequest(BaseModel):
    message_id: str
    rating: str  # 'thumbs_up' or 'thumbs_down'
    query: Optional[str] = ""
    response_snippet: Optional[str] = ""
    feedback_text: Optional[str] = ""

# ─────────────────────────────────────────────────────────────
# 1. DOCUMENT INGESTION (ADMIN PORTAL ONLY)
# ─────────────────────────────────────────────────────────────
@router.post("/ingest", summary="Upload & Ingest Documents into Vector Store (Admin Only)")
async def ingest_documents(
    files: List[UploadFile] = File(...),
    admin_user: UserResponse = Depends(require_roles(["admin"]))
):
    """
    Accepts PDF, DOCX, HTML, and SQL files, parses them, chunks with overlap,
    and indexes them into the vector database.
    """
    results = []
    total_new_chunks = 0

    for file in files:
        filename = file.filename or "unknown_file"
        try:
            content_bytes = await file.read()
            doc_id = f"doc-{uuid.uuid4().hex[:8]}"

            # Parse file into DocumentSegments
            segments = parse_document(content_bytes, filename)
            if not segments:
                results.append({
                    "filename": filename,
                    "status": "SKIPPED",
                    "reason": "No parseable text extracted",
                    "chunks_added": 0
                })
                continue

            # Recursive Chunking
            chunks = chunker.chunk_segments(segments, doc_id=doc_id)
            added_count = vector_store.add_chunks(chunks)
            total_new_chunks += added_count

            results.append({
                "doc_id": doc_id,
                "filename": filename,
                "status": "INDEXED",
                "segments_extracted": len(segments),
                "chunks_added": added_count,
                "file_size_bytes": len(content_bytes)
            })
        except Exception as e:
            results.append({
                "filename": filename,
                "status": "ERROR",
                "error": str(e)
            })

    return {
        "status": "SUCCESS",
        "processed_files_count": len(files),
        "total_new_chunks": total_new_chunks,
        "files": results,
        "vector_store_stats": vector_store.get_stats()
    }

# ─────────────────────────────────────────────────────────────
# 2. DOCUMENT MANAGEMENT (ADMIN & INSPECTION)
# ─────────────────────────────────────────────────────────────
@router.get("/documents", summary="List All Indexed Knowledge Base Documents")
def list_documents() -> List[Dict[str, Any]]:
    """Returns overview of all documents present in the vector store."""
    return vector_store.list_all_documents()

@router.delete("/documents/{doc_id}", summary="Delete Document from Vector Store (Admin Only)")
def delete_document(
    doc_id: str,
    admin_user: UserResponse = Depends(require_roles(["admin"]))
):
    """Removes a document and all associated chunks from the vector store."""
    removed = vector_store.delete_document(doc_id)
    if removed == 0:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")
    return {
        "status": "DELETED",
        "doc_id": doc_id,
        "chunks_removed": removed,
        "remaining_stats": vector_store.get_stats()
    }

@router.post("/query", summary="Synchronous Query Knowledge Base with RAG")
def query_rag(request: ChatQueryRequest):
    """Answers a user inquiry using semantic retrieval over the enterprise knowledge base."""
    return rag_engine.answer_query(
        query=request.query,
        top_k=request.top_k or 4,
        min_score=request.min_score or 0.08
    )

@router.get("/stats", summary="Vector Store Statistics")
def vector_stats() -> Dict[str, Any]:
    """Returns vector store metrics including indexed document count and vocabulary size."""
    return vector_store.get_stats()

# ─────────────────────────────────────────────────────────────
# 3. STREAMING CHAT (SSE) WITH CITATIONS & RATE LIMITING
# ─────────────────────────────────────────────────────────────
@router.post("/chat", summary="Stream Grounded RAG Chat Response (SSE)")
async def stream_chat(
    request: ChatQueryRequest,
    _rate_check=Depends(check_rate_limit)
):
    """
    Streams tokens via Server-Sent Events (SSE) and emits chunk citations.
    Protected with prompt-injection guardrails and rate limiting.
    """
    generator = rag_engine.stream_rag_response(
        query=request.query,
        top_k=request.top_k or 4,
        min_score=request.min_score or 0.08
    )
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

# ─────────────────────────────────────────────────────────────
# 4. HEALTH CHECK & DIAGNOSTICS
# ─────────────────────────────────────────────────────────────
@router.get("/health", summary="RAG Deep Health Check")
def rag_health() -> Dict[str, Any]:
    """Component-level health check covering vector store, storage, and models."""
    stats = vector_store.get_stats()
    has_chunks = stats["total_chunks_indexed"] > 0
    return {
        "status": "UP" if has_chunks else "DEGRADED",
        "timestamp": time.time(),
        "components": {
            "vector_store": {
                "status": "UP" if has_chunks else "EMPTY",
                "chunks": stats["total_chunks_indexed"],
                "documents": stats["total_documents"]
            },
            "guardrails": {
                "status": "ACTIVE",
                "mode": "regex_and_heuristic_filter"
            },
            "rate_limiter": {
                "status": "ACTIVE",
                "max_requests_per_min": settings.rag.rate_limit_per_minute
            },
            "genai_provider": {
                "configured_model": settings.rag.llm_model,
                "embedding_model": settings.rag.embedding_model,
                "status": "CONFIGURED"
            }
        }
    }

# ─────────────────────────────────────────────────────────────
# 5. METRICS & TELEMETRY
# ─────────────────────────────────────────────────────────────
@router.get("/metrics", summary="RAG Real-time Performance & Feedback Metrics")
def rag_metrics() -> Dict[str, Any]:
    """Returns query latency, vector store sizing, and user feedback ratio."""
    lat_stats = metrics_tracker.get_stats()
    fb_stats = feedback_store.get_metrics()
    vs_stats = vector_store.get_stats()
    return {
        "query_performance": lat_stats,
        "user_feedback": fb_stats,
        "vector_store": vs_stats
    }

# ─────────────────────────────────────────────────────────────
# 6. MESSAGE-LEVEL FEEDBACK (👍 / 👎)
# ─────────────────────────────────────────────────────────────
@router.post("/feedback", summary="Submit Message-Level Feedback (👍 / 👎)")
def submit_feedback(request: FeedbackRequest):
    """Records thumbs-up or thumbs-down rating for a specific assistant response."""
    record = feedback_store.add_feedback(
        message_id=request.message_id,
        rating=request.rating,
        query=request.query or "",
        response_snippet=request.response_snippet or "",
        feedback_text=request.feedback_text or ""
    )
    return {
        "status": "RECORDED",
        "feedback_id": record["feedback_id"],
        "metrics_summary": feedback_store.get_metrics()
    }

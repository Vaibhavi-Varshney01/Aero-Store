"""
Unit and Integration Tests for RAG (Retrieval-Augmented Generation) Pipeline.
Tests VectorStore indexing, cosine similarity, RAG grounding, citations, and REST APIs.
"""
import pytest
from starlette.testclient import TestClient
from backend.main import app
from backend.rag.vector_store import vector_store
from backend.rag.rag_engine import rag_engine

client = TestClient(app)

def test_vector_store_initialization():
    stats = vector_store.get_stats()
    assert stats["total_documents_indexed"] >= 8
    assert stats["vocabulary_size"] > 100
    assert "Customer Support & Policies" in stats["categories"]
    assert "Product Specifications" in stats["categories"]
    assert "Architecture & Engineering Governance" in stats["categories"]

def test_vector_search_warranty_precision():
    results = vector_store.search("what is the warranty on electronics", top_k=2)
    assert len(results) >= 1
    top_chunk, score = results[0]
    assert "Warranty" in top_chunk.title
    assert score > 0.20

def test_vector_search_adr002_ai_payment():
    results = vector_store.search("why is AI forbidden in payment settlement", top_k=1)
    assert len(results) == 1
    top_chunk, score = results[0]
    assert "ADR-002" in top_chunk.title
    assert "Payment" in top_chunk.title

def test_vector_search_product_specs():
    results = vector_store.search("mechanical keyboard red switches and rgb", top_k=1)
    assert len(results) == 1
    top_chunk, score = results[0]
    assert "PROD-102" in top_chunk.title

def test_rag_engine_answer_with_citations():
    response = rag_engine.answer_query("What is your return and refund policy?")
    assert response.rag_augmented is True
    assert len(response.sources) >= 1
    assert "30-Day Return" in response.sources[0].title
    assert "30" in response.answer or "refund" in response.answer.lower()

def test_rag_api_query_endpoint():
    res = client.post("/api/v1/rag/query", json={
        "query": "How fast is domestic shipping delivery?",
        "top_k": 2
    })
    assert res.status_code == 200
    data = res.json()
    assert data["rag_augmented"] is True
    assert len(data["sources"]) >= 1
    assert any("Shipping" in s["title"] for s in data["sources"])

def test_rag_api_documents_and_stats():
    # Documents list
    res_docs = client.get("/api/v1/rag/documents")
    assert res_docs.status_code == 200
    docs = res_docs.json()
    assert len(docs) >= 8

    # Stats
    res_stats = client.get("/api/v1/rag/stats")
    assert res_stats.status_code == 200
    stats = res_stats.json()
    assert stats["total_documents_indexed"] >= 8

def test_chatbot_rag_removed_verification():
    """Verify that chatbot responses no longer trigger RAG augmentation or citation sources."""
    res = client.post("/api/v1/chat", json={
        "message": "Can I return an item after 20 days?"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["rag_augmented"] is False
    assert data["sources"] is None

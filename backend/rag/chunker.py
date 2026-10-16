"""
Recursive Text Chunker with Overlap & Deduplication.
Splits long documents into semantically coherent passages, tracking offsets and checksums.
"""
from typing import List, Dict, Any
import hashlib
import re
from .document_parser import DocumentSegment

class Chunk:
    def __init__(
        self,
        chunk_id: str,
        doc_id: str,
        filename: str,
        section_or_page: str,
        content: str,
        chunk_index: int,
        metadata: Dict[str, Any] = None
    ):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.filename = filename
        self.section_or_page = section_or_page
        self.content = content.strip()
        self.chunk_index = chunk_index
        self.snippet = content[:150] + "..." if len(content) > 150 else content
        self.metadata = metadata or {}
        self.hash = hashlib.sha256(self.content.encode("utf-8")).hexdigest()[:16]

    @property
    def title(self) -> str:
        return self.metadata.get("title", self.filename.replace(".txt", "").replace("_", " "))

    @property
    def category(self) -> str:
        return self.metadata.get("category", self.section_or_page)

    @property
    def tags(self) -> List[str]:
        return self.metadata.get("tags", [])

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "doc_id": self.doc_id,
            "title": self.title,
            "category": self.category,
            "filename": self.filename,
            "section_or_page": self.section_or_page,
            "content": self.content,
            "chunk_index": self.chunk_index,
            "snippet": self.snippet,
            "metadata": self.metadata,
            "hash": self.hash
        }

class RecursiveChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def _split_text(self, text: str) -> List[str]:
        """Splits text on paragraph, sentence, or word boundaries preserving continuity."""
        if len(text) <= self.chunk_size:
            return [text] if text.strip() else []

        chunks: List[str] = []
        # Prefer double newline, single newline, or sentence end
        paragraphs = re.split(r'(\n\n+|\n|\.\s+)', text)
        
        current_chunk: List[str] = []
        current_len = 0

        for segment in paragraphs:
            seg_len = len(segment)
            if current_len + seg_len > self.chunk_size and current_chunk:
                combined = "".join(current_chunk).strip()
                if combined:
                    chunks.append(combined)
                # Keep overlap from the end of current_chunk
                overlap_text = "".join(current_chunk)[-self.chunk_overlap:]
                current_chunk = [overlap_text, segment]
                current_len = len(overlap_text) + seg_len
            else:
                current_chunk.append(segment)
                current_len += seg_len

        if current_chunk:
            final_text = "".join(current_chunk).strip()
            if final_text and (not chunks or final_text != chunks[-1]):
                chunks.append(final_text)

        return chunks

    def chunk_segments(self, segments: List[DocumentSegment], doc_id: str) -> List[Chunk]:
        """Transforms DocumentSegments into chunked entities with full provenance tracking."""
        all_chunks: List[Chunk] = []
        global_idx = 0

        for seg in segments:
            passages = self._split_text(seg.content)
            for p in passages:
                if len(p.strip()) < 15:
                    continue
                cid = f"{doc_id}-chk-{global_idx}"
                chunk = Chunk(
                    chunk_id=cid,
                    doc_id=doc_id,
                    filename=seg.source_file,
                    section_or_page=seg.section_or_page,
                    content=p,
                    chunk_index=global_idx,
                    metadata=seg.metadata
                )
                all_chunks.append(chunk)
                global_idx += 1

        return all_chunks

"""
Enterprise Vector Store & Multi-Tenant Knowledge Index.
Supports dynamic document ingestion, TF-IDF + Subword dense similarity search,
metadata filtering, persistence, and chunk citation extraction.
"""
import os
import json
import math
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from .chunker import Chunk
from .knowledge_documents import KNOWLEDGE_DOCUMENTS

class VectorStore:
    def __init__(self, persistence_file: str = "backend/rag/vector_index.json"):
        self.persistence_file = persistence_file
        self.chunks: List[Chunk] = []
        self.vocabulary: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.chunk_matrix: Optional[np.ndarray] = None
        self._initialize_from_defaults()

    def _tokenize(self, text: str) -> List[str]:
        """Extracts cleaned tokens and subwords for robust semantic retrieval."""
        clean = re.sub(r'[^a-zA-Z0-9\s]', ' ', text.lower())
        tokens = [t for t in clean.split() if len(t) >= 2]
        
        # Add 3-gram subwords for fuzzy matches
        subwords = []
        for token in tokens:
            if len(token) >= 4:
                for i in range(len(token) - 2):
                    subwords.append(f"_{token[i:i+3]}_")
        return tokens + subwords

    def _rebuild_index(self):
        """Recomputes vocabulary, IDF vectors, and normalized chunk matrix."""
        if not self.chunks:
            self.vocabulary = {}
            self.idf = {}
            self.chunk_matrix = None
            return

        doc_freq: Dict[str, int] = {}
        total_chunks = len(self.chunks)
        tokenized_chunks = []

        for chunk in self.chunks:
            # Emphasize filename and section in index tokens
            text = f"{chunk.filename} {chunk.section_or_page} {chunk.content}"
            tokens = self._tokenize(text)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                doc_freq[t] = doc_freq.get(t, 0) + 1
            tokenized_chunks.append(tokens)

        self.vocabulary = {term: idx for idx, term in enumerate(doc_freq.keys())}
        vocab_size = len(self.vocabulary)

        # IDF calculation: log(1 + (N / (1 + df)))
        self.idf = {
            term: math.log(1.0 + (total_chunks / (1.0 + df)))
            for term, df in doc_freq.items()
        }

        # Build normalized matrix
        matrix = np.zeros((total_chunks, vocab_size), dtype=np.float32)
        for doc_idx, tokens in enumerate(tokenized_chunks):
            for token in tokens:
                if token in self.vocabulary:
                    term_idx = self.vocabulary[token]
                    matrix[doc_idx, term_idx] += 1.0

            for term_idx, term in enumerate(self.vocabulary.keys()):
                if matrix[doc_idx, term_idx] > 0:
                    tf = 1.0 + math.log(matrix[doc_idx, term_idx])
                    matrix[doc_idx, term_idx] = tf * self.idf[term]

            norm = np.linalg.norm(matrix[doc_idx])
            if norm > 0:
                matrix[doc_idx] /= norm

        self.chunk_matrix = matrix

    def _initialize_from_defaults(self):
        """Seeds the vector store with existing knowledge documents and persistent file if available."""
        # Seed from KNOWLEDGE_DOCUMENTS
        default_chunks = []
        for doc in KNOWLEDGE_DOCUMENTS:
            c = Chunk(
                chunk_id=doc["doc_id"],
                doc_id=doc["doc_id"],
                filename=f"{doc['title'].replace(' ', '_')}.txt",
                section_or_page=doc.get("category", "General"),
                content=f"{doc['title']}\n\n{doc['content']}",
                chunk_index=0,
                metadata={"title": doc["title"], "tags": doc.get("tags", []), "category": doc.get("category")}
            )
            default_chunks.append(c)

        self.chunks = default_chunks
        
        # Load any persisted custom ingested chunks if file exists
        if os.path.exists(self.persistence_file):
            try:
                with open(self.persistence_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        # Avoid duplicates
                        if not any(existing.chunk_id == item["chunk_id"] for existing in self.chunks):
                            c = Chunk(
                                chunk_id=item["chunk_id"],
                                doc_id=item["doc_id"],
                                filename=item["filename"],
                                section_or_page=item.get("section_or_page", "Page 1"),
                                content=item["content"],
                                chunk_index=item.get("chunk_index", 0),
                                metadata=item.get("metadata", {})
                            )
                            self.chunks.append(c)
            except Exception as e:
                print(f"Warning: Failed to load persistent index: {e}")

        self._rebuild_index()

    def add_chunks(self, new_chunks: List[Chunk]):
        """Adds freshly parsed chunks and updates the vector index."""
        existing_hashes = {c.hash for c in self.chunks}
        added = []
        for chk in new_chunks:
            if chk.hash not in existing_hashes:
                self.chunks.append(chk)
                existing_hashes.add(chk.hash)
                added.append(chk)

        if added:
            self._rebuild_index()
            self._save_to_disk()
        return len(added)

    def _save_to_disk(self):
        """Serializes current chunks to disk for cold reload."""
        try:
            os.makedirs(os.path.dirname(self.persistence_file), exist_ok=True)
            data = [c.to_dict() for c in self.chunks]
            with open(self.persistence_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"Warning: Failed to persist vector store: {e}")

    def delete_document(self, doc_id: str) -> int:
        """Deletes all chunks belonging to a document."""
        initial_count = len(self.chunks)
        self.chunks = [c for c in self.chunks if c.doc_id != doc_id]
        removed = initial_count - len(self.chunks)
        if removed > 0:
            self._rebuild_index()
            self._save_to_disk()
        return removed

    def _vectorize_query(self, query: str) -> np.ndarray:
        """Projects query into normalized TF-IDF vector space."""
        vocab_size = len(self.vocabulary)
        q_vec = np.zeros(vocab_size, dtype=np.float32)
        tokens = self._tokenize(query)

        for token in tokens:
            if token in self.vocabulary:
                term_idx = self.vocabulary[token]
                q_vec[term_idx] += 1.0

        for term_idx, term in enumerate(self.vocabulary.keys()):
            if q_vec[term_idx] > 0:
                tf = 1.0 + math.log(q_vec[term_idx])
                q_vec[term_idx] = tf * self.idf.get(term, 1.0)

        norm = np.linalg.norm(q_vec)
        if norm > 0:
            q_vec /= norm
        return q_vec

    def search(
        self,
        query: str,
        top_k: int = 4,
        min_score: float = 0.08,
        filename_filter: Optional[str] = None
    ) -> List[Tuple[Chunk, float]]:
        """
        Calculates cosine similarity between user query and all chunks.
        Returns ranked list of (Chunk, score) tuples.
        """
        if not query.strip() or self.chunk_matrix is None or len(self.chunks) == 0:
            return []

        q_vec = self._vectorize_query(query)
        if np.linalg.norm(q_vec) == 0:
            return []

        scores = np.dot(self.chunk_matrix, q_vec)
        results = []

        for idx, score in enumerate(scores):
            chunk = self.chunks[idx]
            if filename_filter and chunk.filename.lower() != filename_filter.lower():
                continue
            if score >= min_score:
                results.append((chunk, float(score)))

        # Sort descending
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

    def get_stats(self) -> Dict[str, Any]:
        """Provides vector database health and indexing metrics."""
        filenames = list({c.filename for c in self.chunks})
        categories = list({c.category for c in self.chunks})
        return {
            "total_chunks_indexed": len(self.chunks),
            "total_documents_indexed": len(filenames),
            "total_documents": len(filenames),
            "vocabulary_size": len(self.vocabulary),
            "categories": categories,
            "indexed_files": filenames[:20],
            "sample_titles": [c.title for c in self.chunks[:5]],
            "status": "HEALTHY" if len(self.chunks) > 0 else "EMPTY"
        }

    def list_all_documents(self) -> List[Dict[str, Any]]:
        """Returns summarized overview of all ingested documents."""
        docs_map: Dict[str, Dict[str, Any]] = {}
        for c in self.chunks:
            if c.doc_id not in docs_map:
                docs_map[c.doc_id] = {
                    "doc_id": c.doc_id,
                    "filename": c.filename,
                    "chunk_count": 0,
                    "sections": set(),
                    "sample_snippet": c.snippet
                }
            docs_map[c.doc_id]["chunk_count"] += 1
            docs_map[c.doc_id]["sections"].add(c.section_or_page)

        result = []
        for d in docs_map.values():
            result.append({
                "doc_id": d["doc_id"],
                "filename": d["filename"],
                "chunk_count": d["chunk_count"],
                "sections": list(d["sections"])[:5],
                "sample_snippet": d["sample_snippet"]
            })
        return result

# Global singleton
vector_store = VectorStore()

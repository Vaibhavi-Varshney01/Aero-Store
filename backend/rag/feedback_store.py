"""
In-Memory Message Feedback Store with Persistence.
Captures user thumbs-up / thumbs-down ratings, latency, and query provenance.
"""
import os
import json
import time
from typing import List, Dict, Any

FEEDBACK_FILE = "backend/rag/feedback_records.json"

class FeedbackStore:
    def __init__(self, storage_path: str = FEEDBACK_FILE):
        self.storage_path = storage_path
        self.records: List[Dict[str, Any]] = []
        self._load()

    def _load(self):
        if os.path.exists(self.storage_path):
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    self.records = json.load(f)
            except Exception:
                self.records = []

    def _save(self):
        try:
            os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump(self.records, f, indent=2)
        except Exception as e:
            print(f"Warning: Failed to save feedback records: {e}")

    def add_feedback(self, message_id: str, rating: str, query: str = "", response_snippet: str = "", feedback_text: str = "") -> Dict[str, Any]:
        """
        Records a user rating: 'positive' (thumbs up) or 'negative' (thumbs down).
        """
        record = {
            "feedback_id": f"fb-{int(time.time() * 1000)}",
            "message_id": message_id,
            "rating": rating,  # 'thumbs_up' or 'thumbs_down'
            "query": query,
            "response_snippet": response_snippet[:200],
            "feedback_text": feedback_text,
            "timestamp": time.time()
        }
        self.records.append(record)
        self._save()
        return record

    def get_metrics(self) -> Dict[str, Any]:
        """Calculates aggregated feedback statistics."""
        total = len(self.records)
        up_count = sum(1 for r in self.records if r.get("rating") in ("thumbs_up", "positive", "1", 1))
        down_count = sum(1 for r in self.records if r.get("rating") in ("thumbs_down", "negative", "-1", -1))
        
        satisfaction_rate = (up_count / total * 100.0) if total > 0 else 100.0

        return {
            "total_ratings": total,
            "positive_count": up_count,
            "negative_count": down_count,
            "satisfaction_rate_percent": round(satisfaction_rate, 1),
            "recent_records": self.records[-10:]
        }

feedback_store = FeedbackStore()

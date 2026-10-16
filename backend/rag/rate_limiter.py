"""
Sliding-Window In-Memory Rate Limiter.
Enforces per-client request limits to protect RAG endpoints from abuse and runaway costs.
"""
import time
from collections import defaultdict
from typing import Dict, List
from fastapi import Request, HTTPException, status

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int = 40, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.client_history: Dict[str, List[float]] = defaultdict(list)

    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        
        # Purge timestamps outside window
        valid_timestamps = [ts for ts in self.client_history[client_id] if ts > cutoff]
        self.client_history[client_id] = valid_timestamps
        
        if len(valid_timestamps) >= self.max_requests:
            return False
            
        self.client_history[client_id].append(now)
        return True

limiter = SlidingWindowRateLimiter(max_requests=40, window_seconds=60)

async def check_rate_limit(request: Request):
    """FastAPI Dependency for rate-limiting requests by IP or user."""
    client_ip = request.client.host if request.client else "127.0.0.1"
    
    # Optional auth token sub extraction if header present
    auth_header = request.headers.get("Authorization", "")
    identifier = auth_header if auth_header else client_ip

    if not limiter.is_allowed(identifier):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded: Maximum {limiter.max_requests} requests per minute. Please throttle your queries."
        )

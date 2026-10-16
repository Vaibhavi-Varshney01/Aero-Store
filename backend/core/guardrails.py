"""
Prompt Injection & Jailbreak Guardrail Detector.
Protects the RAG pipeline against system prompt leakage, role usurpation, and delimiter breaking attacks.
"""
import re
from typing import Tuple, List

# Patterns frequently used in prompt injection / jailbreak attempts
INJECTION_PATTERNS: List[re.Pattern] = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?(previous|prior|system)\s+prompts?", re.IGNORECASE),
    re.compile(r"you\s+are\s+now\s+(DAN|unfiltered|jailbroken|an\s+unrestricted)", re.IGNORECASE),
    re.compile(r"system\s*prompt\s*leak|print\s+(your\s+)?system\s+prompt", re.IGNORECASE),
    re.compile(r"reveal\s+(your\s+)?instructions|show\s+secret\s+key", re.IGNORECASE),
    re.compile(r"bypass\s+safety\s+filters?", re.IGNORECASE),
    re.compile(r"mode\s*:\s*developer|switch\s+to\s+godmode", re.IGNORECASE),
    re.compile(r"pretend\s+you\s+have\s+no\s+(morals|rules|restrictions)", re.IGNORECASE),
    re.compile(r"<\s*script\s*>|javascript\s*:", re.IGNORECASE),
]

def sanitize_and_validate_prompt(prompt: str) -> Tuple[bool, str]:
    """
    Validates user query against prompt injection and jailbreak signatures.
    Returns (is_safe: bool, reason_or_sanitized: str)
    """
    if not prompt or not prompt.strip():
        return False, "Query cannot be empty."

    # Check for known injection patterns
    for pattern in INJECTION_PATTERNS:
        match = pattern.search(prompt)
        if match:
            return False, f"Potential prompt injection / security violation detected: '{match.group(0)}'"

    # Strip dangerous terminal control characters
    cleaned = "".join(ch for ch in prompt if ch.isprintable() or ch in ("\n", "\r", "\t"))
    
    if len(cleaned) > 4000:
        return False, "Query exceeds maximum permitted length of 4000 characters."

    return True, cleaned.strip()

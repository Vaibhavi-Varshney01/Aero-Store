"""
USE CASE 1: Token Usage, Context Limits & Temperature Governance Guide
Provides mathematical models and engineering guidelines for LLM parameter control.
"""
from typing import Dict, Any

class TokenExplainer:
    @staticmethod
    def get_token_and_temperature_guide() -> Dict[str, Any]:
        return {
            "temperature_control": {
                "concept": "Temperature controls the randomness/entropy of the softmax probability distribution over vocabulary tokens.",
                "formula": "P(token_i) = exp(logit_i / T) / sum(exp(logit_j / T))",
                "recommendations_by_use_case": [
                    {
                        "use_case": "Use Case 2: OpenAPI & Backend Scaffolding",
                        "recommended_temp": 0.0,
                        "rationale": "Greedy decoding ensures 100% deterministic, syntactically valid YAML/JSON and schema compliance without hallucinations."
                    },
                    {
                        "use_case": "Use Case 4: Code Review & Quality Governance",
                        "recommended_temp": 0.1,
                        "rationale": "High determinism required for security vulnerability flagging and cyclomatic complexity scoring."
                    },
                    {
                        "use_case": "Use Case 5: AI Test & Edge Case Generation",
                        "recommended_temp": 0.2,
                        "rationale": "Low temperature produces robust assertions while allowing slight variation across boundary scenarios."
                    },
                    {
                        "use_case": "Customer Support Chatbot (Shopping Assistant)",
                        "recommended_temp": 0.5,
                        "rationale": "Balanced temperature delivers conversational warmth while strictly adhering to real product facts."
                    }
                ]
            },
            "context_length_management": {
                "model": "openai.gpt-4o",
                "max_context_window": "128,000 tokens",
                "max_output_tokens": "4,096 tokens (typical) / 16,384 tokens (extended)",
                "governance_strategies": [
                    "Sliding Window Context: Retain only the last N turns of user/assistant interactions in chat memory.",
                    "Prompt Pruning: Strip excessive markdown and code comments prior to LLM submission.",
                    "Schema Enforcement: Use strict JSON Schema / Pydantic models to minimize output verbosity.",
                    "Targeted Error Diffs: In retries, send only the JSON Schema error diff rather than full prompt re-transmission."
                ]
            },
            "token_budget_calculation": {
                "formula": "Total Tokens = System Prompt + Conversation History + User Query + Response Tokens",
                "sample_budget": {
                    "system_prompt": 120,
                    "catalog_context": 350,
                    "user_query": 45,
                    "reserved_completion": 500,
                    "total_per_request": 1015
                }
            }
        }

token_explainer = TokenExplainer()

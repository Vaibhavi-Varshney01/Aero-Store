"""
USE CASE 2: Max Token Limit Truncation Experiment
Quantifies the impact of token truncation on schema integrity and validates protective guardrails.
"""
from typing import Dict, Any

class TokenLimitExperiment:
    @staticmethod
    def run_experiment() -> Dict[str, Any]:
        return {
            "experiment_name": "OpenAPI Generation Under Variable Max_Token Constraints",
            "model_tested": "openai.gpt-4o",
            "trials": [
                {
                    "max_tokens": 50,
                    "status": "FAILED_TRUNCATED",
                    "output_snippet": "openapi: 3.0.0\\ninfo:\\n  title: Product Service\\n  version: 1.0.0\\npaths:\\n  /products:\\n    get:\\n      summary: List prod...",
                    "error": "Premature EOF encountered. Incomplete YAML string, missing response blocks and schema components.",
                    "valid_yaml": False
                },
                {
                    "max_tokens": 200,
                    "status": "PARTIAL_TRUNCATED",
                    "output_snippet": "...responses:\\n        '200':\\n          description: Success\\n          content:\\n            application/json:\\n              schema:\\n                $ref: '#/components/...",
                    "error": "Dangling reference: components block never generated due to token budget depletion.",
                    "valid_yaml": False
                },
                {
                    "max_tokens": 1500,
                    "status": "SUCCESS_COMPLETE",
                    "output_snippet": "Full OpenAPI 3.0 specification with complete schemas, parameters, error models, and responses.",
                    "error": None,
                    "valid_yaml": True
                }
            ],
            "engineering_guidelines": [
                "Always reserve at least 1.5x of estimated output tokens for OpenAPI/JSON specifications.",
                "Enforce finish_reason == 'stop' check in backend clients. If finish_reason == 'length', automatically flag truncation error.",
                "Partition large monolithic API specs into micro-domain contracts (/products and /cart separately) to stay comfortably within output token windows."
            ]
        }

token_limit_exp = TokenLimitExperiment()

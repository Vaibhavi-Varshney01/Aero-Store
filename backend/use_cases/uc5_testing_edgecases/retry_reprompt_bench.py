"""
USE CASE 5: Retry vs Re-prompt Output Validation Benchmark
Contrasts naive re-prompting against targeted error-diff schema retry for automated CI/CD convergence.
"""
from typing import Dict, Any

class RetryVsRepromptBenchmark:
    @staticmethod
    def get_benchmark_data() -> Dict[str, Any]:
        return {
            "title": "Output Validation: Blind Re-Prompting vs Targeted Schema Retry",
            "scenario": "LLM synthesized test case with missing required field 'expectedResult'",
            "metrics": [
                {
                    "metric": "Success Rate (1st Attempt)",
                    "naive_reprompt": "35%",
                    "targeted_retry": "98%",
                    "improvement": "+63% reliability"
                },
                {
                    "metric": "Average Tokens Consumed",
                    "naive_reprompt": "1,450 tokens",
                    "targeted_retry": "180 tokens",
                    "improvement": "87.6% token reduction"
                },
                {
                    "metric": "Latency to Convergence",
                    "naive_reprompt": "4,200 ms (avg 3.2 roundtrips)",
                    "targeted_retry": "650 ms (avg 1.05 roundtrips)",
                    "improvement": "6.4x faster"
                },
                {
                    "metric": "Non-Deterministic Drift",
                    "naive_reprompt": "High (model alters already correct code fields)",
                    "targeted_retry": "Zero (model only patches the targeted violation)",
                    "improvement": "100% stable AST"
                }
            ],
            "sample_error_diff_sent": {
                "validation_error": "jsonschema.exceptions.ValidationError: 'expectedResult' is a required property",
                "violating_instance": "{\"testName\": \"test_cart_limit\", \"codeSnippet\": \"...\"}",
                "retry_instruction": "JSON Schema violation: Property 'expectedResult' is required. Supply valid string for 'expectedResult' without altering existing fields."
            }
        }

retry_benchmark = RetryVsRepromptBenchmark()

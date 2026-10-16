"""
USE CASE 4: SonarQube-Style AST Static Code Analyzer
Inspects Python code for:
- Missing None/null checks
- Cyclomatic complexity (McCabe metric)
- Hardcoded secrets and credential patterns
- Fake/hallucinated API calls
"""
import ast
import re
from typing import Dict, Any, List

class AstCodeAnalyzer:
    def __init__(self):
        self.secret_patterns = [
            (r'(?i)(api[_-]?key|secret|password|token)\s*=\s*["\'][a-zA-Z0-9_\-]{16,}["\']', "Potential Hardcoded Secret / API Key"),
            (r'bearer\s+[a-zA-Z0-9_\-]{20,}', "Hardcoded Bearer Token")
        ]

    def analyze_source_code(self, source_code: str, filename: str = "order_service.py") -> Dict[str, Any]:
        issues = []
        complexity_metrics = []

        try:
            tree = ast.parse(source_code)
        except SyntaxError as e:
            return {
                "filename": filename,
                "syntax_valid": False,
                "error": str(e),
                "issues": [{"type": "SYNTAX_ERROR", "line": e.lineno, "message": str(e)}]
            }

        # 1. Cyclomatic Complexity & Missing Null Checks
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                complexity = self._calculate_cyclomatic_complexity(node)
                complexity_metrics.append({
                    "function_name": node.name,
                    "complexity": complexity,
                    "line": node.lineno,
                    "rating": "HIGH (>10)" if complexity > 10 else "MODERATE (6-10)" if complexity > 5 else "LOW (1-5)"
                })
                if complexity > 8:
                    issues.append({
                        "type": "HIGH_COMPLEXITY",
                        "line": node.lineno,
                        "function": node.name,
                        "message": f"Function '{node.name}' has high cyclomatic complexity ({complexity}). Consider breaking into helper methods."
                    })

                # Check for parameter usage without None check
                arg_names = [arg.arg for arg in node.args.args if arg.arg != 'self']
                has_none_check = any(
                    isinstance(n, ast.If) and any(isinstance(test, ast.Compare) for test in ast.walk(n.test))
                    for n in ast.walk(node)
                )
                if arg_names and not has_none_check and len(node.body) > 3:
                    issues.append({
                        "type": "MISSING_NULL_CHECK",
                        "line": node.lineno,
                        "function": node.name,
                        "message": f"Parameters {arg_names} accessed without defensive None/empty validation."
                    })

        # 2. Hardcoded Secrets Scan
        lines = source_code.splitlines()
        for idx, line in enumerate(lines, start=1):
            for pattern, msg in self.secret_patterns:
                if re.search(pattern, line):
                    issues.append({
                        "type": "HARDCODED_SECRET",
                        "line": idx,
                        "message": msg
                    })

        # 3. Detect Hallucinated / Deprecated API Calls
        hallucinated_endpoints = ["/api/orders/place_now", "/api/v2/payment/charge_card", "stripe.Payment.instant_charge"]
        for endpoint in hallucinated_endpoints:
            if endpoint in source_code:
                issues.append({
                    "type": "HALLUCINATED_API",
                    "line": 0,
                    "message": f"Reference to non-existent / deprecated API signature: '{endpoint}'"
                })

        overall_complexity = max((m["complexity"] for m in complexity_metrics), default=1)
        complexity_grade = "A" if overall_complexity <= 5 else "B" if overall_complexity <= 8 else "C"

        return {
            "filename": filename,
            "syntax_valid": True,
            "overall_complexity_score": f"{complexity_grade} (Max Complexity: {overall_complexity})",
            "function_metrics": complexity_metrics,
            "detected_issues": issues,
            "total_issues_count": len(issues)
        }

    def _calculate_cyclomatic_complexity(self, func_node: ast.AST) -> int:
        complexity = 1
        for node in ast.walk(func_node):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1
        return complexity

ast_code_analyzer = AstCodeAnalyzer()

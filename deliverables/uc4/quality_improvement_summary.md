# Use Case 4: Quality Improvement Summary & Sonar vs AI Comparison

## 1. SonarQube Static Analysis vs AI Semantic Review Comparison

| Comparison Dimension | SonarQube Static Rules | Capgemini GenAI Review (`openai.gpt-4o`) | Complementary Value |
|---|---|---|---|
| **Hardcoded Secrets** | Matches regex patterns (`api_key = ...`). | Detects secrets, notes blast radius in git history, and auto-generates `os.getenv()` wrapper. | AI provides contextual remediation code. |
| **Cyclomatic Complexity** | Computes McCabe complexity mathematically (12). | Recognizes 5 levels of nested `if` statements and refactors into clean guard clauses. | Sonar flags the threshold; AI performs the refactor. |
| **Hallucinated APIs** | Misses dynamic string paths without full symbol table. | Flags that `/api/orders/place_now` conflicts with OpenAPI contract `/api/v1/orders`. | AI bridges semantic contract discrepancies. |
| **Licensing Governance** | Requires external subscription (FOSSA/BlackDuck). | Parses `requirements.txt` and flags copyleft risks (GPL-3.0) against commercial SaaS policy. | Rapid zero-dependency license triage. |

---

## 2. Before vs After Quality Metrics

```
┌───────────────────────────────────────┬───────────────────┬───────────────────┐
│ Metric Dimension                      │ Legacy Baseline   │ Refactored Code   │
├───────────────────────────────────────┼───────────────────┼───────────────────┤
│ Cyclomatic Complexity (McCabe)        │ 12 (High)         │ 2 (Optimal)       │
│ Cognitive Complexity                  │ 16 (Violates SLA) │ 1 (Clean)         │
│ Hardcoded Secrets Detected            │ 1 Blocker         │ 0 (Externalized)  │
│ Hallucinated API Endpoints            │ 1 Critical        │ 0 (Contract-First)│
│ Defensive Null / None Checks          │ 0 (Vulnerable)    │ 4 Guard Clauses   │
│ Maintainability Rating                │ D                 │ A                 │
└───────────────────────────────────────┴───────────────────┴───────────────────┘
```

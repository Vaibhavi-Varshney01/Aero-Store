# Use Case 1: Explanation of Temperature & Token Control Used

## 1. Temperature Control Strategy

The `temperature` hyperparameter modulates the flatness of the probability distribution over the model's vocabulary during generation:

$$P(w_i) = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$

* When $T \to 0$ (greedy decoding), the model selects only the highest-probability token at each step, yielding maximally deterministic and repeatable output.
* When $T > 0.7$, probability mass is distributed more evenly, increasing entropy and creative divergence.

### Hyperparameter Settings by Engineering Domain

| System Module | Temperature | Target Rationale |
|---|---|---|
| **Use Case 2: OpenAPI Scaffolding** | `0.0` | Eliminates syntax deviations; ensures 100% compliant YAML indentation and schema references. |
| **Use Case 4: Code Review & Static Analysis** | `0.1` | Minimizes hallucinated security issues; ensures consistent cyclomatic complexity scoring. |
| **Use Case 5: AI Test Case Synthesis** | `0.2` | Balances strict syntactic validity in assertions with slight diversity in edge case test naming. |
| **Storefront Chatbot (Customer Inquiries)** | `0.4` | Enables friendly, conversational replies while remaining strictly anchored to catalog facts. |

---

## 2. Context Window & Token Governance

### Context Budgets for `openai.gpt-4o`
* **Maximum Context Window:** 128,000 tokens
* **Target Request Budget:** < 2,000 tokens per operational call

### Token Conservation Strategies Applied:
1. **Targeted Error Diffs:** Rather than re-prompting the full conversation on schema validation failure, only the JSON Schema error diff (~50 tokens) is submitted for correction.
2. **Context Window Sliding:** Chat history is capped at the last 6 turns to avoid linear token bloat.
3. **Pydantic Model Enclosure:** Enforcing strict Pydantic schemas prevents conversational filler ("Sure, here is the YAML you requested..."), cutting completion tokens by 40%.

# Use Case 2: Prompt Refinement Documentation & Token Limit Experiment

## 1. Production API Scaffolding Prompt Engineering

### Prompt Evolution

#### Baseline Iteration 1 (Flawed - Hallucinates Non-Standard Error Format)
```text
Generate a backend API for products and shopping cart.
```
* **Issues:** Generated arbitrary JSON error keys (`{"err": "item gone"}`) with HTTP 200 return codes for errors, missing HTTP status codes, and omitted OpenAPI spec.

#### Refined Iteration 2 (Compliant - Strict Contract & Error Model)
```text
You are a backend engineer.
Generate an OpenAPI 3.0.3 specification for the Product and Cart Services.
Endpoints:
• GET /products
• GET /products/{id}
• POST /products
• GET /cart
• POST /cart/items
Constraints:
• Include proper HTTP status codes (200, 201, 404, 409, 422, 500)
• Implement structured error model strictly conforming to RFC 7807 Problem Details
• Versioning: v1
• Output strictly in OpenAPI YAML format without markdown preamble
```
* **Outcome:** 100% compliant OpenAPI 3.0 specification with zero hallucinated paths and complete schema definitions.

---

## 2. Max Token Limit Experiment

To identify token cliff boundaries, the OpenAPI scaffolding prompt was executed across varying `max_tokens` limits:

| Max Tokens | Completion Status | Resulting Output State | Schema Integrity |
|---|---|---|---|
| **50 tokens** | `FAILED_TRUNCATED` | Incomplete YAML: Premature EOF after info block | ❌ Broken syntax, unparseable |
| **200 tokens** | `PARTIAL_TRUNCATED`| Dangling `$ref: '#/components/schemas/Product'` with missing components | ❌ Dangling pointers, invalid schema |
| **800 tokens** | `SUCCESS_COMPLETE` | Complete specification with all paths and models | ✅ 100% valid YAML and OpenAPI 3.0 |

### Key Takeaway for CI/CD Pipelines
Always configure backend clients to inspect `finish_reason`. If `finish_reason == "length"`, trigger an automated warning rather than attempting to parse partial payloads.

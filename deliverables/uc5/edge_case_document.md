# Use Case 5: Edge Case Catalog & Live Simulation Documentation

## 1. Edge Case Catalog

### Edge Case 1: Out-of-Stock Flash Sale Contention
* **Scenario:** Two customers simultaneously submit an order for the final remaining unit of a limited-edition flash sale item (`PROD-105`).
* **Root Cause:** Unsynchronized read-modify-write cycles in distributed databases cause race conditions where both threads perceive `stock >= 1`.
* **Business Impact:** Overselling, customer dissatisfaction, backorder overhead, negative brand reputation.
* **Technical Mitigation:** Atomic database-level stock decrement (`UPDATE inventory SET stock = stock - qty WHERE product_id = :id AND stock >= qty`). Throws `OutOfStockException` (HTTP 409 Conflict) if affected rows = 0.

---

### Edge Case 2: Payment Gateway SLA Timeout (>1500ms) & Saga Rollback
* **Scenario:** Upstream payment processor encounters network latency (>1500ms SLA).
* **Root Cause:** Congested third-party card networks or ISP routing drops.
* **Business Impact:** Blocked customer checkout sessions, orphan holds on customer credit card limits without order generation.
* **Technical Mitigation:** Strict 1500ms timeout watchdog using cancellation tokens. On SLA breach, an automated Compensating Saga transaction voids temporary authorizations and restores reserved inventory.

---

### Edge Case 3: Invalid & Expired Coupon Code Injection
* **Scenario:** Customer attempts to apply expired coupon `EXPIRED30` or applies `MINSPEND100` on an order below the $100 minimum threshold.
* **Root Cause:** Client-side only validation bypassed or cached coupon data used by client.
* **Business Impact:** Unauthorized discount erosion, revenue leakage.
* **Technical Mitigation:** Server-side validation enforcing date invariants and minimum cart spend thresholds before discount deduction. Throws RFC 7807 `CouponException` with clear error details.

---

### Edge Case 4: Concurrent Cart Modification (Optimistic Concurrency Control - OCC)
* **Scenario:** A customer has the store open on both mobile and desktop. Device A adds an item while Device B edits quantities simultaneously.
* **Root Cause:** Without concurrency tokens, the second write silently overwrites and deletes the first device's cart changes ("Lost Update Problem").
* **Business Impact:** Unintended order contents, customer confusion, chargebacks.
* **Technical Mitigation:** Optimistic Concurrency Control (OCC). Every mutation increments `concurrency_version`. Client writes must supply `expected_version`. If versions clash, server rejects with `CONCURRENT_MODIFICATION` (HTTP 409 Conflict) and prompts client to refresh state.

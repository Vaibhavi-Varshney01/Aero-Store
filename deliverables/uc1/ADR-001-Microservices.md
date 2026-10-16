# ADR-001: Adoption of Contract-First Microservices Architecture for Online Shopping

## Status
Accepted

## Context
The retail organization is designing an Online Shopping System expected to support 10,000+ concurrent users with fluctuating traffic spikes during promotional events (flash sales, holiday promotions). 
The application includes Product Catalog, Shopping Cart, Checkout/Order Management, Payment Gateway, and User Identity.

A monolithic architecture was initially evaluated. However, tight database coupling between read-heavy catalog operations and ACID-critical payment settlement introduces the following risks:
1. Catalog traffic surges could saturate connection pools, blocking checkout and payment transactions.
2. Inability to scale stateless catalog caches independently from stateful payment ledgers.
3. High deployment blast radius: A minor bug in promo banner rendering could crash the payment engine.

## Decision
We adopt a **Contract-First Microservices Architecture** with the following boundaries:
1. **Product Catalog Service**: Read-optimized, cached via Redis, backed by MongoDB/PostgreSQL.
2. **Cart Service**: Fast in-memory state with Optimistic Concurrency Control (OCC) version tokens.
3. **Order Service**: Transactional coordinator implementing Saga orchestrations.
4. **Payment Service**: Isolated, append-only financial ledger with strict SLA timeout enforcement.
5. **Contract-First OpenAPI 3.0 Specs**: All service interactions are governed by formal OpenAPI contracts with RFC 7807 error models.

## Consequences
### Positive
- Independent horizontal scaling: Catalog can scale to 50 pods during flash sales while Payment remains right-sized.
- Fault isolation: A failure in product search does not impact ongoing checkout sessions.
- Clear team ownership and autonomous deployment pipelines.

### Negative
- Increased operational complexity (requires distributed tracing, API gateways, and saga rollbacks).
- Eventual consistency challenges between cart reservations and inventory stock.

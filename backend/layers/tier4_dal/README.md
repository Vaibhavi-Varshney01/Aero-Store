# Tier 4: Data Access Layer (DAL / Repository Tier)

## Overview
The Data Access Layer is responsible for abstracting the physical database from the application services. It provides high-level domain query methods, transaction boundary management, and schema-to-object mapping.

## Repositories
1. **Base Repository** (`BaseRepository`):
   - Manages connection lifecycle and ACID transaction boundaries (`with self.transaction(): ...`).
   - Handles automatic commits on success and rollbacks on exceptions.
2. **Product Repository** (`ProductRepository`):
   - Queries products with category and search filters.
   - Updates stock counts in SSMS and maintains thread-safe cached state.
3. **Order Repository** (`OrderRepository`):
   - Inserts order records and line items transactionally.
   - Fetches customer order history and manages status transitions (`CONFIRMED` $\to$ `DISPATCHED` $\to$ `DELIVERED`).
4. **User Repository** (`UserRepository`):
   - Handles user account creation, unique email lookups, and PBKDF2 hash verification retrievals.
   - Records and revokes bearer session tokens in the `sessions` table.
5. **Coupon Repository** (`CouponRepository`):
   - Queries promo codes against the `coupons` table in SSMS with threshold rules.

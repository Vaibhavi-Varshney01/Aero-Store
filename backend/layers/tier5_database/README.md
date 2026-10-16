# Tier 5: Database Tier (Persistence & Storage Layer)

## Overview
The Database Tier provides persistent, durable ACID storage for all e-commerce transactional data in Microsoft SQL Server (SSMS).

- **Database Engine**: Microsoft SQL Server (2016+ / Azure SQL / LocalDB)
- **Database Name**: `AeroStoreDB`
- **Driver**: ODBC Driver 17 / 18 for SQL Server via `pyodbc`
- **Schema Script**: [`backend/sql/ssms_schema_and_seed.sql`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/backend/sql/ssms_schema_and_seed.sql)
- **Verification Utility**: [`backend/sql/verify_ssms.py`](file:///c:/Users/vaibvars/OneDrive%20-%20Capgemini/Desktop/L1_UseCases/backend/sql/verify_ssms.py)

## Database Tables
1. `[users]`: User identities, salted PBKDF2 password hashes, and assigned roles.
2. `[sessions]`: Active bearer authentication tokens with foreign key cascade to `users`.
3. `[products]`: Hardware product catalog, prices, categories, and inventory stocks.
4. `[orders]`: Order headers, customer associations, total amounts, and fulfillment statuses.
5. `[order_items]`: Line items with foreign keys to orders and products.
6. `[coupons]`: Promotional codes, percentage discounts, and minimum order values.

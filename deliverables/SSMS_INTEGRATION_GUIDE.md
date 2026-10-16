# AeroStore SSMS (SQL Server Management Studio) Integration Guide

This guide details how to integrate your **AeroStore E-Commerce Platform** backend directly with **SQL Server Management Studio (SSMS)** and Microsoft SQL Server.

---

## Step 1: Open SSMS and Execute the SQL Script

1. Launch **SQL Server Management Studio (SSMS)** on your system.
2. Connect to your local SQL Server instance:
   - **Server Name**: `localhost` or `localhost\SQLEXPRESS` or `(localdb)\MSSQLLocalDB` (or your machine name).
   - **Authentication**: `Windows Authentication` (or SQL Server Authentication).
3. Open the T-SQL script included in this repository:
   ```text
   backend/sql/ssms_schema_and_seed.sql
   ```
4. Click **Execute** (or press **F5**).

> [!SUCCESS]
> The script will automatically:
> - Create the `AeroStoreDB` database.
> - Create tables: `users`, `sessions`, `products`, `orders`, `order_items`, and `coupons`.
> - Add index constraints and seed default demo data (demo customer `jane.doe@example.com` and product catalog `PROD-101` .. `PROD-106`).

---

## Step 2: Install `pyodbc` Python Driver

Make sure `pyodbc` is installed in your Python environment:

```bash
pip install pyodbc
```

---

## Step 3: Configure Backend Environment for SSMS

You can configure your environment variables via terminal, `.env` file, or system environment.

### Option A: Windows PowerShell Environment Variables
```powershell
$env:DB_ENGINE="mssql"
$env:MSSQL_SERVER="localhost"          # Or localhost\SQLEXPRESS or (localdb)\MSSQLLocalDB
$env:MSSQL_DATABASE="AeroStoreDB"
$env:MSSQL_TRUSTED_CONNECTION="true"  # Use Windows Authentication
```

### Option B: `.env` File (in Workspace Root)
Create or update `.env` in the root directory:
```env
DB_ENGINE=mssql
MSSQL_SERVER=localhost
MSSQL_DATABASE=AeroStoreDB
MSSQL_DRIVER=ODBC Driver 17 for SQL Server
MSSQL_TRUSTED_CONNECTION=true
```

---

## Step 4: Verify Connection using Diagnostic Utility

Run the diagnostic verification script:

```bash
python backend/sql/verify_ssms.py
```

Expected Output:
```text
======================================================================
 AeroStore SSMS / MS SQL Server Diagnostic Utility
======================================================================
[SUCCESS] 'pyodbc' is installed.

Available ODBC Drivers on this system:
  - ODBC Driver 17 for SQL Server

Configured Connection String:
  DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=AeroStoreDB;Trusted_Connection=yes;TrustServerCertificate=yes;

Attempting connection to SSMS / SQL Server...
[SUCCESS] Successfully connected to SSMS / MS SQL Server!

Tables found in database [AeroStoreDB]:
  - Table 'users': 1 row(s)
  - Table 'sessions': 0 row(s)
  - Table 'products': 6 row(s)
  - Table 'orders': 0 row(s)
  - Table 'order_items': 0 row(s)
  - Table 'coupons': 3 row(s)

[COMPLETE] AeroStore SSMS Integration Verification Passed!
```

---

## Step 5: Run the Backend with SSMS

Start the application with SQL Server database persistence:

```bash
python run.py
```

Or using uvicorn directly:
```bash
uvicorn backend.main:app --reload
```

---

## Troubleshooting & Tips

- **Cannot Connect to Server / Server Not Found**:
  Check SSMS connection dialog for your exact instance name. If using SQL Express, set `MSSQL_SERVER="localhost\SQLEXPRESS"`.
- **Driver Not Found**:
  Check available drivers output by `python backend/sql/verify_ssms.py`. If your system has `ODBC Driver 18 for SQL Server` or `SQL Server Native Client 11.0`, update `MSSQL_DRIVER` accordingly in `.env`.
- **Fallback to SQLite**:
  If you ever want to run without SSMS, set `DB_ENGINE="sqlite"` (or clear the variable), and the backend automatically switches back to local SQLite database `aerostore.db`.

"""
SSMS / MS SQL Server Connection Diagnostic Script
Run this script to verify your SSMS setup and connection to AeroStoreDB.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

def main():
    print("=" * 70)
    print(" AeroStore SSMS / MS SQL Server Diagnostic Utility")
    print("=" * 70)

    # 1. Check pyodbc installation
    try:
        import pyodbc
        print("[SUCCESS] 'pyodbc' is installed.")
    except ImportError:
        print("[ERROR] 'pyodbc' is NOT installed in your active Python environment.")
        print("        Install it using: pip install pyodbc")
        return

    # 2. List installed SQL Server ODBC Drivers
    drivers = [d for d in pyodbc.drivers() if 'SQL' in d or 'ODBC' in d]
    print("\nAvailable ODBC Drivers on this system:")
    if drivers:
        for d in drivers:
            print(f"  - {d}")
    else:
        print("  [WARNING] No standard SQL Server drivers found in pyodbc.drivers().")

    # 3. Test connection string
    from backend.core.config import settings
    from backend.core.database import build_mssql_connection_string

    conn_str = build_mssql_connection_string()
    print(f"\nConfigured Connection String:")
    print(f"  {conn_str}")

    print("\nAttempting connection to SSMS / SQL Server...")
    try:
        conn = pyodbc.connect(conn_str, timeout=5)
        cursor = conn.cursor()
        print("[SUCCESS] Successfully connected to SSMS / MS SQL Server!")

        # Query tables
        cursor.execute("""
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        """)
        tables = [row[0] for row in cursor.fetchall()]
        print(f"\nTables found in database [{settings.db.mssql_database}]:")
        for t in tables:
            cursor.execute(f"SELECT COUNT(*) FROM [{t}]")
            cnt = cursor.fetchone()[0]
            print(f"  - Table '{t}': {cnt} row(s)")

        conn.close()
        print("\n[COMPLETE] AeroStore SSMS Integration Verification Passed!")
    except Exception as e:
        print(f"\n[CONNECTION FAILED] Unable to connect to SSMS instance:")
        print(f"  Details: {e}")
        print("\nTroubleshooting Tips:")
        print("  1. Make sure SSMS SQL Server instance is running.")
        print("  2. Run the file 'backend/sql/ssms_schema_and_seed.sql' in SSMS first.")
        print("  3. Set environment variable MSSQL_SERVER='localhost\\SQLEXPRESS' or '(localdb)\\MSSQLLocalDB' if using Express or LocalDB.")
        print("  4. Set DB_ENGINE=mssql in your environment or .env file.")

if __name__ == "__main__":
    main()

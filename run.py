"""
AeroStore Central Launcher - Beginner & Mentor Friendly Unified Runner
Usage:
  python run.py          # Starts Backend & serves React Storefront (http://127.0.0.1:8000)
  python run.py --test   # Runs Automated Pytest Verification Suite (41 tests)
  python run.py --ssms   # Runs MS SQL Server (SSMS) Diagnostics & Connection Check
  python run.py --cli    # Interactive Terminal Console Chatbot
  python run.py --help   # Displays Launcher Options
"""
import sys
import os

# Reconfigure stdout/stderr for Windows console compatibility
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Add package root to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

def check_db_engine_status():
    """Detects active database engine and returns a friendly status string."""
    try:
        from backend.core.database import db
        if db.engine_type == "mssql" and db.conn:
            return "🟢 Microsoft SQL Server / SSMS (Database: AeroStoreDB)"
        elif db.engine_type == "mssql":
            return "🟡 MSSQL Configured (Connecting via ODBC Driver)"
        else:
            return "🟢 Dual-Engine In-Memory SQLite (Zero Setup Required)"
    except Exception:
        return "🟢 In-Memory Database Mode"

def main():
    args = sys.argv[1:]

    if "--help" in args or "-h" in args:
        print("""
======================================================================
  🛒 AeroStore E-Commerce Platform Launcher Commands
======================================================================
  python run.py          : Launch full platform (FastAPI + React Web Storefront)
  python run.py --test   : Run all 41 unit & integration automated tests
  python run.py --ssms   : Run SQL Server (SSMS) connection diagnostic test
  python run.py --cli    : Start Interactive Terminal Chatbot
  python run.py --help   : Display this help message

  📖 Mentor Presentation Guide: See MENTOR_PRESENTATION_GUIDE.md
======================================================================
        """)
        return

    if "--cli" in args:
        from cli import run_cli
        run_cli()
    elif "--test" in args:
        import pytest
        sys.exit(pytest.main(["tests", "-v"]))
    elif "--ssms" in args:
        import subprocess
        subprocess.run([sys.executable, "backend/sql/verify_ssms.py"])
    else:
        import uvicorn
        from backend.core.config import settings
        db_status = check_db_engine_status()

        print(f"==================================================================")
        print(f"🛒 Welcome to {settings.app_name} v{settings.version}")
        print(f"🎯 5 AI Engineering Use Cases & Enterprise E-Commerce Platform")
        print(f"==================================================================")
        print(f"🌐 React Web Storefront:   http://{settings.host}:{settings.port}")
        print(f"📚 OpenAPI Swagger Docs:    http://{settings.host}:{settings.port}/docs")
        print(f"🗄️ Database Persistence:   {db_status}")
        print(f"------------------------------------------------------------------")
        print(f"👤 Demo Customer Account:  jane.doe@example.com (Password: password123)")
        print(f"🛡️ Demo Admin Account:     admin@example.com    (Password: password123)")
        print(f"🎓 Mentor Presentation:    See MENTOR_PRESENTATION_GUIDE.md")
        print(f"💡 Stop Server:            Press Ctrl + C")
        print(f"==================================================================\n")

        uvicorn.run(
            "backend.main:app",
            host=settings.host,
            port=settings.port,
            reload=True,
            log_level="info"
        )

if __name__ == "__main__":
    main()

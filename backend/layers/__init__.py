"""
Enterprise N-Tier Layers Package
Exposes the physical layer folders of the 5-Tier architecture:
  - tier1_presentation: Frontend Client SPA (React 18)
  - tier2_api: REST API Controllers & Transport Routers (FastAPI)
  - tier3_bll: Business Logic Layer / Application Domain Services
  - tier4_dal: Data Access Layer / Repositories
  - tier5_database: Microsoft SQL Server (SSMS) Persistence & Schemas
"""
from . import tier2_api
from . import tier3_bll
from . import tier4_dal
from . import tier5_database

__all__ = [
    "tier2_api",
    "tier3_bll",
    "tier4_dal",
    "tier5_database"
]

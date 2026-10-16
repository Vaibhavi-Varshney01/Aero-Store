"""
FastAPI Application Entrypoint
Unifies E-Commerce REST APIs, AI Chatbot, and 5-Use-Case Engine with RFC 7807 Error Handling.
"""
import os
from pathlib import Path
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .core.error_model import DomainException, ProblemDetails
from .layers.tier2_api import (
    products_router,
    cart_router,
    checkout_router,
    payments_router,
    chatbot_router,
    usecases_router as use_cases_router,
    rag_router,
    auth_router,
)

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Enterprise E-Commerce Platform with Embedded AI Chatbot & Complete 5 AI Engineering Use Cases."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global RFC 7807 Domain Exception Handler
@app.exception_handler(DomainException)
async def domain_exception_handler(request: Request, exc: DomainException):
    problem = ProblemDetails(
        type=f"https://ecommerce.capgemini.com/errors/{exc.error_code.lower()}",
        title=exc.title,
        status=exc.status,
        detail=exc.detail,
        instance=str(request.url),
        error_code=exc.error_code,
        invalid_params=exc.invalid_params
    )
    return JSONResponse(
        status_code=exc.status,
        content=problem.model_dump(exclude_none=True),
        headers={"Content-Type": "application/problem+json"}
    )

# Include API Routers under /api/v1
api_prefix = "/api/v1"
app.include_router(products_router, prefix=api_prefix)
app.include_router(cart_router, prefix=api_prefix)
app.include_router(checkout_router, prefix=api_prefix)
app.include_router(payments_router, prefix=api_prefix)
app.include_router(chatbot_router, prefix=api_prefix)
app.include_router(use_cases_router, prefix=api_prefix)
app.include_router(rag_router, prefix=api_prefix)
app.include_router(auth_router, prefix=api_prefix)

# Mount Static Assets & Templates
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = BASE_DIR / "frontend" / "static"
TEMPLATES_DIR = BASE_DIR / "frontend" / "templates"
REACT_DIST_DIR = BASE_DIR / "frontend-react" / "dist"

if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

if (REACT_DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(REACT_DIST_DIR / "assets")), name="react-assets")

@app.get("/", summary="Serve Accessible Storefront")
async def serve_index():
    react_index = REACT_DIST_DIR / "index.html"
    if react_index.exists():
        return FileResponse(str(react_index))
    index_file = TEMPLATES_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    return {"message": "Welcome to E-Commerce Platform API", "docs": "/docs"}

@app.get("/health", summary="Health Check")
async def health_check():
    return {"status": "HEALTHY", "version": settings.version}

@app.get("/{full_path:path}", summary="SPA Fallback Route")
async def spa_fallback(full_path: str):
    if full_path.startswith("api/") or full_path.startswith("static/") or full_path.startswith("assets/") or full_path in ("docs", "openapi.json", "redoc"):
        raise HTTPException(status_code=404, detail="Resource not found")
    react_index = REACT_DIST_DIR / "index.html"
    if react_index.exists():
        return FileResponse(str(react_index))
    index_file = TEMPLATES_DIR / "index.html"
    if index_file.exists():
        return FileResponse(str(index_file))
    raise HTTPException(status_code=404, detail="Page not found")

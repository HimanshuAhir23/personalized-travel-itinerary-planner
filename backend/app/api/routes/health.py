"""Health check endpoint."""

from datetime import datetime, UTC
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health Check")
async def health_check() -> dict:
    """Return API health status, service name, and timestamp."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(UTC).isoformat(),
        "version": "1.0.0",
    }

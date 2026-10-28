"""FastAPI dependencies for authentication, database access, and services."""

from typing import Any, Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import Settings, get_settings
from app.core.security import verify_supabase_token
from app.db.supabase import get_admin_client, get_supabase_client
from app.services.itinerary.generator import ItineraryGenerator
from app.services.trips.trip_service import TripService

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
    settings: Settings = Depends(get_settings),
) -> dict[str, Any]:
    """Extract and validate the JWT Bearer token from the request header."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header with Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    user = verify_supabase_token(token)
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security),
) -> Optional[dict[str, Any]]:
    """Optional user dependency for public or semi-public routes."""
    if not credentials or not credentials.credentials:
        return None
    try:
        return verify_supabase_token(credentials.credentials)
    except Exception:
        return None


def get_trip_service(
    admin_client: Any = Depends(get_admin_client),
) -> TripService:
    """Dependency injection for TripService."""
    return TripService(supabase_client=admin_client)


def get_itinerary_generator() -> ItineraryGenerator:
    """Dependency injection for ItineraryGenerator."""
    return ItineraryGenerator()

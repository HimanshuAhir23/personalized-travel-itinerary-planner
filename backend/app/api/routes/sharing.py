"""Trip sharing routes for generating public read-only links and viewing shared trips."""

from typing import Any
from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user, get_trip_service
from app.core.config import settings
from app.schemas.sharing import (
    ShareTripCreate,
    ShareTripResponse,
    SharedTripView,
)
from app.services.trips.trip_service import TripService

router = APIRouter(tags=["Sharing"])


@router.post("/trips/{trip_id}/share", response_model=ShareTripResponse, status_code=status.HTTP_201_CREATED, summary="Create public share link for a trip")
async def share_trip(
    trip_id: str,
    share_options: ShareTripCreate = ShareTripCreate(),
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Create a shareable public URL with optional fork permission and expiry."""
    res = await trip_service.create_share_link(
        trip_id=trip_id,
        user_id=current_user["id"],
        allow_fork=share_options.allow_fork,
        expires_in_days=share_options.expires_in_days,
        frontend_url=settings.FRONTEND_URL,
    )
    return res


@router.delete("/trips/{trip_id}/share", status_code=status.HTTP_200_OK, summary="Revoke public share links for trip")
async def revoke_share_trip(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> dict[str, Any]:
    """Revoke and deactivate public sharing for a trip."""
    await trip_service.revoke_share_link(trip_id=trip_id, user_id=current_user["id"])
    return {"success": True, "message": "Share link has been revoked"}


@router.get("/shared/{share_token}", response_model=SharedTripView, summary="View a shared trip (public)")
async def get_shared_trip(
    share_token: str,
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Public read-only endpoint to access shared trip and itinerary without authentication."""
    data = await trip_service.get_shared_trip(share_token=share_token)
    return data

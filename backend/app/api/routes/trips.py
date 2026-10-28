"""Trip CRUD API endpoints."""

from typing import Any
from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user, get_trip_service
from app.schemas.trip import TripCreate, TripResponse, TripUpdate
from app.services.trips.trip_service import TripService

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED, summary="Create a new trip")
async def create_trip(
    trip_data: TripCreate,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Create a new trip associated with the current user."""
    trip = await trip_service.create_trip(user_id=current_user["id"], trip_data=trip_data)
    return trip


@router.get("", response_model=list[TripResponse], summary="List all user trips")
async def list_trips(
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Retrieve all trips belonging to the authenticated user."""
    trips = await trip_service.get_trips(user_id=current_user["id"])
    return trips


@router.get("/{trip_id}", response_model=TripResponse, summary="Get trip details")
async def get_trip(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Fetch a single trip by ID, ensuring user ownership."""
    trip = await trip_service.get_trip(trip_id=trip_id, user_id=current_user["id"])
    return trip


@router.patch("/{trip_id}", response_model=TripResponse, summary="Update trip")
async def update_trip(
    trip_id: str,
    trip_update: TripUpdate,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Update trip details."""
    updated_trip = await trip_service.update_trip(
        trip_id=trip_id,
        user_id=current_user["id"],
        data=trip_update,
    )
    return updated_trip


@router.delete("/{trip_id}", status_code=status.HTTP_200_OK, summary="Delete trip")
async def delete_trip(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> dict[str, Any]:
    """Delete a trip and its associated data."""
    await trip_service.delete_trip(trip_id=trip_id, user_id=current_user["id"])
    return {"success": True, "message": f"Trip {trip_id} deleted successfully"}

"""Itinerary generation, update, and activity management endpoints."""

from typing import Any
from fastapi import APIRouter, Depends, Query, status
from app.api.deps import (
    get_current_user,
    get_itinerary_generator,
    get_trip_service,
)
from app.schemas.itinerary import (
    Activity,
    ActivityCreate,
    ActivityUpdate,
    Itinerary,
    ItineraryUpdate,
    RegenerateRequest,
)
from app.schemas.trip import TripCreate
from app.services.itinerary.generator import ItineraryGenerator
from app.services.trips.trip_service import TripService

router = APIRouter(prefix="/trips/{trip_id}", tags=["Itinerary"])


def _trip_dict_to_create_schema(trip_dict: dict[str, Any]) -> TripCreate:
    """Helper to convert stored trip dict into TripCreate schema for generator."""
    return TripCreate(
        destination=trip_dict["destination"],
        start_date=trip_dict["start_date"],
        end_date=trip_dict["end_date"],
        travelers=trip_dict.get("travelers", 1),
        travel_group=trip_dict.get("travel_group", "solo"),
        budget=trip_dict.get("budget", 0.0),
        currency=trip_dict.get("currency", "USD"),
        budget_level=trip_dict.get("budget_level", "moderate"),
        interests=trip_dict.get("interests", []),
        travel_pace=trip_dict.get("travel_pace", "moderate"),
        accommodation_style=trip_dict.get("accommodation_style", "hotel"),
        transportation=trip_dict.get("transportation", ["public_transit"]),
        dietary_restrictions=trip_dict.get("dietary_restrictions", []),
        accessibility_needs=trip_dict.get("accessibility_needs", []),
        avoid_activities=trip_dict.get("avoid_activities", []),
        additional_notes=trip_dict.get("additional_notes", ""),
    )


@router.post("/generate", response_model=Itinerary, status_code=status.HTTP_200_OK, summary="Generate full trip itinerary")
async def generate_itinerary(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
    generator: ItineraryGenerator = Depends(get_itinerary_generator),
) -> Any:
    """Trigger AI generation of an optimized itinerary for the given trip."""
    trip = await trip_service.get_trip(trip_id=trip_id, user_id=current_user["id"])
    trip_create = _trip_dict_to_create_schema(trip)

    generated_itinerary = await generator.generate(trip=trip_create, trip_id=trip_id)
    saved = await trip_service.save_itinerary(
        trip_id=trip_id,
        user_id=current_user["id"],
        itinerary=generated_itinerary,
    )
    return saved


@router.get("/itinerary", response_model=Itinerary, summary="Get trip itinerary")
async def get_itinerary(
    trip_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Retrieve the generated itinerary for a trip."""
    itinerary = await trip_service.get_itinerary(trip_id=trip_id, user_id=current_user["id"])
    return itinerary


@router.patch("/itinerary", response_model=Itinerary, summary="Update itinerary")
async def update_itinerary(
    trip_id: str,
    itinerary_update: ItineraryUpdate,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Update high-level itinerary details or replaced day lists."""
    update_data = itinerary_update.model_dump(exclude_unset=True)
    updated = await trip_service.update_itinerary(
        trip_id=trip_id,
        user_id=current_user["id"],
        itinerary_data=update_data,
    )
    return updated


@router.post("/regenerate", response_model=Itinerary, summary="Regenerate whole itinerary or specific day")
async def regenerate_itinerary(
    trip_id: str,
    request: RegenerateRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
    generator: ItineraryGenerator = Depends(get_itinerary_generator),
) -> Any:
    """Regenerate a specific day or entire itinerary with updated instructions."""
    trip = await trip_service.get_trip(trip_id=trip_id, user_id=current_user["id"])
    trip_create = _trip_dict_to_create_schema(trip)

    if request.day_number is not None:
        # Regenerate specific day
        existing_data = await trip_service.get_itinerary(trip_id=trip_id, user_id=current_user["id"])
        existing_itinerary = Itinerary.model_validate(existing_data)

        new_day = await generator.regenerate_day(
            trip=trip_create,
            existing_itinerary=existing_itinerary,
            day_number=request.day_number,
            instructions=request.instructions or "",
        )

        # Replace day in existing itinerary
        updated_days = []
        for d in existing_itinerary.days:
            if d.day_number == request.day_number:
                updated_days.append(new_day)
            else:
                updated_days.append(d)

        existing_itinerary.days = updated_days
        # Optimize and recalculate
        optimized = generator.optimizer.optimize(existing_itinerary, trip_create)
        saved = await trip_service.save_itinerary(
            trip_id=trip_id,
            user_id=current_user["id"],
            itinerary=optimized,
        )
        return saved
    else:
        # Regenerate entire trip
        if request.instructions:
            trip_create.additional_notes = (
                f"{trip_create.additional_notes}. Special request: {request.instructions}".strip()
            )
        generated = await generator.generate(trip=trip_create, trip_id=trip_id)
        saved = await trip_service.save_itinerary(
            trip_id=trip_id,
            user_id=current_user["id"],
            itinerary=generated,
        )
        return saved


@router.post("/itinerary/activities", response_model=Activity, status_code=status.HTTP_201_CREATED, summary="Add activity to a day")
async def add_activity(
    trip_id: str,
    activity: ActivityCreate,
    day_number: int = Query(default=1, ge=1, description="Day number to add the activity to"),
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Add a new activity to a day in the trip itinerary."""
    created = await trip_service.add_activity(
        trip_id=trip_id,
        user_id=current_user["id"],
        day_number=day_number,
        activity_data=activity,
    )
    return created


@router.delete("/itinerary/activities/{activity_id}", summary="Delete activity from itinerary")
async def delete_activity(
    trip_id: str,
    activity_id: str,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> dict[str, Any]:
    """Remove an activity from any day in the trip itinerary."""
    res = await trip_service.remove_activity(
        trip_id=trip_id,
        user_id=current_user["id"],
        activity_id=activity_id,
    )
    return res


@router.patch("/itinerary/activities/{activity_id}", summary="Update activity in itinerary")
async def update_activity(
    trip_id: str,
    activity_id: str,
    activity_update: ActivityUpdate,
    current_user: dict[str, Any] = Depends(get_current_user),
    trip_service: TripService = Depends(get_trip_service),
) -> Any:
    """Update details of a specific activity."""
    res = await trip_service.update_activity(
        trip_id=trip_id,
        user_id=current_user["id"],
        activity_id=activity_id,
        update_data=activity_update,
    )
    return res

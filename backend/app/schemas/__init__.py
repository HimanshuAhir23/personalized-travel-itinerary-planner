"""Pydantic schemas package."""

from app.schemas.auth import (
    TokenResponse,
    User,
    UserLoginRequest,
    UserResponse,
    UserSignUpRequest,
)
from app.schemas.itinerary import (
    Activity,
    ActivityCreate,
    ActivityUpdate,
    Itinerary,
    ItineraryDay,
    ItineraryUpdate,
    RegenerateRequest,
)
from app.schemas.sharing import (
    ShareTripCreate,
    ShareTripResponse,
    SharedTripView,
)
from app.schemas.trip import (
    TripBase,
    TripCreate,
    TripResponse,
    TripUpdate,
)

__all__ = [
    "Activity",
    "ActivityCreate",
    "ActivityUpdate",
    "Itinerary",
    "ItineraryDay",
    "ItineraryUpdate",
    "RegenerateRequest",
    "ShareTripCreate",
    "ShareTripResponse",
    "SharedTripView",
    "TokenResponse",
    "TripBase",
    "TripCreate",
    "TripResponse",
    "TripUpdate",
    "User",
    "UserLoginRequest",
    "UserResponse",
    "UserSignUpRequest",
]

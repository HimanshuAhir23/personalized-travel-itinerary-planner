"""Tests for Pydantic schema validation across models."""

from datetime import date
import pytest
from pydantic import ValidationError
from app.schemas.auth import UserLoginRequest, UserSignUpRequest
from app.schemas.itinerary import Activity, Itinerary, ItineraryDay
from app.schemas.sharing import ShareTripCreate
from app.schemas.trip import TripCreate, TripUpdate


def test_valid_trip_create():
    """Verify that a valid TripCreate schema initializes correctly."""
    trip = TripCreate(
        destination="Rome, Italy",
        start_date=date(2026, 6, 1),
        end_date=date(2026, 6, 7),
        travelers=2,
        budget=2500.0,
        currency="EUR",
        interests=["history", "food"],
    )
    assert trip.destination == "Rome, Italy"
    assert trip.travelers == 2
    assert trip.currency == "EUR"
    assert trip.budget == 2500.0


def test_trip_create_invalid_dates():
    """Ensure end_date before start_date raises ValidationError."""
    with pytest.raises(ValidationError) as exc:
        TripCreate(
            destination="Paris, France",
            start_date=date(2026, 7, 10),
            end_date=date(2026, 7, 5),  # End before start
            travelers=1,
            budget=1000.0,
        )
    assert "end_date cannot be earlier than start_date" in str(exc.value)


def test_trip_create_invalid_travelers():
    """Ensure travelers count less than 1 raises ValidationError."""
    with pytest.raises(ValidationError):
        TripCreate(
            destination="Berlin, Germany",
            start_date=date(2026, 8, 1),
            end_date=date(2026, 8, 5),
            travelers=0,  # Invalid
            budget=500.0,
        )


def test_trip_create_negative_budget():
    """Ensure negative budget raises ValidationError."""
    with pytest.raises(ValidationError):
        TripCreate(
            destination="London, UK",
            start_date=date(2026, 9, 1),
            end_date=date(2026, 9, 5),
            travelers=1,
            budget=-100.0,  # Invalid
        )


def test_trip_update_valid_and_invalid():
    """Test partial update validation."""
    valid_update = TripUpdate(budget=3000.0, travel_pace="fast")
    assert valid_update.budget == 3000.0
    assert valid_update.travel_pace == "fast"

    with pytest.raises(ValidationError):
        TripUpdate(
            start_date=date(2026, 10, 10),
            end_date=date(2026, 10, 5),
        )


def test_activity_schema_defaults():
    """Test Activity model generation and default attributes."""
    act = Activity(
        name="Colosseum Guided Tour",
        category="culture",
        description="Priority entry and arena floor access",
        location="Piazza del Colosseo, Rome",
        start_time="10:00",
        duration_minutes=120,
        estimated_cost=40.0,
        order=1,
    )
    assert act.id is not None
    assert act.name == "Colosseum Guided Tour"
    assert act.duration_minutes == 120
    assert act.estimated_cost == 40.0


def test_itinerary_schema_complete():
    """Verify nested structure of complete Itinerary."""
    act = Activity(
        name="Uffizi Gallery",
        category="culture",
        description="Renaissance art",
        location="Florence",
        order=1,
    )
    day = ItineraryDay(
        day_number=1,
        date="2026-05-01",
        summary="Florence Art Tour",
        activities=[act],
        daily_budget=150.0,
    )
    itin = Itinerary(
        trip_id="trip-test-1",
        days=[day],
        total_estimated_cost=150.0,
        currency="EUR",
        planning_notes="Reserve tickets early.",
        is_demo=False,
    )
    assert itin.trip_id == "trip-test-1"
    assert len(itin.days) == 1
    assert len(itin.days[0].activities) == 1
    assert itin.total_estimated_cost == 150.0


def test_auth_schema_email_validation():
    """Verify email formatting check in auth schemas."""
    with pytest.raises(ValidationError):
        UserSignUpRequest(email="invalid-email-string", password="securepassword123")

    with pytest.raises(ValidationError):
        UserLoginRequest(email="invalid-email", password="123")


def test_sharing_schema_expiry_bounds():
    """Verify boundaries on sharing expiry days."""
    valid = ShareTripCreate(expires_in_days=15)
    assert valid.expires_in_days == 15

    with pytest.raises(ValidationError):
        ShareTripCreate(expires_in_days=500)  # > 365

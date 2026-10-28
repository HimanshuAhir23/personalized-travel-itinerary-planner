"""Tests for prompt engineering logic and preference injection."""

from datetime import date
from app.schemas.itinerary import Activity, ItineraryDay
from app.schemas.trip import TripCreate
from app.services.prompts.itinerary_prompt import (
    SYSTEM_ITINERARY_PROMPT,
    build_day_regeneration_prompt,
    build_itinerary_prompt,
)


def test_build_itinerary_prompt_includes_all_preferences():
    """Verify that build_itinerary_prompt includes all custom user fields."""
    trip = TripCreate(
        destination="Kyoto, Japan",
        start_date=date(2026, 4, 1),
        end_date=date(2026, 4, 4),
        travelers=3,
        travel_group="family",
        budget=4500.0,
        currency="JPY",
        budget_level="luxury",
        interests=["tea ceremony", "zen gardens", "craft pottery"],
        travel_pace="relaxed",
        accommodation_style="ryokan",
        transportation=["subway", "private_driver"],
        dietary_restrictions=["pescatarian", "no shell-fish"],
        accessibility_needs=["stroller accessible"],
        avoid_activities=["noisy bars", "crowded theme parks"],
        additional_notes="Prefer early morning visits to avoid cherry blossom crowds.",
    )

    prompt = build_itinerary_prompt(trip, trip_id="trip-12345")

    # Destination & duration
    assert "Kyoto, Japan" in prompt
    assert "4 days" in prompt
    assert "trip-12345" in prompt

    # Party & Budget
    assert "3 (family)" in prompt
    assert "4500.0 JPY" in prompt
    assert "luxury" in prompt

    # Pace & Lodging
    assert "relaxed" in prompt
    assert "ryokan" in prompt
    assert "subway" in prompt

    # Personalizations
    assert "tea ceremony" in prompt
    assert "pescatarian" in prompt
    assert "stroller accessible" in prompt
    assert "noisy bars" in prompt
    assert "cherry blossom crowds" in prompt

    # Schema instructions
    assert '"trip_id"' in prompt
    assert '"days"' in prompt
    assert '"activities"' in prompt


def test_system_prompt_rules():
    """Verify core rules in the system prompt."""
    assert "OUTPUT FORMAT: Respond ONLY with a valid JSON object" in SYSTEM_ITINERARY_PROMPT
    assert "DATES & DAYS" in SYSTEM_ITINERARY_PROMPT
    assert "MEAL BREAKS" in SYSTEM_ITINERARY_PROMPT
    assert "GEOGRAPHIC PROXIMITY" in SYSTEM_ITINERARY_PROMPT
    assert "BUDGET DISCIPLINE" in SYSTEM_ITINERARY_PROMPT


def test_build_day_regeneration_prompt():
    """Verify day regeneration prompt contains target day info and instructions."""
    trip = TripCreate(
        destination="Barcelona, Spain",
        start_date=date(2026, 5, 10),
        end_date=date(2026, 5, 13),
        travelers=2,
        budget=1200.0,
        currency="EUR",
        interests=["architecture", "tapas"],
    )
    day = ItineraryDay(
        day_number=2,
        date="2026-05-11",
        summary="Gothic Quarter & Beach",
        activities=[
            Activity(
                name="Barri Gòtic Walk",
                category="culture",
                location="Barcelona",
                order=1,
            )
        ],
        daily_budget=300.0,
    )
    instructions = "Focus on Antoni Gaudí masterpieces like Sagrada Família and Casa Batlló instead."

    prompt = build_day_regeneration_prompt(trip, day, instructions)

    assert "Barcelona, Spain" in prompt
    assert "Day 2" in prompt
    assert "2026-05-11" in prompt
    assert "Gaudí" in prompt
    assert "daily_budget" in prompt

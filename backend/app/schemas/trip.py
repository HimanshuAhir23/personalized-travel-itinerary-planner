"""Pydantic schemas for trip management."""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class TripBase(BaseModel):
    destination: str = Field(..., min_length=1, description="Target travel destination")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    travelers: int = Field(default=1, ge=1, description="Number of travelers")
    travel_group: str = Field(
        default="solo",
        description="Type of travel party (solo, couple, family, friends, business)",
    )
    budget: float = Field(default=0.0, ge=0.0, description="Total budget amount")
    currency: str = Field(default="USD", min_length=1, max_length=10, description="Currency code")
    budget_level: str = Field(
        default="moderate",
        description="Budget preference tier (budget, moderate, premium, luxury)",
    )
    interests: list[str] = Field(default_factory=list, description="Travel interests and hobbies")
    travel_pace: str = Field(
        default="moderate",
        description="Pacing of the trip (relaxed, moderate, fast)",
    )
    accommodation_style: str = Field(
        default="hotel",
        description="Preferred lodging type (hotel, hostel, resort, apartment, boutique, villa)",
    )
    transportation: list[str] = Field(
        default_factory=lambda: ["public_transit"],
        description="Preferred transportation modes",
    )
    dietary_restrictions: list[str] = Field(
        default_factory=list,
        description="Dietary requirements and restrictions",
    )
    accessibility_needs: list[str] = Field(
        default_factory=list,
        description="Accessibility considerations and requirements",
    )
    avoid_activities: list[str] = Field(
        default_factory=list,
        description="Activities or themes to exclude",
    )
    additional_notes: str = Field(
        default="",
        description="Extra notes or specific requests for the trip",
    )

    @model_validator(mode="after")
    def validate_dates(self) -> "TripBase":
        if self.end_date < self.start_date:
            raise ValueError("end_date cannot be earlier than start_date")
        return self


class TripCreate(TripBase):
    """Schema for creating a new trip."""
    pass


class TripUpdate(BaseModel):
    """Schema for updating an existing trip."""
    destination: Optional[str] = Field(default=None, min_length=1)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    travelers: Optional[int] = Field(default=None, ge=1)
    travel_group: Optional[str] = None
    budget: Optional[float] = Field(default=None, ge=0.0)
    currency: Optional[str] = None
    budget_level: Optional[str] = None
    interests: Optional[list[str]] = None
    travel_pace: Optional[str] = None
    accommodation_style: Optional[str] = None
    transportation: Optional[list[str]] = None
    dietary_restrictions: Optional[list[str]] = None
    accessibility_needs: Optional[list[str]] = None
    avoid_activities: Optional[list[str]] = None
    additional_notes: Optional[str] = None
    status: Optional[str] = None

    @model_validator(mode="after")
    def validate_dates_if_both_present(self) -> "TripUpdate":
        if self.start_date is not None and self.end_date is not None:
            if self.end_date < self.start_date:
                raise ValueError("end_date cannot be earlier than start_date")
        return self


class TripResponse(TripBase):
    """Schema for trip response payload."""
    id: str
    user_id: str
    status: str = "draft"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    has_itinerary: bool = False

    model_config = ConfigDict(from_attributes=True)

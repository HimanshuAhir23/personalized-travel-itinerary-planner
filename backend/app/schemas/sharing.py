"""Schemas for sharing trips with public read-only links."""

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field


class ShareTripCreate(BaseModel):
    allow_fork: bool = Field(default=True, description="Whether other users can fork/clone this trip")
    expires_in_days: Optional[int] = Field(default=30, ge=1, le=365, description="Expiry duration in days")


class ShareTripResponse(BaseModel):
    share_token: str = Field(..., description="Unique share token")
    share_url: str = Field(..., description="Full frontend shareable URL")
    trip_id: str = Field(..., description="ID of shared trip")
    created_at: datetime = Field(..., description="When the share link was created")
    expires_at: Optional[datetime] = Field(default=None, description="Expiration timestamp")
    is_active: bool = Field(default=True, description="Whether link is currently active")
    allow_fork: bool = True

    model_config = ConfigDict(from_attributes=True)


class SharedTripView(BaseModel):
    trip: dict[str, Any] = Field(..., description="Trip overview information")
    itinerary: Optional[dict[str, Any]] = Field(default=None, description="Itinerary details if generated")
    shared_by: Optional[str] = Field(default=None, description="Trip creator name/email snippet")
    created_at: datetime = Field(..., description="Share link creation timestamp")
    share_token: str = Field(..., description="Share token identifier")
    allow_fork: bool = True

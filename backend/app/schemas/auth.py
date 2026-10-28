"""Authentication schemas for user registration, login, and token exchange."""

from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserSignUpRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")
    full_name: Optional[str] = Field(default=None, description="Optional user full name")


class UserLoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User's password")


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    user_metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = None
    refresh_token: Optional[str] = None
    user: Optional[UserResponse] = None


class User(BaseModel):
    id: str
    email: str
    role: Optional[str] = "authenticated"
    user_metadata: dict[str, Any] = Field(default_factory=dict)

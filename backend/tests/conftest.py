"""Pytest fixtures for WanderWise AI test suite."""

from datetime import date, timedelta
from typing import Generator
from fastapi.testclient import TestClient
import pytest
from app.api.deps import get_current_user
from app.core.config import settings
from app.db.supabase import InMemorySupabaseMock, get_admin_client, get_supabase_client
from app.main import app

# Ensure testing environment
settings.ENVIRONMENT = "test"


@pytest.fixture(autouse=True)
def reset_in_memory_db():
    """Ensure in-memory mock tables are fresh before each test."""
    mock_db = InMemorySupabaseMock()
    import app.db.supabase as db_module
    db_module._supabase_client = mock_db
    db_module._admin_client = mock_db
    yield
    db_module._supabase_client = None
    db_module._admin_client = None


@pytest.fixture
def mock_user() -> dict:
    """Fixture providing a mock authenticated user."""
    return {
        "id": "test-user-123",
        "email": "traveler@wanderwise.ai",
        "role": "authenticated",
        "user_metadata": {"full_name": "Test Traveler"},
    }


@pytest.fixture
def auth_headers() -> dict[str, str]:
    """Fixture providing Bearer authorization headers."""
    return {"Authorization": "Bearer mock-jwt-test-user-123"}


@pytest.fixture
def other_user_headers() -> dict[str, str]:
    """Fixture providing Bearer authorization headers for another user."""
    return {"Authorization": "Bearer mock-jwt-different-user-456"}


@pytest.fixture
def client(mock_user: dict) -> Generator[TestClient, None, None]:
    """FastAPI TestClient with overridden get_current_user dependency."""
    app.dependency_overrides[get_current_user] = lambda: mock_user
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def raw_client() -> Generator[TestClient, None, None]:
    """TestClient without dependency overrides to test raw auth flows."""
    app.dependency_overrides.clear()
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def sample_trip_payload() -> dict:
    """Fixture with valid trip creation data."""
    start = date.today() + timedelta(days=10)
    end = start + timedelta(days=3)
    return {
        "destination": "Kyoto, Japan",
        "start_date": start.isoformat(),
        "end_date": end.isoformat(),
        "travelers": 2,
        "travel_group": "couple",
        "budget": 2000.0,
        "currency": "USD",
        "budget_level": "moderate",
        "interests": ["temples", "culinary", "nature"],
        "travel_pace": "moderate",
        "accommodation_style": "boutique",
        "transportation": ["public_transit", "walking"],
        "dietary_restrictions": ["vegetarian"],
        "accessibility_needs": [],
        "avoid_activities": ["extreme sports"],
        "additional_notes": "We love traditional tea houses and serene gardens.",
    }

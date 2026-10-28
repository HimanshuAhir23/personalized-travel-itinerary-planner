"""Integration tests for Trip CRUD endpoints and ownership enforcement."""

from fastapi.testclient import TestClient
from app.api.deps import get_current_user
from app.main import app


def test_create_and_get_trip(client: TestClient, sample_trip_payload: dict):
    """Test creating a trip and reading it back."""
    # 1. Create trip
    post_res = client.post("/api/trips", json=sample_trip_payload)
    assert post_res.status_code == 201
    created_trip = post_res.json()
    assert created_trip["destination"] == sample_trip_payload["destination"]
    assert created_trip["user_id"] == "test-user-123"
    trip_id = created_trip["id"]

    # 2. Get trip by id
    get_res = client.get(f"/api/trips/{trip_id}")
    assert get_res.status_code == 200
    fetched_trip = get_res.json()
    assert fetched_trip["id"] == trip_id
    assert fetched_trip["budget"] == sample_trip_payload["budget"]


def test_list_user_trips(client: TestClient, sample_trip_payload: dict):
    """Test listing trips belonging to the authenticated user."""
    # Create two trips
    client.post("/api/trips", json=sample_trip_payload)
    second_payload = dict(sample_trip_payload, destination="Seoul, South Korea")
    client.post("/api/trips", json=second_payload)

    res = client.get("/api/trips")
    assert res.status_code == 200
    trips = res.json()
    assert len(trips) >= 2
    destinations = [t["destination"] for t in trips]
    assert "Kyoto, Japan" in destinations
    assert "Seoul, South Korea" in destinations


def test_update_trip(client: TestClient, sample_trip_payload: dict):
    """Test modifying trip preferences via PATCH."""
    create_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = create_res.json()["id"]

    update_payload = {
        "budget": 3500.0,
        "travel_pace": "fast",
        "budget_level": "luxury",
    }
    patch_res = client.patch(f"/api/trips/{trip_id}", json=update_payload)
    assert patch_res.status_code == 200
    updated = patch_res.json()
    assert updated["budget"] == 3500.0
    assert updated["travel_pace"] == "fast"
    assert updated["budget_level"] == "luxury"


def test_delete_trip(client: TestClient, sample_trip_payload: dict):
    """Test deleting a trip."""
    create_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = create_res.json()["id"]

    delete_res = client.delete(f"/api/trips/{trip_id}")
    assert delete_res.status_code == 200

    # Ensure get now returns 404
    get_res = client.get(f"/api/trips/{trip_id}")
    assert get_res.status_code == 404


def test_ownership_enforcement(client: TestClient, sample_trip_payload: dict):
    """Test that User B cannot access or modify User A's trip."""
    # User A creates trip
    create_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = create_res.json()["id"]

    # Switch current_user to User B
    app.dependency_overrides[get_current_user] = lambda: {
        "id": "intruder-user-999",
        "email": "intruder@example.com",
        "role": "authenticated",
        "user_metadata": {},
    }

    try:
        # User B attempts to get User A's trip
        unauthorized_get = client.get(f"/api/trips/{trip_id}")
        assert unauthorized_get.status_code == 403

        # User B attempts to update User A's trip
        unauthorized_patch = client.patch(f"/api/trips/{trip_id}", json={"budget": 100.0})
        assert unauthorized_patch.status_code == 403

        # User B attempts to delete User A's trip
        unauthorized_del = client.delete(f"/api/trips/{trip_id}")
        assert unauthorized_del.status_code == 403
    finally:
        app.dependency_overrides.clear()


def test_unauthenticated_request_rejected(raw_client: TestClient):
    """Test that protected trip endpoints reject unauthenticated calls."""
    res = raw_client.get("/api/trips")
    assert res.status_code == 401

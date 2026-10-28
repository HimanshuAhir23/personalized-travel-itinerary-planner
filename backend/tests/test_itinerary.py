"""Integration tests for Itinerary generation, optimization, activities, sharing, and export."""

from fastapi.testclient import TestClient
from app.api.deps import get_itinerary_generator
from app.main import app
from app.schemas.itinerary import Activity, Itinerary, ItineraryDay
from app.schemas.trip import TripCreate
from app.services.ai.demo_provider import DemoProvider
from app.services.itinerary.generator import ItineraryGenerator
from app.services.itinerary.optimizer import ItineraryOptimizer
from app.utils.helpers import haversine_distance


def test_generate_and_get_itinerary(client: TestClient, sample_trip_payload: dict):
    """Test generating a full itinerary for a trip and reading it back."""
    # 1. Create a trip
    trip_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = trip_res.json()["id"]

    # 2. Generate itinerary
    gen_res = client.post(f"/api/trips/{trip_id}/generate")
    assert gen_res.status_code == 200
    itinerary = gen_res.json()
    assert itinerary["trip_id"] == trip_id
    assert len(itinerary["days"]) == 4  # 4-day trip from fixture
    assert itinerary["total_estimated_cost"] >= 0.0

    # 3. Read back itinerary
    get_res = client.get(f"/api/trips/{trip_id}/itinerary")
    assert get_res.status_code == 200
    assert get_res.json()["trip_id"] == trip_id


def test_add_update_delete_activity(client: TestClient, sample_trip_payload: dict):
    """Test managing individual activities in an itinerary."""
    trip_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = trip_res.json()["id"]

    # Generate itinerary first
    client.post(f"/api/trips/{trip_id}/generate")

    # Add activity to Day 1
    new_act_payload = {
        "name": "Evening Tea Ceremony & Wagashi Tasting",
        "category": "culture",
        "description": "Intimate tea ceremony in a centuries-old machiya house",
        "location": "Gion, Kyoto",
        "start_time": "17:00",
        "duration_minutes": 60,
        "estimated_cost": 35.0,
        "currency": "USD",
        "travel_notes": "5-minute walk from Gion-Shijo Station",
    }
    add_res = client.post(
        f"/api/trips/{trip_id}/itinerary/activities?day_number=1",
        json=new_act_payload,
    )
    assert add_res.status_code == 201
    act_data = add_res.json()
    assert act_data["name"] == new_act_payload["name"]
    act_id = act_data["id"]

    # Update activity
    patch_act_res = client.patch(
        f"/api/trips/{trip_id}/itinerary/activities/{act_id}",
        json={"estimated_cost": 42.0, "start_time": "17:30"},
    )
    assert patch_act_res.status_code == 200
    updated_act = patch_act_res.json()
    assert updated_act["estimated_cost"] == 42.0
    assert updated_act["start_time"] == "17:30"

    # Delete activity
    del_res = client.delete(f"/api/trips/{trip_id}/itinerary/activities/{act_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


def test_regenerate_day(client: TestClient, sample_trip_payload: dict):
    """Test regenerating a specific day with updated instructions."""
    trip_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = trip_res.json()["id"]

    client.post(f"/api/trips/{trip_id}/generate")

    regen_payload = {
        "day_number": 2,
        "instructions": "Replace all activities with Zen meditation and bamboo grove walks.",
    }
    regen_res = client.post(f"/api/trips/{trip_id}/regenerate", json=regen_payload)
    assert regen_res.status_code == 200
    itin = regen_res.json()
    assert len(itin["days"]) == 4


def test_trip_sharing_lifecycle(client: TestClient, sample_trip_payload: dict):
    """Test creating share link, viewing publicly, and revoking."""
    trip_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = trip_res.json()["id"]

    # Generate itinerary
    client.post(f"/api/trips/{trip_id}/generate")

    # 1. Create share link
    share_res = client.post(f"/api/trips/{trip_id}/share", json={"allow_fork": True, "expires_in_days": 10})
    assert share_res.status_code == 201
    share_data = share_res.json()
    assert "share_token" in share_data
    token = share_data["share_token"]

    # 2. View shared trip without auth headers
    from app.main import app
    from fastapi.testclient import TestClient as PlainClient
    with PlainClient(app) as unauth_client:
        view_res = unauth_client.get(f"/api/shared/{token}")
        assert view_res.status_code == 200
        view_data = view_res.json()
        assert view_data["trip"]["id"] == trip_id
        assert view_data["itinerary"] is not None

    # 3. Revoke share link
    revoke_res = client.delete(f"/api/trips/{trip_id}/share")
    assert revoke_res.status_code == 200

    # 4. Accessing revoked share link should fail
    with PlainClient(app) as unauth_client:
        revoked_view = unauth_client.get(f"/api/shared/{token}")
        assert revoked_view.status_code == 404


def test_export_pdf_and_print_html(client: TestClient, sample_trip_payload: dict):
    """Test generating PDF and print HTML exports."""
    trip_res = client.post("/api/trips", json=sample_trip_payload)
    trip_id = trip_res.json()["id"]

    client.post(f"/api/trips/{trip_id}/generate")

    # PDF Export
    pdf_res = client.get(f"/api/trips/{trip_id}/export/pdf")
    assert pdf_res.status_code == 200
    assert "application/pdf" in pdf_res.headers.get("content-type", "")
    assert len(pdf_res.content) > 1000  # Generated valid PDF bytes

    # Print HTML Export
    html_res = client.get(f"/api/trips/{trip_id}/export/print")
    assert html_res.status_code == 200
    assert "text/html" in html_res.headers.get("content-type", "")
    assert "Kyoto, Japan" in html_res.text
    assert "Total Estimated Cost" in html_res.text


def test_optimizer_haversine_and_reordering():
    """Test optimizer geographic distance logic and route ordering."""
    dist = haversine_distance(35.6762, 139.6503, 35.6580, 139.7016)
    assert dist > 0.0

    optimizer = ItineraryOptimizer()
    activities = [
        Activity(
            name="Far Place",
            category="sightseeing",
            location="Far",
            latitude=35.8000,
            longitude=139.8000,
            start_time="09:00",
            duration_minutes=60,
            order=1,
        ),
        Activity(
            name="Near Place",
            category="sightseeing",
            location="Near",
            latitude=35.7148,
            longitude=139.7967,
            start_time="11:00",
            duration_minutes=60,
            order=2,
        ),
        Activity(
            name="Origin Place",
            category="sightseeing",
            location="Origin",
            latitude=35.7100,
            longitude=139.7950,
            start_time="14:00",
            duration_minutes=60,
            order=3,
        ),
    ]

    reordered = optimizer._optimize_route(activities)
    assert len(reordered) == 3
    # Check that sequential orders 1, 2, 3 were assigned
    orders = [a.order for a in reordered]
    assert orders == [1, 2, 3]

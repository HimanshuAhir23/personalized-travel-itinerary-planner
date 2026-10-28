"""Tests for the health check endpoint."""

from fastapi.testclient import TestClient


def test_health_check_returns_200(client: TestClient):
    """Test that GET /api/health returns 200 and expected payload structure."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "timestamp" in data
    assert "version" in data
    assert data["version"] == "1.0.0"

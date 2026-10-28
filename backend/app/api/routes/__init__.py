"""Routes package."""

from app.api.routes.auth import router as auth_router
from app.api.routes.export import router as export_router
from app.api.routes.health import router as health_router
from app.api.routes.itinerary import router as itinerary_router
from app.api.routes.sharing import router as sharing_router
from app.api.routes.trips import router as trips_router

__all__ = [
    "auth_router",
    "export_router",
    "health_router",
    "itinerary_router",
    "sharing_router",
    "trips_router",
]

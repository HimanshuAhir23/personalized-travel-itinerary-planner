"""Main FastAPI application entry point for WanderWise AI."""

from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from app.api.routes.auth import router as auth_router
from app.api.routes.export import router as export_router
from app.api.routes.health import router as health_router
from app.api.routes.itinerary import router as itinerary_router
from app.api.routes.sharing import router as sharing_router
from app.api.routes.trips import router as trips_router
from app.core.config import settings
from app.db.supabase import get_admin_client, get_supabase_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("wanderwise")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown procedures."""
    logger.info("Initializing WanderWise AI backend services...")
    # Pre-initialize Supabase client singletons
    get_supabase_client()
    get_admin_client()
    logger.info("WanderWise AI backend initialized successfully.")
    yield
    logger.info("Shutting down WanderWise AI backend services.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Intelligent personalized travel itinerary planning API powered by AI.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

# Deduplicate origins list
allowed_origins = list(dict.fromkeys([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if settings.ENVIRONMENT != "development" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routers under the /api prefix
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(trips_router, prefix=settings.API_V1_STR)
app.include_router(itinerary_router, prefix=settings.API_V1_STR)
app.include_router(sharing_router, prefix=settings.API_V1_STR)
app.include_router(export_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root path to interactive OpenAPI documentation."""
    return RedirectResponse(url="/docs")

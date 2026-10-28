# WanderWise AI — Backend Service

A high-performance FastAPI backend service providing intelligent, personalized travel itinerary planning powered by Large Language Models (Groq / LLaMA 3.3 70B Versatile) and Supabase.

---

## 🌟 Key Features

- **Personalized Itinerary Generation**: Dynamically crafts day-by-day itineraries tailored to destinations, duration, party dynamics (solo, couple, family, friends, business), budget tier, travel pace, lodging styles, dietary restrictions, accessibility needs, and avoidances.
- **Intelligent Route & Schedule Optimization**:
  - Reorders daily stops using geographic proximity and Great-Circle (Haversine) distance calculations.
  - Enforces adequate meal breaks (breakfast/lunch/dinner) honoring dietary preferences.
  - Automatically flags budget overruns and pacing discrepancies.
- **Granular Customization**: Full CRUD capability on generated itineraries — add new activities, modify schedules, reorder stops, delete unwanted visits, or regenerate individual days with prompt instructions.
- **Export & Sharing**:
  - High-resolution, printable PDF export generated via ReportLab.
  - Responsive, print-ready HTML view with `@media print` layout.
  - Secure public share tokens with optional fork permissions and customizable expiration periods.
- **Resilient AI Layer**: Multi-attempt retries for JSON structure integrity with automated fallback to the deterministic `DemoProvider` if rate limits or network issues arise.
- **Supabase Authentication & Multi-Tenancy**: Strict ownership checks ensuring users access only their own travel plans.

---

## 🏗️ Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application, CORS middleware, lifespan
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                # Authentication, database, and service dependencies
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── auth.py            # Signup, login, logout, user profile endpoints
│   │       ├── trips.py           # Full CRUD operations for trips
│   │       ├── itinerary.py       # Itinerary generation, regeneration, activity edits
│   │       ├── sharing.py         # Shareable link creation and public viewing
│   │       ├── export.py          # PDF generation and print-ready HTML
│   │       └── health.py          # Health status checks
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Pydantic Settings and environment configuration
│   │   └── security.py           # Supabase JWT token verification
│   ├── db/
│   │   ├── __init__.py
│   │   └── supabase.py           # Supabase client singleton & dev mock
│   ├── models/
│   │   ├── __init__.py
│   │   └── enums.py              # Domain enums (TravelGroup, BudgetLevel, TravelPace, etc.)
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py               # Auth and user schemas
│   │   ├── trip.py               # Trip input and response schemas
│   │   ├── itinerary.py          # Day, activity, and itinerary schemas
│   │   └── sharing.py            # Share token schemas
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── provider.py        # Abstract LLMProvider interface & factory
│   │   │   ├── groq_provider.py   # Groq API implementation (LLaMA 3.3 70B)
│   │   │   └── demo_provider.py   # Deterministic fallback provider
│   │   ├── prompts/
│   │   │   ├── __init__.py
│   │   │   └── itinerary_prompt.py # Dynamic prompt engineering templates
│   │   ├── itinerary/
│   │   │   ├── __init__.py
│   │   │   ├── generator.py       # Generation orchestration and retries
│   │   │   └── optimizer.py       # Post-generation proximity and schedule optimizer
│   │   └── trips/
│   │       ├── __init__.py
│   │       └── trip_service.py    # Trip persistence, activity manipulation, sharing
│   └── utils/
│       ├── __init__.py
│       └── helpers.py            # Haversine distance, dates, time addition, JSON parser
├── tests/
│   ├── __init__.py
│   ├── conftest.py               # Pytest fixtures and test client setup
│   ├── test_health.py            # Health check tests
│   ├── test_schemas.py           # Pydantic schema validation tests
│   ├── test_prompts.py           # Prompt builder verification
│   ├── test_trips.py             # Trip CRUD and authorization tests
│   └── test_itinerary.py         # Generation, activity edits, sharing, PDF export tests
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.11+ (Python 3.13.7 supported)
- pip

### 2. Installation
Navigate into the backend directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_ANON_KEY` | Public anonymous key | `your-anon-key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key | `your-service-role-key` |
| `GROQ_API_KEY` | Groq API Key (Optional, falls back to DemoProvider) | `your-groq-key` |
| `GROQ_MODEL` | Groq inference model | `llama-3.3-70b-versatile` |
| `FRONTEND_URL` | Frontend client origin URL for CORS | `http://localhost:5173` |
| `ENVIRONMENT` | Runtime environment (`development`, `test`, `production`) | `development` |

### 4. Running the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
Interactive API docs are available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 📡 API Reference

### Health
- `GET /api/health` — Service health check and version info

### Authentication
- `POST /api/auth/signup` — Register new user
- `POST /api/auth/login` — Sign in and obtain JWT
- `POST /api/auth/logout` — Revoke session
- `GET /api/auth/me` — Get authenticated user details

### Trips
- `POST /api/trips` — Create a new trip
- `GET /api/trips` — List all trips for current user
- `GET /api/trips/{trip_id}` — Get single trip
- `PATCH /api/trips/{trip_id}` — Update trip preferences
- `DELETE /api/trips/{trip_id}` — Delete trip

### Itinerary & Activities
- `POST /api/trips/{trip_id}/generate` — Generate AI itinerary
- `GET /api/trips/{trip_id}/itinerary` — Get trip itinerary
- `PATCH /api/trips/{trip_id}/itinerary` — Update itinerary
- `POST /api/trips/{trip_id}/regenerate` — Regenerate itinerary or specific day
- `POST /api/trips/{trip_id}/itinerary/activities?day_number={n}` — Add activity
- `PATCH /api/trips/{trip_id}/itinerary/activities/{activity_id}` — Edit activity
- `DELETE /api/trips/{trip_id}/itinerary/activities/{activity_id}` — Remove activity

### Sharing & Export
- `POST /api/trips/{trip_id}/share` — Create public share link
- `DELETE /api/trips/{trip_id}/share` — Revoke share link
- `GET /api/shared/{share_token}` — Public read-only trip viewer (no auth needed)
- `GET /api/trips/{trip_id}/export/pdf` — Download itinerary as PDF
- `GET /api/trips/{trip_id}/export/print` — Render print-ready HTML

---

## 🧪 Testing

Run the full test suite with pytest:
```bash
pytest
```
All external dependencies (Supabase, Groq) are automatically mocked to allow isolated, deterministic test execution.

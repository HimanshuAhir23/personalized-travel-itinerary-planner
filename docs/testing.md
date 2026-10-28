# Testing Guide — WanderWise AI

## Test Strategy

The project uses a layered testing approach:

1. **Schema Validation Tests** — Verify Pydantic models accept valid data and reject invalid input
2. **Prompt Engineering Tests** — Ensure dynamic prompts include all user preferences
3. **Business Logic Tests** — Trip CRUD, ownership enforcement, authorization
4. **Integration Tests** — Itinerary generation, activity management, sharing lifecycle, PDF export
5. **Optimization Tests** — Haversine distance, geographic reordering
6. **Frontend Build Verification** — TypeScript compilation + Vite production build

## Running Tests

### Backend Tests
```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Build Check
```bash
cd frontend
npm run build
```

## Test Results

**Backend: 25/25 tests passing ✅**

| Test File | Tests | Status | Coverage |
|-----------|-------|--------|----------|
| `test_health.py` | 1 | ✅ Pass | Health endpoint status, version, timestamp |
| `test_schemas.py` | 9 | ✅ Pass | Trip, activity, auth, sharing schema validation |
| `test_prompts.py` | 3 | ✅ Pass | Prompt generation, system rules, day regeneration |
| `test_trips.py` | 6 | ✅ Pass | CRUD operations, ownership, auth enforcement |
| `test_itinerary.py` | 6 | ✅ Pass | Generation, activities, sharing, export, optimizer |
| **Total** | **25** | **✅ All Pass** | |

**Frontend: Production build successful ✅**
- TypeScript compilation: 0 errors
- Vite build: 2875 modules transformed, 970ms

## Test Details

### test_health.py
- `test_health_check_returns_200` — Verifies `/api/health` returns 200 with status, service name, environment, and timestamp

### test_schemas.py
- `test_valid_trip_create` — Valid trip data passes validation
- `test_trip_create_invalid_dates` — End date before start date rejected
- `test_trip_create_invalid_travelers` — Zero or negative travelers rejected
- `test_trip_create_negative_budget` — Negative budget rejected
- `test_trip_update_valid_and_invalid` — Partial updates validated correctly
- `test_activity_schema_defaults` — Activity defaults applied properly
- `test_itinerary_schema_complete` — Full itinerary schema validates with nested days and activities
- `test_auth_schema_email_validation` — Invalid email formats rejected (EmailStr)
- `test_sharing_schema_expiry_bounds` — Share link expiry constraints validated

### test_prompts.py
- `test_build_itinerary_prompt_includes_all_preferences` — Verifies destination, dates, budget, interests, pace, dietary restrictions, and accessibility needs are all injected into the prompt
- `test_system_prompt_rules` — Validates system prompt includes JSON output rules, proximity clustering, meal breaks, and duplicate prevention
- `test_build_day_regeneration_prompt` — Day-specific regeneration includes existing context

### test_trips.py
- `test_create_and_get_trip` — Create trip via POST, retrieve via GET with matching data
- `test_list_user_trips` — List returns only authenticated user's trips
- `test_update_trip` — PATCH updates specific fields without affecting others
- `test_delete_trip` — DELETE removes trip, subsequent GET returns 404
- `test_ownership_enforcement` — User A cannot access User B's trips (403)
- `test_unauthenticated_request_rejected` — Missing auth token returns 401

### test_itinerary.py
- `test_generate_and_get_itinerary` — Generate itinerary with demo provider, verify day count and activity structure
- `test_add_update_delete_activity` — Full lifecycle: add activity, update it, delete it
- `test_regenerate_day` — Regenerate a specific day while preserving others
- `test_trip_sharing_lifecycle` — Create share link, access via token, revoke link, verify revoked access fails
- `test_export_pdf_and_print_html` — PDF export returns valid PDF bytes, print returns HTML
- `test_optimizer_haversine_and_reordering` — Haversine distance calculation accuracy, nearest-neighbor activity reordering

## Test Infrastructure

### Mocking Strategy
- **Supabase**: In-memory mock (`InMemorySupabaseMock`) simulates PostgREST operations (select, insert, update, delete, eq, single)
- **LLM Provider**: `DemoProvider` returns deterministic itineraries without API calls
- **Authentication**: Mock JWT tokens (`mock-jwt-*`, `test-token`) bypass Supabase Auth validation in test mode
- **No external service calls**: All tests run offline without Supabase or Groq credentials

### Test Configuration
- Framework: pytest 8.3.5
- Async: pytest-asyncio 0.25.3
- Client: FastAPI TestClient (Starlette)
- Fixtures: Shared in `tests/conftest.py`

## Known Test Limitations

- Tests use in-memory mock database, not live Supabase — integration tests with real DB require credentials
- AI generation tests use DemoProvider only — testing with live Groq API requires `GROQ_API_KEY`
- No E2E browser tests (Playwright/Cypress) — would require both frontend and backend running
- PDF content validation checks byte output, not rendered visual quality

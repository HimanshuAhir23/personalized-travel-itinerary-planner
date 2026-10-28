# API Documentation — WanderWise AI

Base URL: `http://localhost:8000/api` (development) or `https://your-app.onrender.com/api` (production)

All protected endpoints require `Authorization: Bearer <token>` header.

---

## Health

### GET /health
Health check endpoint.

**Auth:** None

**Response 200:**
```json
{
  "status": "healthy",
  "service": "WanderWise AI",
  "environment": "development",
  "timestamp": "2026-10-28T12:00:00+00:00",
  "version": "1.0.0"
}
```

---

## Authentication

### POST /auth/signup
Register a new user.

**Auth:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "Jane Doe"
}
```

**Response 201:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Jane Doe"
  }
}
```

**Errors:** 400 (invalid email/password), 409 (email exists)

### POST /auth/login
Authenticate and receive access token.

**Auth:** None

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response 200:** Same as signup response.

**Errors:** 401 (invalid credentials)

### POST /auth/logout
Invalidate current session.

**Auth:** Required

**Response 200:**
```json
{ "message": "Logged out successfully" }
```

### GET /auth/me
Get current authenticated user profile.

**Auth:** Required

**Response 200:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "Jane Doe",
  "user_metadata": {}
}
```

---

## Trips

### POST /trips
Create a new trip.

**Auth:** Required

**Request Body:**
```json
{
  "destination": "Tokyo, Japan",
  "start_date": "2026-12-01",
  "end_date": "2026-12-05",
  "travelers": 2,
  "travel_group": "couple",
  "budget": 3000.00,
  "currency": "USD",
  "budget_level": "moderate",
  "interests": ["culture", "food", "nature"],
  "travel_pace": "moderate",
  "accommodation_style": "hotel",
  "transportation": ["public_transit", "walking"],
  "dietary_restrictions": [],
  "accessibility_needs": [],
  "avoid_activities": [],
  "additional_notes": ""
}
```

**Validation:**
- `destination`: required, non-empty
- `start_date`, `end_date`: valid dates, end >= start
- `travelers`: >= 1
- `budget`: > 0
- `travel_group`: solo | couple | family | friends | business
- `budget_level`: budget | moderate | premium | luxury
- `travel_pace`: relaxed | moderate | fast

**Response 201:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "destination": "Tokyo, Japan",
  "status": "draft",
  "created_at": "2026-10-28T12:00:00",
  ...
}
```

### GET /trips
List all trips for the authenticated user.

**Auth:** Required

**Response 200:**
```json
[
  {
    "id": "uuid",
    "destination": "Tokyo, Japan",
    "start_date": "2026-12-01",
    "end_date": "2026-12-05",
    "status": "completed",
    "budget": 3000.00,
    ...
  }
]
```

### GET /trips/{trip_id}
Get a specific trip by ID.

**Auth:** Required (must be owner)

**Response 200:** Full trip object

**Errors:** 403 (not owner), 404 (not found)

### PATCH /trips/{trip_id}
Update trip details.

**Auth:** Required (must be owner)

**Request Body:** Partial trip fields
```json
{
  "budget": 3500.00,
  "travel_pace": "relaxed"
}
```

**Response 200:** Updated trip object

### DELETE /trips/{trip_id}
Delete a trip and all associated data.

**Auth:** Required (must be owner)

**Response 200:**
```json
{ "message": "Trip deleted successfully" }
```

---

## Itinerary

### POST /trips/{trip_id}/generate
Generate an AI itinerary for the trip.

**Auth:** Required (must be owner)

**Response 201:**
```json
{
  "trip_id": "uuid",
  "days": [
    {
      "day_number": 1,
      "date": "2026-12-01",
      "summary": "Exploring traditional Tokyo",
      "activities": [
        {
          "name": "Senso-ji Temple Visit",
          "category": "culture",
          "description": "Visit Tokyo's oldest temple...",
          "location": "Asakusa, Taito City",
          "latitude": 35.7148,
          "longitude": 139.7967,
          "start_time": "09:00",
          "duration_minutes": 90,
          "estimated_cost": 0,
          "currency": "USD",
          "travel_notes": "Take Ginza Line to Asakusa Station",
          "order": 1
        }
      ],
      "daily_budget": 150.00,
      "notes": ""
    }
  ],
  "total_estimated_cost": 750.00,
  "currency": "USD",
  "planning_notes": "Estimates based on...",
  "is_demo": false
}
```

**Errors:** 503 (AI provider unavailable), 504 (timeout)

### GET /trips/{trip_id}/itinerary
Retrieve saved itinerary.

**Auth:** Required (must be owner)

**Response 200:** Itinerary object (same as generate response)

### PATCH /trips/{trip_id}/itinerary
Update itinerary content.

**Auth:** Required (must be owner)

### POST /trips/{trip_id}/regenerate
Regenerate itinerary (whole or specific day).

**Auth:** Required (must be owner)

**Request Body (optional):**
```json
{ "day_number": 2 }
```

### POST /trips/{trip_id}/itinerary/activities
Add a new activity to a day.

**Auth:** Required

**Request Body:**
```json
{
  "day_number": 1,
  "name": "Evening River Cruise",
  "category": "leisure",
  "description": "Scenic cruise along the Sumida River",
  "location": "Sumida River",
  "start_time": "18:00",
  "duration_minutes": 60,
  "estimated_cost": 25.00
}
```

### PATCH /trips/{trip_id}/itinerary/activities/{activity_id}
Update an existing activity.

### DELETE /trips/{trip_id}/itinerary/activities/{activity_id}
Remove an activity.

---

## Sharing

### POST /trips/{trip_id}/share
Create a shareable link.

**Auth:** Required (must be owner)

**Request Body (optional):**
```json
{ "expires_in_days": 30 }
```

**Response 201:**
```json
{
  "share_token": "abc123...",
  "share_url": "https://app.com/share/abc123...",
  "expires_at": "2026-11-28T12:00:00"
}
```

### DELETE /trips/{trip_id}/share
Revoke all share links for a trip.

**Auth:** Required (must be owner)

### GET /shared/{share_token}
View a shared trip (public, no auth required).

**Response 200:** Trip + itinerary data (without sensitive user information)

**Errors:** 404 (invalid token), 410 (expired)

---

## Export

### GET /trips/{trip_id}/export/pdf
Download itinerary as PDF.

**Auth:** Required (must be owner)

**Response:** `application/pdf` file download

### GET /trips/{trip_id}/export/print
Get printable HTML version.

**Auth:** Required (must be owner)

**Response:** `text/html` with print-optimized CSS

---

## Error Response Format

All errors return:
```json
{
  "detail": "Human-readable error message"
}
```

### Standard HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (not owner) |
| 404 | Not Found |
| 410 | Gone (expired share link) |
| 422 | Unprocessable Entity (Pydantic validation) |
| 500 | Internal Server Error |
| 503 | Service Unavailable (AI provider down) |
| 504 | Gateway Timeout (AI timeout) |

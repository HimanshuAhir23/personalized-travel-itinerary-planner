# 🌍 WanderWise AI — Personalized Travel Itinerary Planner

> AI-powered travel planning that creates personalized, day-by-day itineraries tailored to your budget, interests, and travel style.

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?logo=tailwindcss)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Overview

**WanderWise AI** is a full-stack travel planning platform that uses generative AI to create personalized, practical day-by-day travel itineraries. Users provide their destination, dates, budget, interests, and travel preferences — and the platform generates a complete trip plan with activities, timings, cost estimates, maps, and exportable schedules.

### Who is this for?
- **Solo travelers** looking for quick, personalized weekend plans
- **Couples** planning romantic getaways with curated experiences
- **Groups of friends** coordinating multi-day adventures on a budget
- **Business travelers** who need efficient city itineraries
- **Families** wanting age-appropriate activity suggestions

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Itinerary Generation** | Groq LLaMA 3.3 70B creates personalized daily schedules |
| 📋 **7-Step Trip Planner** | Guided form: destination, travelers, budget, interests, style, requirements, review |
| 🗺️ **Interactive Maps** | Leaflet + OpenStreetMap with activity markers and routing |
| 💰 **Budget Management** | Per-activity cost estimates, daily and total budget tracking |
| 📅 **Day-by-Day Timeline** | Morning, afternoon, evening activities with times and durations |
| 🔄 **Smart Regeneration** | Regenerate entire trip, a single day, or individual activities |
| 🔗 **Secure Sharing** | Generate revocable share links for read-only trip access |
| 📄 **PDF & Print Export** | Download professional PDF or open printable HTML view |
| 🔐 **Authentication** | Supabase Auth with JWT-based session management |
| 📱 **Responsive Design** | Optimized for desktop, tablet, and mobile |
| 🎨 **Nature-Inspired UI** | Forest green, sage, ivory palette with Framer Motion animations |
| 🧭 **Route Optimization** | Haversine distance + nearest-neighbor geographic ordering |
| 🍽️ **Meal & Rest Breaks** | Automatic validation of realistic daily schedules |
| 🎯 **Demo Mode** | Works without API keys using deterministic sample itineraries |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool and dev server |
| TypeScript 5.7 | Type safety |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations and transitions |
| Lucide React | Icon library |
| React Router 7 | Client-side routing |
| TanStack React Query | Server state management |
| Leaflet + OpenStreetMap | Map visualization |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.13 | Runtime |
| FastAPI 0.115 | REST API framework |
| Uvicorn | ASGI server |
| Pydantic v2 | Data validation |
| httpx | Async HTTP client (Groq API) |
| python-jose | JWT validation |
| ReportLab | PDF generation |

### Database & Auth
| Technology | Purpose |
|-----------|---------|
| Supabase | Hosted PostgreSQL + Auth |
| Row Level Security | Database-level access control |

### AI
| Technology | Purpose |
|-----------|---------|
| Groq API | LLM inference (LLaMA 3.3 70B Versatile) |
| DemoProvider | Offline fallback with sample itineraries |

### Deployment
| Platform | Service |
|----------|---------|
| Render | FastAPI backend |
| Vercel | React frontend |
| Supabase | Database + authentication |

---

## 📁 Project Structure

```
personalized-travel-itinerary-planner/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Button, Card, Input, Modal, LoadingSpinner, etc.
│   │   │   ├── layout/       # Navbar, Footer, Layout
│   │   │   ├── dashboard/    # DashboardStats, TripCard, RecentTrips
│   │   │   ├── trips/        # 7-step form (Destination, Traveler, Budget, etc.)
│   │   │   ├── itinerary/    # Timeline, DayCard, ActivityCard, Map, Share
│   │   │   └── forms/        # InterestSelector
│   │   ├── context/          # AuthContext
│   │   ├── hooks/            # useAuth, useTrips, useItinerary
│   │   ├── layouts/          # ProtectedLayout
│   │   ├── pages/            # Landing, Login, Register, Dashboard, CreateTrip, TripDetail, SharedTrip, NotFound
│   │   ├── services/         # api, authService, tripService, itineraryService
│   │   ├── types/            # trip, itinerary, auth, api
│   │   └── utils/            # formatters, validators, constants
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/routes/       # auth, trips, itinerary, sharing, export, health
│   │   ├── core/             # config (Pydantic Settings), security (JWT)
│   │   ├── db/               # Supabase client
│   │   ├── models/           # Domain enums
│   │   ├── schemas/          # Pydantic models (auth, trip, itinerary, sharing)
│   │   ├── services/
│   │   │   ├── ai/           # LLMProvider, GroqProvider, DemoProvider
│   │   │   ├── prompts/      # Dynamic itinerary prompt templates
│   │   │   ├── itinerary/    # Generator + Optimizer
│   │   │   └── trips/        # Trip CRUD service
│   │   └── utils/            # Haversine, date helpers, JSON parser
│   ├── tests/                # 25 pytest tests
│   └── requirements.txt
├── supabase/
│   ├── schema.sql            # Complete database schema with RLS
│   └── seed.sql              # Development seed data
├── docs/
│   ├── architecture.md
│   ├── api-documentation.md
│   ├── testing.md
│   └── deployment.md
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄️ Database Schema

Six tables with Row Level Security:

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles linked to Supabase Auth |
| `trips` | Trip preferences, dates, budget, status |
| `itinerary_days` | Per-day summaries and budgets |
| `activities` | Individual activities with times, costs, coordinates |
| `trip_collaborators` | Shared trip memberships with permission levels |
| `share_links` | Revocable, expirable sharing tokens |

Key features: UUID primary keys, foreign key cascades, check constraints, auto-updating timestamps via triggers, and auto-profile creation on signup.

---

## 🤖 AI Architecture

### Provider Abstraction
```python
class LLMProvider(ABC):
    async def generate(self, prompt: str) -> str: ...

# Implementations:
GroqProvider    →  Production (Groq API, LLaMA 3.3 70B)
DemoProvider    →  Fallback (deterministic sample data)
```

### Generation Pipeline
1. **Prompt Construction** — Dynamic template injecting all user preferences (destination, dates, budget, interests, pace, dietary/accessibility needs)
2. **LLM Call** — Groq API with JSON format enforcement and temperature control
3. **Response Parsing** — Extracts JSON from LLM output (handles markdown code blocks)
4. **Pydantic Validation** — Validates against `Itinerary` schema with nested days/activities
5. **Retry Logic** — Up to 2 retries on parse failure, automatic DemoProvider fallback
6. **Post-Optimization** — Geographic reordering (Haversine + nearest-neighbor TSP), meal break validation, budget consistency checks

> [!NOTE]
> AI-generated itineraries are estimates. Opening hours, prices, and availability should be verified before travel.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account (free tier: [supabase.com](https://supabase.com))
- Groq API key (optional — demo mode works without it: [console.groq.com](https://console.groq.com))

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase and Groq credentials
uvicorn app.main:app --reload
```
Backend runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed (defaults to http://localhost:8000/api)
npm run dev
```
Frontend runs at `http://localhost:5173`.

### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and paste the contents of `supabase/schema.sql`
3. Click **Run** to create all tables
4. Copy your project URL and API keys to `backend/.env`

See [docs/deployment.md](docs/deployment.md) for the complete guide.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GROQ_API_KEY` | Groq API key for LLM | No (demo mode) |
| `GROQ_MODEL` | LLM model name | No (default: `llama-3.3-70b-versatile`) |
| `FRONTEND_URL` | Frontend origin for CORS | Yes |
| `ENVIRONMENT` | `development` or `production` | No |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default: `http://localhost:8000/api`) |

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/health` | Health check | No |
| `POST` | `/api/auth/signup` | Register user | No |
| `POST` | `/api/auth/login` | Login | No |
| `POST` | `/api/auth/logout` | Logout | Yes |
| `GET` | `/api/auth/me` | Current user | Yes |
| `POST` | `/api/trips` | Create trip | Yes |
| `GET` | `/api/trips` | List trips | Yes |
| `GET` | `/api/trips/{id}` | Get trip | Yes |
| `PATCH` | `/api/trips/{id}` | Update trip | Yes |
| `DELETE` | `/api/trips/{id}` | Delete trip | Yes |
| `POST` | `/api/trips/{id}/generate` | Generate itinerary | Yes |
| `GET` | `/api/trips/{id}/itinerary` | Get itinerary | Yes |
| `PATCH` | `/api/trips/{id}/itinerary` | Update itinerary | Yes |
| `POST` | `/api/trips/{id}/regenerate` | Regenerate | Yes |
| `POST` | `/api/trips/{id}/itinerary/activities` | Add activity | Yes |
| `PATCH` | `/api/trips/{id}/itinerary/activities/{aid}` | Update activity | Yes |
| `DELETE` | `/api/trips/{id}/itinerary/activities/{aid}` | Delete activity | Yes |
| `POST` | `/api/trips/{id}/share` | Create share link | Yes |
| `DELETE` | `/api/trips/{id}/share` | Revoke share | Yes |
| `GET` | `/api/shared/{token}` | View shared trip | No |
| `GET` | `/api/trips/{id}/export/pdf` | PDF export | Yes |
| `GET` | `/api/trips/{id}/export/print` | Printable HTML | Yes |

Full documentation: [docs/api-documentation.md](docs/api-documentation.md)

---

## 🧪 Testing

```bash
cd backend
python -m pytest tests/ -v
```

**Results: 25/25 tests passing ✅**

| Category | Tests | What's Covered |
|----------|-------|----------------|
| Health | 1 | Endpoint status and response |
| Schemas | 9 | Validation, constraints, rejection of bad data |
| Prompts | 3 | Dynamic preference injection, system rules |
| Trips | 6 | CRUD, ownership enforcement, auth |
| Itinerary | 6 | Generation, activities, sharing, PDF, optimizer |

External services (Supabase, Groq) are mocked — tests run fully offline.

See [docs/testing.md](docs/testing.md) for details.

---

## 🌐 Deployment

| Service | Platform | Guide |
|---------|----------|-------|
| Backend API | Render | [docs/deployment.md](docs/deployment.md) |
| Frontend | Vercel | [docs/deployment.md](docs/deployment.md) |
| Database | Supabase | [supabase/README.md](supabase/README.md) |

Quick summary:
- **Render**: Python web service, root dir `backend`, start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Vercel**: Vite project, root dir `frontend`, build output `dist`
- **Supabase**: Run `schema.sql` in SQL Editor

---

## 👤 User Scenarios

### Scenario A — Solo Weekend Traveler
A solo traveler plans a 2-day trip to Tokyo on a \$500 budget with interests in food and culture. WanderWise generates a balanced weekend itinerary with temple visits, street food tours, and transit directions — all within budget.

### Scenario B — Couple's Romantic Vacation
A couple plans a 5-day relaxed trip to Paris with premium preferences. The AI generates scenic walks, fine dining recommendations, museum visits, and sunset cruises — with options to regenerate any day they don't like.

### Scenario C — Group Adventure Trip
A group of 4 friends plans a 7-day adventure trip to Bali. The itinerary includes surfing, volcano hikes, temple visits, and nightlife — with cost splitting and a shareable read-only link for everyone.

---

## ⚠️ Known Limitations

- AI-generated cost estimates and opening hours should be verified before travel
- Map routing quality depends on coordinates provided by the AI model
- No real-time pricing or availability data from hotels/restaurants
- Free-tier Render services sleep after 15 minutes of inactivity
- Share links provide read-only access (collaborative editing planned)

## 🔮 Future Enhancements

- Real-time flight and hotel API integration (Amadeus, Booking.com)
- Collaborative trip editing with role-based permissions
- Mobile app (React Native)
- Multi-language support and localized recommendations
- Trip templates and community-shared itineraries
- Offline mode with Ollama for local LLM inference
- Calendar integration (Google Calendar, Apple Calendar)
- Weather-aware activity suggestions
- Social media trip journal

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) — Ultra-fast LLM inference
- [Supabase](https://supabase.com) — Open-source Firebase alternative
- [FastAPI](https://fastapi.tiangolo.com) — Modern Python web framework
- [React](https://react.dev) — UI component library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://openstreetmap.org) — Free map visualization
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Lucide](https://lucide.dev) — Beautiful icon set

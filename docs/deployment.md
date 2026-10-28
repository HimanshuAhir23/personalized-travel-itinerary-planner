# Deployment Guide — WanderWise AI

## Prerequisites

Before deploying, you need:

1. **Supabase Project** — [supabase.com](https://supabase.com) (free tier available)
2. **Groq API Key** — [console.groq.com](https://console.groq.com) (free tier available)
3. **GitHub Repository** — Code pushed to GitHub
4. **Render Account** — [render.com](https://render.com) (free tier available)
5. **Vercel Account** — [vercel.com](https://vercel.com) (free tier available)

---

## Step 1: Supabase Setup

### Create Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a region close to your users
3. Set a strong database password
4. Wait for the project to initialize

### Run Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and click **Run**
4. Verify all tables are created under **Table Editor**

### Get Credentials
From **Settings → API**:
- **Project URL** → `SUPABASE_URL`
- **anon/public key** → `SUPABASE_ANON_KEY`
- **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

> [!CAUTION]
> Never expose the `service_role` key in frontend code or public repositories.

### Configure Auth
1. Go to **Authentication → Settings**
2. Enable **Email** sign-up
3. Optionally disable email confirmation for development
4. Add your frontend URL to **Redirect URLs**

---

## Step 2: Deploy Backend to Render

### Create Web Service
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `wanderwise-api` |
| **Root Directory** | `backend` |
| **Runtime** | Python |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | Free (or paid for always-on) |

### Environment Variables
Add these in **Environment → Environment Variables**:

| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `GROQ_API_KEY` | Your Groq API key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| `FRONTEND_URL` | Your Vercel frontend URL (set after deploying frontend) |
| `ENVIRONMENT` | `production` |

### Verify Backend
After deployment:
- Visit `https://your-app.onrender.com/api/health` — should return `{"status": "healthy"}`
- Visit `https://your-app.onrender.com/docs` — should show Swagger UI

---

## Step 3: Deploy Frontend to Vercel

### Import Project
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `frontend` |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

### Environment Variables
Add in **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-app.onrender.com/api` |

> [!IMPORTANT]
> Vite environment variables must be prefixed with `VITE_` to be accessible in client code. After adding/changing env vars, redeploy the frontend.

### Verify Frontend
- Visit your Vercel URL — landing page should load
- Check browser console for CORS or API errors
- Test login/signup flow

---

## Step 4: Connect Frontend ↔ Backend

### Update CORS
After deploying the frontend, update the Render backend environment:
```
FRONTEND_URL=https://your-app.vercel.app
```

Redeploy the backend to pick up the new CORS configuration.

### Verify End-to-End
1. Open the frontend URL
2. Register a new account
3. Create a trip with preferences
4. Generate an itinerary
5. View the itinerary timeline
6. Share the trip
7. Export as PDF

---

## Post-Deployment Checklist

- [ ] Supabase schema.sql executed successfully
- [ ] Backend health endpoint returns 200
- [ ] Swagger docs accessible at `/docs`
- [ ] Frontend landing page loads
- [ ] User registration works
- [ ] User login works
- [ ] Trip creation works
- [ ] Itinerary generation works (with Groq API key)
- [ ] Demo mode works (without Groq API key)
- [ ] PDF export downloads correctly
- [ ] Share link generates and opens
- [ ] CORS: no browser console errors
- [ ] Environment variables are set (not hardcoded)
- [ ] Service role key is NOT in frontend env

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Render matches your exact Vercel domain (including `https://`)
- Redeploy backend after changing CORS settings
- Check that there's no trailing slash mismatch

### 401 Unauthorized
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check that the auth token is being sent in the `Authorization` header
- Ensure Supabase Auth email sign-up is enabled

### AI Generation Fails
- Verify `GROQ_API_KEY` is set and valid
- Check Groq API rate limits at [console.groq.com](https://console.groq.com)
- The app falls back to demo mode if the Groq key is missing

### Render Free Tier Sleep
- Free Render services spin down after 15 minutes of inactivity
- First request after sleep may take 30–60 seconds
- Upgrade to paid tier for always-on service

### Build Failures
- Backend: Ensure `requirements.txt` versions are compatible with your Python version
- Frontend: Run `npm run build` locally first to catch TypeScript errors

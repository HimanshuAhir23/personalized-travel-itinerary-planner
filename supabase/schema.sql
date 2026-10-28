-- ==============================================================================
-- Personalized Travel Itinerary Planner - Supabase PostgreSQL Database Schema
-- ==============================================================================

-- 1. EXTENSIONS
-- Enable UUID extension for generating v4 UUID identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- Profiles table (linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    destination TEXT NOT NULL,
    destination_country TEXT,
    destination_lat DOUBLE PRECISION,
    destination_lng DOUBLE PRECISION,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travelers INTEGER DEFAULT 1 CHECK (travelers > 0),
    travel_group TEXT DEFAULT 'solo' CHECK (travel_group IN ('solo', 'couple', 'family', 'friends', 'business')),
    budget DECIMAL(12,2) NOT NULL CHECK (budget > 0),
    currency TEXT DEFAULT 'USD',
    budget_level TEXT DEFAULT 'moderate' CHECK (budget_level IN ('budget', 'moderate', 'premium', 'luxury')),
    interests TEXT[] DEFAULT '{}',
    travel_pace TEXT DEFAULT 'moderate' CHECK (travel_pace IN ('relaxed', 'moderate', 'fast')),
    accommodation_style TEXT DEFAULT 'hotel',
    transportation TEXT[] DEFAULT '{"public_transit"}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    accessibility_needs TEXT[] DEFAULT '{}',
    avoid_activities TEXT[] DEFAULT '{}',
    additional_notes TEXT DEFAULT '',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'error')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Itinerary days table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    date DATE NOT NULL,
    summary TEXT DEFAULT '',
    daily_budget DECIMAL(10,2) DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(trip_id, day_number)
);

-- Activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    location TEXT DEFAULT '',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    start_time TEXT,
    duration_minutes INTEGER DEFAULT 60 CHECK (duration_minutes > 0),
    estimated_cost DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    travel_notes TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trip collaborators table
CREATE TABLE IF NOT EXISTS public.trip_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission TEXT DEFAULT 'read' CHECK (permission IN ('read', 'write', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(trip_id, user_id)
);

-- Share links table
CREATE TABLE IF NOT EXISTS public.share_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    permission TEXT DEFAULT 'read' CHECK (permission IN ('read', 'write')),
    expires_at TIMESTAMPTZ,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON public.activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_day_order ON public.activities(day_id, display_order);
CREATE INDEX IF NOT EXISTS idx_share_links_token ON public.share_links(token);
CREATE INDEX IF NOT EXISTS idx_share_links_trip_id ON public.share_links(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_trip_id ON public.trip_collaborators(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_collaborators_user_id ON public.trip_collaborators(user_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- Profiles Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Trips Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own trips" ON public.trips;
CREATE POLICY "Users can view own trips" 
    ON public.trips FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create trips" ON public.trips;
CREATE POLICY "Users can create trips" 
    ON public.trips FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own trips" ON public.trips;
CREATE POLICY "Users can update own trips" 
    ON public.trips FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own trips" ON public.trips;
CREATE POLICY "Users can delete own trips" 
    ON public.trips FOR DELETE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Collaborators can view trips" ON public.trips;
CREATE POLICY "Collaborators can view trips" 
    ON public.trips FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_collaborators 
            WHERE trip_collaborators.trip_id = trips.id 
              AND trip_collaborators.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can update trips if permitted" ON public.trips;
CREATE POLICY "Collaborators can update trips if permitted"
    ON public.trips FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_collaborators
            WHERE trip_collaborators.trip_id = trips.id
              AND trip_collaborators.user_id = auth.uid()
              AND trip_collaborators.permission IN ('write', 'admin')
        )
    );

-- ------------------------------------------------------------------------------
-- Itinerary Days Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trip owners can view days" ON public.itinerary_days;
CREATE POLICY "Trip owners can view days" 
    ON public.itinerary_days FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = itinerary_days.trip_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can view days" ON public.itinerary_days;
CREATE POLICY "Collaborators can view days"
    ON public.itinerary_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_collaborators
            WHERE trip_collaborators.trip_id = itinerary_days.trip_id
              AND trip_collaborators.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Trip owners can manage days" ON public.itinerary_days;
CREATE POLICY "Trip owners can manage days" 
    ON public.itinerary_days FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = itinerary_days.trip_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can manage days if permitted" ON public.itinerary_days;
CREATE POLICY "Collaborators can manage days if permitted"
    ON public.itinerary_days FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.trip_collaborators
            WHERE trip_collaborators.trip_id = itinerary_days.trip_id
              AND trip_collaborators.user_id = auth.uid()
              AND trip_collaborators.permission IN ('write', 'admin')
        )
    );

-- ------------------------------------------------------------------------------
-- Activities Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trip owners can view activities" ON public.activities;
CREATE POLICY "Trip owners can view activities" 
    ON public.activities FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.itinerary_days
            JOIN public.trips ON trips.id = itinerary_days.trip_id
            WHERE itinerary_days.id = activities.day_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can view activities" ON public.activities;
CREATE POLICY "Collaborators can view activities" 
    ON public.activities FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.itinerary_days
            JOIN public.trip_collaborators ON trip_collaborators.trip_id = itinerary_days.trip_id
            WHERE itinerary_days.id = activities.day_id 
              AND trip_collaborators.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Trip owners can manage activities" ON public.activities;
CREATE POLICY "Trip owners can manage activities" 
    ON public.activities FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.itinerary_days
            JOIN public.trips ON trips.id = itinerary_days.trip_id
            WHERE itinerary_days.id = activities.day_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can manage activities if permitted" ON public.activities;
CREATE POLICY "Collaborators can manage activities if permitted" 
    ON public.activities FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.itinerary_days
            JOIN public.trip_collaborators ON trip_collaborators.trip_id = itinerary_days.trip_id
            WHERE itinerary_days.id = activities.day_id 
              AND trip_collaborators.permission IN ('write', 'admin')
              AND trip_collaborators.user_id = auth.uid()
        )
    );

-- ------------------------------------------------------------------------------
-- Share Links Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trip owners can manage shares" ON public.share_links;
CREATE POLICY "Trip owners can manage shares" 
    ON public.share_links FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = share_links.trip_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Anyone can read valid share links by token" ON public.share_links;
CREATE POLICY "Anyone can read valid share links by token"
    ON public.share_links FOR SELECT
    USING (
        is_revoked = FALSE 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- ------------------------------------------------------------------------------
-- Trip Collaborators Policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Trip owners can manage collaborators" ON public.trip_collaborators;
CREATE POLICY "Trip owners can manage collaborators" 
    ON public.trip_collaborators FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.trips 
            WHERE trips.id = trip_collaborators.trip_id 
              AND trips.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Collaborators can view their memberships" ON public.trip_collaborators;
CREATE POLICY "Collaborators can view their memberships" 
    ON public.trip_collaborators FOR SELECT 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- 5. FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Trigger function: Automatically keep updated_at in sync with current timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_trips_updated_at ON public.trips;
CREATE TRIGGER update_trips_updated_at 
    BEFORE UPDATE ON public.trips 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_itinerary_days_updated_at ON public.itinerary_days;
CREATE TRIGGER update_itinerary_days_updated_at 
    BEFORE UPDATE ON public.itinerary_days 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_activities_updated_at ON public.activities;
CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON public.activities 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger function: Auto-create user profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            split_part(NEW.email, '@', 1)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'avatar_url',
            NEW.raw_user_meta_data->>'picture',
            ''
        )
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
    AFTER INSERT ON auth.users 
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

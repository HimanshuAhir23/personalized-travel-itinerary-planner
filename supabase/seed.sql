-- ==============================================================================
-- DEMO SEED DATA FOR PERSONALIZED TRAVEL ITINERARY PLANNER
-- ==============================================================================
-- Description:
--   This seed script creates sample demo users, profiles, trips, itinerary days,
--   activities, collaborator relationships, and share links for development
--   and testing purposes.
--
-- Notice:
--   - All records are labeled with fixed deterministic UUIDs for reproducible testing.
--   - If running in local Supabase CLI (`supabase db reset` or `supabase db seed`),
--     the demo users in `auth.users` will be created automatically.
--   - If running in Supabase Cloud SQL Editor, this script safely ensures test auth
--     accounts exist before inserting trips.
-- ==============================================================================

DO $$
DECLARE
    demo_user_1_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    demo_user_2_id UUID := '00000000-0000-0000-0000-000000000002'::uuid;
    trip_japan_id  UUID := 'a1111111-1111-1111-1111-111111111111'::uuid;
    trip_iceland_id UUID := 'b2222222-2222-2222-2222-222222222222'::uuid;
    
    -- Itinerary Day UUIDs for Japan Trip
    day_jp_1 UUID := 'c1111111-1111-1111-1111-000000000001'::uuid;
    day_jp_2 UUID := 'c1111111-1111-1111-1111-000000000002'::uuid;
    day_jp_3 UUID := 'c1111111-1111-1111-1111-000000000003'::uuid;
    day_jp_4 UUID := 'c1111111-1111-1111-1111-000000000004'::uuid;
    day_jp_5 UUID := 'c1111111-1111-1111-1111-000000000005'::uuid;
    day_jp_6 UUID := 'c1111111-1111-1111-1111-000000000006'::uuid;
    day_jp_7 UUID := 'c1111111-1111-1111-1111-000000000007'::uuid;

    -- Itinerary Day UUIDs for Iceland Trip
    day_is_1 UUID := 'd2222222-2222-2222-2222-000000000001'::uuid;
    day_is_2 UUID := 'd2222222-2222-2222-2222-000000000002'::uuid;
    day_is_3 UUID := 'd2222222-2222-2222-2222-000000000003'::uuid;
    day_is_4 UUID := 'd2222222-2222-2222-2222-000000000004'::uuid;
BEGIN

    -- --------------------------------------------------------------------------
    -- 1. DEMO AUTH USERS (Mock users in auth.users for development environments)
    -- --------------------------------------------------------------------------
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_1_id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            demo_user_1_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'demo.traveler@example.com',
            crypt('demoPassword123!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"display_name":"Alex Chen","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = demo_user_2_id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at
        ) VALUES (
            demo_user_2_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'sarah.partner@example.com',
            crypt('demoPassword123!', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"display_name":"Sarah Jenkins","avatar_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330"}'::jsonb,
            NOW(),
            NOW()
        );
    END IF;

    -- --------------------------------------------------------------------------
    -- 2. DEMO PROFILES
    -- --------------------------------------------------------------------------
    INSERT INTO public.profiles (id, display_name, avatar_url, preferences)
    VALUES 
    (
        demo_user_1_id,
        'Alex Chen (Demo)',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        '{"home_airport": "SFO", "preferred_currency": "USD", "theme": "system", "units": "metric"}'::jsonb
    ),
    (
        demo_user_2_id,
        'Sarah Jenkins (Demo)',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        '{"home_airport": "JFK", "preferred_currency": "USD", "theme": "dark", "units": "imperial"}'::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url,
        preferences = EXCLUDED.preferences,
        updated_at = NOW();

    -- --------------------------------------------------------------------------
    -- 3. DEMO TRIPS
    -- --------------------------------------------------------------------------
    -- Trip 1: Japan (Tokyo & Kyoto)
    INSERT INTO public.trips (
        id,
        user_id,
        destination,
        destination_country,
        destination_lat,
        destination_lng,
        start_date,
        end_date,
        travelers,
        travel_group,
        budget,
        currency,
        budget_level,
        interests,
        travel_pace,
        accommodation_style,
        transportation,
        dietary_restrictions,
        accessibility_needs,
        avoid_activities,
        additional_notes,
        status
    ) VALUES (
        trip_japan_id,
        demo_user_1_id,
        'Tokyo & Kyoto',
        'Japan',
        35.6762,
        139.6503,
        '2026-11-10',
        '2026-11-16',
        2,
        'couple',
        4200.00,
        'USD',
        'moderate',
        ARRAY['culture', 'culinary', 'photography', 'temples', 'shopping'],
        'moderate',
        'boutique_hotel',
        ARRAY['public_transit', 'walking', 'bullet_train'],
        ARRAY['shellfish_allergy'],
        ARRAY[]::TEXT[],
        ARRAY['extreme_sports'],
        'Celebrating our anniversary. Focus on authentic ramen spots, traditional tea ceremonies, and scenic autumn foliage.',
        'completed'
    )
    ON CONFLICT (id) DO UPDATE SET
        destination = EXCLUDED.destination,
        budget = EXCLUDED.budget,
        status = EXCLUDED.status,
        updated_at = NOW();

    -- Trip 2: Iceland (Reykjavik & Golden Circle)
    INSERT INTO public.trips (
        id,
        user_id,
        destination,
        destination_country,
        destination_lat,
        destination_lng,
        start_date,
        end_date,
        travelers,
        travel_group,
        budget,
        currency,
        budget_level,
        interests,
        travel_pace,
        accommodation_style,
        transportation,
        dietary_restrictions,
        accessibility_needs,
        avoid_activities,
        additional_notes,
        status
    ) VALUES (
        trip_iceland_id,
        demo_user_1_id,
        'Reykjavik & South Coast',
        'Iceland',
        64.1466,
        -21.9426,
        '2026-12-04',
        '2026-12-07',
        4,
        'friends',
        3200.00,
        'USD',
        'premium',
        ARRAY['nature', 'adventure', 'geothermal_springs', 'northern_lights', 'photography'],
        'fast',
        'cozy_cabin',
        ARRAY['rental_car'],
        ARRAY['vegetarian'],
        ARRAY[]::TEXT[],
        ARRAY['crowded_tours'],
        'Winter exploration prioritizing Aurora Borealis sightings, glacier hikes, and natural hot spring soaks.',
        'completed'
    )
    ON CONFLICT (id) DO UPDATE SET
        destination = EXCLUDED.destination,
        budget = EXCLUDED.budget,
        status = EXCLUDED.status,
        updated_at = NOW();

    -- --------------------------------------------------------------------------
    -- 4. ITINERARY DAYS FOR TRIP 1 (Tokyo & Kyoto - 7 Days)
    -- --------------------------------------------------------------------------
    INSERT INTO public.itinerary_days (id, trip_id, day_number, date, summary, daily_budget, notes)
    VALUES
    (
        day_jp_1,
        trip_japan_id,
        1,
        '2026-11-10',
        'Arrival in Tokyo & Shinjuku Nightscape',
        450.00,
        'Arrive at Haneda Airport (HND), activate Suica card, check into hotel in Shinjuku, and enjoy evening street food.'
    ),
    (
        day_jp_2,
        trip_japan_id,
        2,
        '2026-11-11',
        'Tradition & Modernity: Asakusa & Akihabara',
        520.00,
        'Visit Senso-ji early morning before crowds, cruise Sumida River, and browse electronics in Akihabara.'
    ),
    (
        day_jp_3,
        trip_japan_id,
        3,
        '2026-11-12',
        'Meiji Shrine, Harajuku & Shibuya Scramble',
        500.00,
        'Serene forest walk at Meiji Jingu, explore Omotesando architecture, and experience Shibuya Crossing from above.'
    ),
    (
        day_jp_4,
        trip_japan_id,
        4,
        '2026-11-13',
        'Bullet Train Shinkansen to Kyoto & Gion Evening',
        750.00,
        'Tokaido Shinkansen to Kyoto Station, check into traditional Machiya ryokan, and stroll historic Gion district.'
    ),
    (
        day_jp_5,
        trip_japan_id,
        5,
        '2026-11-14',
        'Fushimi Inari Torii Gates & Kiyomizu-dera',
        480.00,
        'Early sunrise hike through 10,000 vermilion Torii gates, followed by sweeping wooden terrace views at Kiyomizu-dera.'
    ),
    (
        day_jp_6,
        trip_japan_id,
        6,
        '2026-11-15',
        'Arashiyama Bamboo Grove & Kinkaku-ji',
        600.00,
        'Morning bamboo forest stroll, Tenryu-ji Zen garden, Golden Pavilion reflection, and evening Kaiseki dinner.'
    ),
    (
        day_jp_7,
        trip_japan_id,
        7,
        '2026-11-16',
        'Nishiki Market Souvenirs & Departure',
        400.00,
        'Browse Kyoto kitchen market for tea and crafts, Haruka express train to Kansai International Airport (KIX).'
    )
    ON CONFLICT (trip_id, day_number) DO UPDATE SET
        summary = EXCLUDED.summary,
        daily_budget = EXCLUDED.daily_budget,
        notes = EXCLUDED.notes,
        updated_at = NOW();

    -- --------------------------------------------------------------------------
    -- 5. ACTIVITIES FOR TRIP 1 (Tokyo & Kyoto)
    -- --------------------------------------------------------------------------
    -- Clean existing sample activities for idempotent re-runs
    DELETE FROM public.activities WHERE day_id IN (
        day_jp_1, day_jp_2, day_jp_3, day_jp_4, day_jp_5, day_jp_6, day_jp_7,
        day_is_1, day_is_2, day_is_3, day_is_4
    );

    -- Day 1 Activities
    INSERT INTO public.activities (day_id, name, category, description, location, latitude, longitude, start_time, duration_minutes, estimated_cost, currency, travel_notes, display_order)
    VALUES
    (
        day_jp_1,
        'Hotel Check-in & Luggage Drop',
        'accommodation',
        'Check into Hotel Gracery Shinjuku or drop baggage at reception desk.',
        '1-19-1 Kabukicho, Shinjuku-ku, Tokyo',
        35.6953,
        139.7020,
        '14:00',
        45,
        0.00,
        'USD',
        '5-minute walk from JR Shinjuku East Exit.',
        1
    ),
    (
        day_jp_1,
        'Tokyo Metropolitan Gov Building Observation Deck',
        'sightseeing',
        'Breathtaking 360-degree panoramic sunset views of Tokyo and Mount Fuji from the 45th-floor free deck.',
        '2-8-1 Nishishinjuku, Shinjuku-ku, Tokyo',
        35.6896,
        139.6921,
        '16:30',
        75,
        0.00,
        'USD',
        'Free admission. Bring camera for twilight skyline shots.',
        2
    ),
    (
        day_jp_1,
        'Omoide Yokocho (Memory Lane) Izakaya Dinner',
        'dining',
        'Cozy alleyway packed with intimate yakitori counters and authentic craft sake.',
        '1-2 Nishi-Shinjuku, Shinjuku-ku, Tokyo',
        35.6932,
        139.6998,
        '18:30',
        90,
        55.00,
        'USD',
        'Cash preferred in small izakayas. Mention shellfish allergy to the chef.',
        3
    ),

    -- Day 2 Activities
    (
        day_jp_2,
        'Senso-ji Temple & Nakamise-dori',
        'culture',
        'Tokyo oldest Buddhist temple, entered through the iconic Kaminarimon thunder gate.',
        '2-3-1 Asakusa, Taito-ku, Tokyo',
        35.7148,
        139.7967,
        '08:30',
        105,
        10.00,
        'USD',
        'Arrive early to capture photos before souvenir shops get congested.',
        1
    ),
    (
        day_jp_2,
        'Tsukiji Outer Market Food Sampling',
        'dining',
        'Sample fresh tamagoyaki (rolled omelet), matcha soft serve, and grilled wagyu skewers.',
        '4-16-2 Tsukiji, Chuo-ku, Tokyo',
        35.6655,
        139.7708,
        '11:30',
        90,
        40.00,
        'USD',
        'Take Hibiya Line from Ueno or Asakusa.',
        2
    ),
    (
        day_jp_2,
        'Akihabara Electric Town & Retro Gaming',
        'shopping',
        'Explore multi-level electronics superstores, retro game centers at Super Potato, and manga shops.',
        'Sotokanda, Chiyoda-ku, Tokyo',
        35.6983,
        139.7731,
        '14:00',
        120,
        35.00,
        'USD',
        'Tax-free shopping available with foreign passport.',
        3
    ),

    -- Day 3 Activities
    (
        day_jp_3,
        'Meiji Jingu Shrine Tranquil Forest Walk',
        'culture',
        'Vast, shaded forested sacred ground dedicated to Emperor Meiji and Empress Shoken.',
        '1-1 Yoyogikamizonocho, Shibuya-ku, Tokyo',
        35.6764,
        139.6993,
        '09:00',
        90,
        0.00,
        'USD',
        'Directly adjacent to Harajuku Station.',
        1
    ),
    (
        day_jp_3,
        'Takeshita Street & Omotesando Architecture',
        'shopping',
        'Contrast eclectic Harajuku pop culture fashion with high-end designer boutiques along Omotesando avenue.',
        'Jingumae, Shibuya-ku, Tokyo',
        35.6702,
        139.7027,
        '11:00',
        120,
        50.00,
        'USD',
        'Try Marion Crepes on Takeshita Street.',
        2
    ),
    (
        day_jp_3,
        'Shibuya Crossing & Shibuya Sky Observation',
        'sightseeing',
        'Watch the world’s busiest pedestrian intersection and view the city from the open-air rooftop observatory.',
        '2-24-12 Shibuya, Shibuya-ku, Tokyo',
        35.6585,
        139.7013,
        '16:00',
        100,
        25.00,
        'USD',
        'Shibuya Sky rooftop ticket pre-booked for 16:30 sunset slot.',
        3
    ),

    -- Day 4 Activities (Kyoto Transfer)
    (
        day_jp_4,
        'Shinkansen Bullet Train to Kyoto',
        'transit',
        'Ride the sleek Tokaido-Sanyo Shinkansen Nozomi bullet train through Shizuoka with views of Mount Fuji.',
        'Tokyo Station to Kyoto Station',
        35.6812,
        139.7671,
        '09:30',
        140,
        110.00,
        'USD',
        'Sit on the right side (Seats D/E) for Mount Fuji views around Shin-Fuji.',
        1
    ),
    (
        day_jp_4,
        'Machiya Ryokan Check-in',
        'accommodation',
        'Check into restored traditional wooden townhouse with tatami mat rooms and zen courtyard.',
        'Higashiyama Ward, Kyoto',
        34.9984,
        135.7770,
        '13:30',
        60,
        0.00,
        'USD',
        'Baggage forwarded or carried from Kyoto station by taxi.',
        2
    ),
    (
        day_jp_4,
        'Gion Historic District & Shirakawa Canal Walk',
        'culture',
        'Wander through preserved stone-paved alleys, wooden ochaya (tea houses), and willow-lined canals.',
        'Gionmachi Minamigawa, Higashiyama Ward, Kyoto',
        35.0037,
        135.7772,
        '16:30',
        120,
        20.00,
        'USD',
        'Be respectful and observe photography restrictions on private side streets.',
        3
    ),

    -- Day 5 Activities
    (
        day_jp_5,
        'Fushimi Inari Shrine Sunrise Ascent',
        'culture',
        'Hike the mountain path sheltered by over 10,000 vibrant vermilion torii gates dedicated to the god of rice.',
        '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
        34.9671,
        135.7727,
        '06:45',
        150,
        0.00,
        'USD',
        'Take JR Nara line 2 stops from Kyoto Station. Wear comfortable running shoes.',
        1
    ),
    (
        day_jp_5,
        'Kiyomizu-dera Temple & Ninenzaka Stroll',
        'culture',
        'Legendary Buddhist temple perched on wooden stilts over hillside maple trees, followed by traditional shops.',
        '1-294 Kiyomizu, Higashiyama Ward, Kyoto',
        34.9949,
        135.7850,
        '10:30',
        120,
        12.00,
        'USD',
        'Drink from Otowa Waterfall fountains for health, longevity, or success in studies.',
        2
    ),
    (
        day_jp_5,
        'Traditional Matcha & Wagashi Tea Ceremony',
        'dining',
        'Private ceremonial green tea preparation experience led by a certified Urasenke tea master.',
        'Kodaiji Temple Area, Kyoto',
        35.0001,
        135.7816,
        '14:30',
        75,
        45.00,
        'USD',
        'Socks required. Reservation confirmed.',
        3
    ),

    -- Day 6 Activities
    (
        day_jp_6,
        'Arashiyama Bamboo Grove & Tenryu-ji Garden',
        'nature',
        'Walk through soaring bamboo stalks that rustle in the wind, and visit UNESCO world heritage zen garden.',
        'Sagatenryuji Susukinobabacho, Ukyo Ward, Kyoto',
        35.0169,
        135.6713,
        '08:00',
        120,
        15.00,
        'USD',
        'Take JR San-in (Sagano) line to Saga-Arashiyama Station.',
        1
    ),
    (
        day_jp_6,
        'Kinkaku-ji (The Golden Pavilion)',
        'culture',
        'A Zen Buddhist temple whose top two floors are completely covered in gleaming gold leaf over a reflective mirror pond.',
        '1 Kinkakujicho, Kita Ward, Kyoto',
        35.0394,
        135.7292,
        '12:30',
        90,
        10.00,
        'USD',
        'Bus 204 or 205 connects directly.',
        2
    ),
    (
        day_jp_6,
        'Anniversary Multi-Course Kaiseki Banquet',
        'dining',
        'Exquisite 10-course seasonal kaiseki dinner featuring Kyoto heirloom vegetables, wagyu beef, and yuba.',
        'Pontocho Alley, Nakagyo Ward, Kyoto',
        35.0062,
        135.7711,
        '19:00',
        150,
        160.00,
        'USD',
        'Dietary allergy accommodated. Overlooks Kamogawa river.',
        3
    ),

    -- Day 7 Activities
    (
        day_jp_7,
        'Nishiki Market ("Kyoto Kitchen") Food & Souvenirs',
        'shopping',
        'Five-block historic shopping street lined with over 100 stalls selling artisanal pickles, knives, and snacks.',
        'Nakagyo Ward, Kyoto',
        35.0050,
        135.7649,
        '09:30',
        120,
        60.00,
        'USD',
        'Great place to purchase Japanese ceramics and hojicha roasted tea.',
        1
    ),
    (
        day_jp_7,
        'Kansai Airport Haruka Limited Express',
        'transit',
        'Direct train from Kyoto Station to Kansai International Airport (KIX) for outbound flight.',
        'Kyoto Station, Shimogyo Ward, Kyoto',
        34.9858,
        135.7588,
        '13:00',
        80,
        30.00,
        'USD',
        'Reserved seat ticket. Arrive at airport terminal 3 hours before international departure.',
        2
    );

    -- --------------------------------------------------------------------------
    -- 6. ITINERARY DAYS FOR TRIP 2 (Iceland - 4 Days)
    -- --------------------------------------------------------------------------
    INSERT INTO public.itinerary_days (id, trip_id, day_number, date, summary, daily_budget, notes)
    VALUES
    (
        day_is_1,
        trip_iceland_id,
        1,
        '2026-12-04',
        'Arrival, Blue Lagoon & Reykjavik Old Town',
        400.00,
        'Land at Keflavik (KEF), pick up 4x4 SUV, soak in Blue Lagoon silica waters, drive to Reykjavik apartment.'
    ),
    (
        day_is_2,
        trip_iceland_id,
        2,
        '2026-12-05',
        'Golden Circle Route: Thingvellir, Geysir & Gullfoss',
        350.00,
        'Continental tectonic plates rift, erupting Strokkur geyser, roaring Gullfoss waterfall, and evening Aurora hunt.'
    ),
    (
        day_is_3,
        trip_iceland_id,
        3,
        '2026-12-06',
        'South Coast Waterfalls & Black Sand Beach',
        420.00,
        'Seljalandsfoss walk-behind waterfall, Skogafoss rainbow mist, and dramatic Reynisfjara basalt columns in Vik.'
    ),
    (
        day_is_4,
        trip_iceland_id,
        4,
        '2026-12-07',
        'Hallgrimskirkja, Reykjavik Bakery & Airport Return',
        250.00,
        'Reykjavik landmark cathedral, famous Braud & Co cinnamon buns, duty-free shopping and departure.'
    )
    ON CONFLICT (trip_id, day_number) DO UPDATE SET
        summary = EXCLUDED.summary,
        daily_budget = EXCLUDED.daily_budget,
        notes = EXCLUDED.notes,
        updated_at = NOW();

    -- --------------------------------------------------------------------------
    -- 7. ACTIVITIES FOR TRIP 2 (Iceland)
    -- --------------------------------------------------------------------------
    INSERT INTO public.activities (day_id, name, category, description, location, latitude, longitude, start_time, duration_minutes, estimated_cost, currency, travel_notes, display_order)
    VALUES
    -- Day 1
    (
        day_is_1,
        'Blue Lagoon Geothermal Spa Comfort Experience',
        'wellness',
        'Relax in warm, mineral-rich milky blue waters surrounded by black volcanic lava fields.',
        'Nordurljosavegur 9, 240 Grindavik, Iceland',
        63.8804,
        -22.4495,
        '10:30',
        150,
        95.00,
        'USD',
        '20 minutes from Keflavik Airport. Towel and first drink included.',
        1
    ),
    (
        day_is_1,
        'Check-in at Downtown Reykjavik Apartment',
        'accommodation',
        'Modern 2-bedroom Nordic apartment located near Laugavegur high street.',
        'Laugavegur, 101 Reykjavik',
        64.1438,
        -21.9271,
        '14:30',
        45,
        0.00,
        'USD',
        'Free parking spot in rear driveway.',
        2
    ),
    (
        day_is_1,
        'Reykjavik Harbor Seafood & Craft Beer',
        'dining',
        'Dinner at Grandi Harbor featuring fresh Arctic char, langoustine soup, and vegetarian rye dishes.',
        'Grandagardur, 101 Reykjavik',
        64.1539,
        -21.9510,
        '18:30',
        90,
        55.00,
        'USD',
        'Vegetarian options available upon request.',
        3
    ),

    -- Day 2
    (
        day_is_2,
        'Thingvellir National Park Rift Valley',
        'nature',
        'Walk through the Almannagja gorge between the North American and Eurasian tectonic plates.',
        'Thingvellir, 801 Selfoss',
        64.2559,
        -21.1299,
        '09:00',
        120,
        8.00,
        'USD',
        'Parking fee paid via parkamap app.',
        1
    ),
    (
        day_is_2,
        'Geysir Geothermal Area & Strokkur',
        'sightseeing',
        'Watch the Strokkur geyser blast boiling water 20 meters into the air every 6-10 minutes.',
        'Haukadalur, South Iceland',
        64.3104,
        -20.3024,
        '12:00',
        75,
        0.00,
        'USD',
        'Stay on marked boardwalk paths to prevent burns.',
        2
    ),
    (
        day_is_2,
        'Gullfoss ("Golden Falls") Two-Tiered Waterfall',
        'nature',
        'Massive glacial cascade thundering into a deep rugged canyon on the Hvita river.',
        'Gullfoss, South Iceland',
        64.3271,
        -20.1199,
        '14:00',
        90,
        0.00,
        'USD',
        'Waterproof winter jacket and microspikes recommended in icy conditions.',
        3
    ),
    (
        day_is_2,
        'Northern Lights (Aurora Borealis) Chase',
        'adventure',
        'Drive out into dark rural skies toward Thingvallavatn to hunt clear visibility for the Northern Lights.',
        'South Iceland Dark Sky Zone',
        64.1950,
        -21.0500,
        '21:30',
        150,
        0.00,
        'USD',
        'Check Vedur.is aurora forecast and cloud cover maps before setting out.',
        4
    ),

    -- Day 3
    (
        day_is_3,
        'Seljalandsfoss Walk-Behind Waterfall',
        'nature',
        'Spectacular 60-meter high waterfall with an accessible cave path winding behind the curtain of water.',
        'Route 1, South Coast, Iceland',
        63.6156,
        -19.9886,
        '09:30',
        75,
        7.00,
        'USD',
        'Waterproof shell pants and jacket are essential.',
        1
    ),
    (
        day_is_3,
        'Skogafoss Waterfall & Staircase Climb',
        'sightseeing',
        'Thunderous 25-meter wide cataract with regular single and double rainbows; climb 527 steps for canyon vistas.',
        'Skogar, South Coast, Iceland',
        63.5321,
        -19.5114,
        '11:30',
        90,
        0.00,
        'USD',
        'Free admission. Restaurant and restrooms on site.',
        2
    ),
    (
        day_is_3,
        'Reynisfjara Black Sand Beach & Basalt Columns',
        'nature',
        'World-famous black volcanic pebble beach with dramatic basalt columns and offshore sea stacks near Vik.',
        'Route 215, Vik i Myrdal',
        63.4045,
        -19.0494,
        '14:30',
        90,
        0.00,
        'USD',
        'WARNING: Dangerous sneaker waves. Never turn your back on the ocean or cross warning lights.',
        3
    ),

    -- Day 4
    (
        day_is_4,
        'Hallgrimskirkja Cathedral & Tower Panorama',
        'sightseeing',
        'Distinctive basalt-inspired architecture towering over central Reykjavik with elevator to top observatory.',
        'Hallgrimstorg 1, 101 Reykjavik',
        64.1417,
        -21.9266,
        '09:00',
        60,
        10.00,
        'USD',
        'Great view of colorful Reykjavik rooftops.',
        1
    ),
    (
        day_is_4,
        'Braud & Co Artisan Bakery Warm Pastries',
        'dining',
        'Snack on freshly baked sourdough and legendary vanilla cardamom cinnamon knots straight out of the oven.',
        'Frakkastigur 16, 101 Reykjavik',
        64.1428,
        -21.9287,
        '10:15',
        40,
        15.00,
        'USD',
        'Takeaway pastries for road journey to the airport.',
        2
    ),
    (
        day_is_4,
        'Keflavik Airport Rental Vehicle Return & Flight',
        'transit',
        'Refuel 4x4 vehicle, complete drop-off inspection, and proceed through airport security.',
        'Keflavik International Airport, 235 Keflavik',
        63.9850,
        -22.6056,
        '13:00',
        90,
        0.00,
        'USD',
        'Ensure vehicle fuel tank is full to avoid rental surcharge.',
        3
    );

    -- --------------------------------------------------------------------------
    -- 8. TRIP COLLABORATORS
    -- --------------------------------------------------------------------------
    INSERT INTO public.trip_collaborators (id, trip_id, user_id, permission)
    VALUES
    (
        'e1111111-1111-1111-1111-000000000001'::uuid,
        trip_japan_id,
        demo_user_2_id,
        'write'
    )
    ON CONFLICT (trip_id, user_id) DO UPDATE SET
        permission = EXCLUDED.permission;

    -- --------------------------------------------------------------------------
    -- 9. SHARE LINKS (Publicly shareable read-only or read/write tokens)
    -- --------------------------------------------------------------------------
    INSERT INTO public.share_links (id, trip_id, token, permission, expires_at, is_revoked)
    VALUES
    (
        'f1111111-1111-1111-1111-000000000001'::uuid,
        trip_japan_id,
        'tokyo-kyoto-autumn-2026-demo',
        'read',
        NOW() + INTERVAL '90 days',
        FALSE
    ),
    (
        'f2222222-2222-2222-2222-000000000001'::uuid,
        trip_iceland_id,
        'iceland-winter-aurora-2026-demo',
        'read',
        NOW() + INTERVAL '90 days',
        FALSE
    )
    ON CONFLICT (token) DO UPDATE SET
        permission = EXCLUDED.permission,
        expires_at = EXCLUDED.expires_at,
        is_revoked = EXCLUDED.is_revoked;

END $$;

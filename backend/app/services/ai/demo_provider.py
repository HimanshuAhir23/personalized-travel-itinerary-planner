"""Fallback demo provider that generates deterministic, realistic travel itineraries."""

from datetime import datetime, timedelta
import json
import re
from typing import Any, Optional
from app.services.ai.provider import LLMProvider

CITY_TEMPLATES: dict[str, dict[str, Any]] = {
    "tokyo": {
        "planning_notes": "Tokyo has an efficient subway system (PASMO/Suica recommended). Best experienced with early morning temple visits and evening food explorations.",
        "days": [
            {
                "summary": "Historic Asakusa & Futuristic Akihabara",
                "notes": "Purchase a 24-hour Tokyo Subway ticket to save on transportation.",
                "activities": [
                    {
                        "name": "Senso-ji Temple Exploration",
                        "category": "culture",
                        "description": "Visit Tokyo's oldest Buddhist temple and stroll through Nakamise-dori shopping street.",
                        "location": "2-3-1 Asakusa, Taito City, Tokyo",
                        "latitude": 35.7148,
                        "longitude": 139.7967,
                        "start_time": "09:00",
                        "duration_minutes": 120,
                        "estimated_cost": 0.0,
                        "currency": "USD",
                        "travel_notes": "Take Ginza Line to Asakusa Station, Exit 1.",
                        "order": 1,
                    },
                    {
                        "name": "Traditional Soba Lunch at Namiki Yabusoba",
                        "category": "food",
                        "description": "Enjoy authentic handmade buckwheat noodles served with crispy tempura.",
                        "location": "2-11-9 Kaminarimon, Taito City, Tokyo",
                        "latitude": 35.7112,
                        "longitude": 139.7955,
                        "start_time": "12:00",
                        "duration_minutes": 60,
                        "estimated_cost": 22.0,
                        "currency": "USD",
                        "travel_notes": "5-minute walk south from Senso-ji.",
                        "order": 2,
                    },
                    {
                        "name": "Tokyo Skytree Panoramic View",
                        "category": "sightseeing",
                        "description": "Ascend to the observation deck of the world's tallest freestanding broadcast tower.",
                        "location": "1-1-2 Oshiage, Sumida City, Tokyo",
                        "latitude": 35.7100,
                        "longitude": 139.8107,
                        "start_time": "14:00",
                        "duration_minutes": 90,
                        "estimated_cost": 30.0,
                        "currency": "USD",
                        "travel_notes": "15-minute walk across the Sumida River or 1 stop on Tobu Skytree Line.",
                        "order": 3,
                    },
                    {
                        "name": "Dinner & Retro Tech in Akihabara",
                        "category": "nightlife",
                        "description": "Wander through electronics alleys and dine at an izakaya under the train tracks.",
                        "location": "Sotokanda, Chiyoda City, Tokyo",
                        "latitude": 35.6983,
                        "longitude": 139.7731,
                        "start_time": "18:00",
                        "duration_minutes": 150,
                        "estimated_cost": 45.0,
                        "currency": "USD",
                        "travel_notes": "Take Sobu Line directly to Akihabara Station.",
                        "order": 4,
                    },
                ],
            },
            {
                "summary": "Meiji Shrine, Harajuku & Shibuya Crossing",
                "notes": "Comfortable walking shoes are essential today.",
                "activities": [
                    {
                        "name": "Meiji Jingu Forest Walk",
                        "category": "nature",
                        "description": "Serene morning walk under evergreen forest canopy to Tokyo's prime Shinto shrine.",
                        "location": "1-1 Yoyogikamizonocho, Shibuya City, Tokyo",
                        "latitude": 35.6764,
                        "longitude": 139.6993,
                        "start_time": "09:00",
                        "duration_minutes": 90,
                        "estimated_cost": 0.0,
                        "currency": "USD",
                        "travel_notes": "JR Yamanote Line to Harajuku Station.",
                        "order": 1,
                    },
                    {
                        "name": "Takeshita Street Culture & Crepes",
                        "category": "culture",
                        "description": "Immerse in Japanese youth fashion, quirky boutiques, and artisanal sweet crepes.",
                        "location": "1 Jingumae, Shibuya City, Tokyo",
                        "latitude": 35.6716,
                        "longitude": 139.7032,
                        "start_time": "11:00",
                        "duration_minutes": 75,
                        "estimated_cost": 15.0,
                        "currency": "USD",
                        "travel_notes": "Directly across Harajuku Station exit.",
                        "order": 2,
                    },
                    {
                        "name": "Tonkatsu Lunch at Maisen Aoyama",
                        "category": "food",
                        "description": "Famous panko-breaded pork cutlets inside a former historic bathhouse.",
                        "location": "4-8-5 Jingumae, Shibuya City, Tokyo",
                        "latitude": 35.6669,
                        "longitude": 139.7095,
                        "start_time": "12:30",
                        "duration_minutes": 60,
                        "estimated_cost": 28.0,
                        "currency": "USD",
                        "travel_notes": "10-minute walk through Omotesando.",
                        "order": 3,
                    },
                    {
                        "name": "Shibuya Sky Observation & Crossing",
                        "category": "sightseeing",
                        "description": "Experience the open-air rooftop observatory followed by crossing the famous scramble.",
                        "location": "2-24-12 Shibuya, Shibuya City, Tokyo",
                        "latitude": 35.6580,
                        "longitude": 139.7016,
                        "start_time": "16:00",
                        "duration_minutes": 120,
                        "estimated_cost": 35.0,
                        "currency": "USD",
                        "travel_notes": "Walk down Meiji-dori or ride Yamanote 1 stop.",
                        "order": 4,
                    },
                ],
            },
            {
                "summary": "Art, Gardens & Roppongi Hills",
                "notes": "Book museum tickets in advance during peak periods.",
                "activities": [
                    {
                        "name": "teamLab Planets Immersive Art",
                        "category": "entertainment",
                        "description": "Walk through water and body-immersive digital light exhibits.",
                        "location": "6-1-16 Toyosu, Koto City, Tokyo",
                        "latitude": 35.6517,
                        "longitude": 139.7900,
                        "start_time": "09:30",
                        "duration_minutes": 120,
                        "estimated_cost": 38.0,
                        "currency": "USD",
                        "travel_notes": "Yurikamome Line to Shin-Toyosu Station.",
                        "order": 1,
                    },
                    {
                        "name": "Fresh Seafood Lunch at Tsukiji Outer Market",
                        "category": "food",
                        "description": "Sample fresh sashimi bowls, wagyu skewers, and tamagoyaki rolled omelets.",
                        "location": "4-16-2 Tsukiji, Chuo City, Tokyo",
                        "latitude": 35.6655,
                        "longitude": 139.7708,
                        "start_time": "12:15",
                        "duration_minutes": 75,
                        "estimated_cost": 32.0,
                        "currency": "USD",
                        "travel_notes": "Toei Oedo Line to Tsukijishijo Station.",
                        "order": 2,
                    },
                    {
                        "name": "Mori Art Museum & Roppongi City View",
                        "category": "culture",
                        "description": "Contemporary art exhibitions perched on the 53rd floor with views of Tokyo Tower.",
                        "location": "6-10-1 Roppongi, Minato City, Tokyo",
                        "latitude": 35.6605,
                        "longitude": 139.7292,
                        "start_time": "15:00",
                        "duration_minutes": 120,
                        "estimated_cost": 25.0,
                        "currency": "USD",
                        "travel_notes": "Hibiya Line to Roppongi Station.",
                        "order": 3,
                    },
                    {
                        "name": "Ramen Dinner at Afuri Roppongi",
                        "category": "food",
                        "description": "Signature yuzu shio ramen paired with handcrafted dumplings.",
                        "location": "6-2-31 Roppongi, Minato City, Tokyo",
                        "latitude": 35.6620,
                        "longitude": 139.7315,
                        "start_time": "18:30",
                        "duration_minutes": 60,
                        "estimated_cost": 20.0,
                        "currency": "USD",
                        "travel_notes": "Short walk from Roppongi Hills.",
                        "order": 4,
                    },
                ],
            },
        ],
    },
    "paris": {
        "planning_notes": "Paris is best discovered on foot and by Metro. Pre-booking timed-entry tickets for major museums avoids lengthy lines.",
        "days": [
            {
                "summary": "Iconic Landmarks & The Seine River",
                "notes": "Keep an eye on personal belongings around tourist hotspots.",
                "activities": [
                    {
                        "name": "Eiffel Tower Summit & Trocadero",
                        "category": "sightseeing",
                        "description": "Marvel at panoramic vistas over the Parisian cityscape from the Eiffel Tower summit.",
                        "location": "Champ de Mars, 5 Av. Anatole France, 75007 Paris",
                        "latitude": 48.8584,
                        "longitude": 2.2945,
                        "start_time": "09:00",
                        "duration_minutes": 120,
                        "estimated_cost": 35.0,
                        "currency": "USD",
                        "travel_notes": "Metro Line 6 to Bir-Hakeim or Line 9 to Trocadero.",
                        "order": 1,
                    },
                    {
                        "name": "Bistro Lunch at Café de l'Homme",
                        "category": "food",
                        "description": "Savor classic French cuisine featuring duck confit and tarte tatin.",
                        "location": "17 Pl. du Trocadéro, 75016 Paris",
                        "latitude": 48.8624,
                        "longitude": 2.2875,
                        "start_time": "12:00",
                        "duration_minutes": 75,
                        "estimated_cost": 45.0,
                        "currency": "USD",
                        "travel_notes": "Short walk across Pont d'Iéna.",
                        "order": 2,
                    },
                    {
                        "name": "Musée d'Orsay Impressionist Masterpieces",
                        "category": "culture",
                        "description": "Admire works by Monet, Van Gogh, and Renoir housed in a grand Beaux-Arts railway station.",
                        "location": "1 Rue de la Légion d'Honneur, 75007 Paris",
                        "latitude": 48.8599,
                        "longitude": 2.3265,
                        "start_time": "14:00",
                        "duration_minutes": 120,
                        "estimated_cost": 18.0,
                        "currency": "USD",
                        "travel_notes": "RER C to Musée d'Orsay.",
                        "order": 3,
                    },
                    {
                        "name": "Seine River Evening Cruise",
                        "category": "relaxation",
                        "description": "Glide past illuminated bridges and Notre-Dame Cathedral as dusk falls.",
                        "location": "Port de la Bourdonnais, 75007 Paris",
                        "latitude": 48.8601,
                        "longitude": 2.2974,
                        "start_time": "18:00",
                        "duration_minutes": 90,
                        "estimated_cost": 22.0,
                        "currency": "USD",
                        "travel_notes": "Board near Eiffel Tower pier.",
                        "order": 4,
                    },
                ],
            },
            {
                "summary": "Historic Heart & Montmartre Bohemia",
                "notes": "Expect steep cobbled hills in Montmartre.",
                "activities": [
                    {
                        "name": "Louvre Museum Highlights",
                        "category": "culture",
                        "description": "Explore the Mona Lisa, Winged Victory, and ancient antiquities.",
                        "location": "Rue de Rivoli, 75001 Paris",
                        "latitude": 48.8606,
                        "longitude": 2.3376,
                        "start_time": "09:00",
                        "duration_minutes": 150,
                        "estimated_cost": 24.0,
                        "currency": "USD",
                        "travel_notes": "Metro Line 1 to Palais-Royal Musée du Louvre.",
                        "order": 1,
                    },
                    {
                        "name": "Jardin des Tuileries & Pastry Break",
                        "category": "relaxation",
                        "description": "Stroll the sculpted gardens and enjoy hot chocolate and macarons at Angelina.",
                        "location": "226 Rue de Rivoli, 75001 Paris",
                        "latitude": 48.8656,
                        "longitude": 2.3298,
                        "start_time": "12:00",
                        "duration_minutes": 60,
                        "estimated_cost": 20.0,
                        "currency": "USD",
                        "travel_notes": "Walk directly adjacent to Louvre courtyard.",
                        "order": 2,
                    },
                    {
                        "name": "Sacré-Cœur Basilica & Montmartre Square",
                        "category": "sightseeing",
                        "description": "Visit the white-domed basilica overlooking Paris and watch artists at Place du Tertre.",
                        "location": "35 Rue du Chevalier de la Barre, 75018 Paris",
                        "latitude": 48.8867,
                        "longitude": 2.3431,
                        "start_time": "14:30",
                        "duration_minutes": 120,
                        "estimated_cost": 0.0,
                        "currency": "USD",
                        "travel_notes": "Metro Line 12 to Abbesses, then take the funicular or stairs.",
                        "order": 3,
                    },
                    {
                        "name": "Dinner at a Bohemian Montmartre Brasserie",
                        "category": "food",
                        "description": "Enjoy beef bourguignon and French onion soup with live accordion music.",
                        "location": "Rue des Abbesses, 75018 Paris",
                        "latitude": 48.8845,
                        "longitude": 2.3385,
                        "start_time": "18:00",
                        "duration_minutes": 90,
                        "estimated_cost": 40.0,
                        "currency": "USD",
                        "travel_notes": "Downhill stroll from Place du Tertre.",
                        "order": 4,
                    },
                ],
            },
        ],
    },
}


class DemoProvider(LLMProvider):
    """Deterministic LLM Provider producing comprehensive travel itinerary JSON."""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Parse requirements from prompt text and generate a structured JSON itinerary."""
        # 1. Detect destination
        destination = "Tokyo"
        dest_match = re.search(r"Destination:\s*([^\n\r,]+)", prompt, re.IGNORECASE)
        if dest_match:
            destination = dest_match.group(1).strip()
        else:
            for city in ["tokyo", "paris", "rome", "new york", "london", "barcelona", "bali"]:
                if city in prompt.lower():
                    destination = city.title()
                    break

        # 2. Detect dates or days count
        days_count = 3
        dates: list[str] = []
        days_match = re.search(r"(\d+)\s*days?", prompt, re.IGNORECASE)
        if days_match:
            try:
                days_count = max(1, min(14, int(days_match.group(1))))
            except Exception:
                days_count = 3

        # Detect specific start date if present (YYYY-MM-DD)
        date_matches = re.findall(r"\b20\d{2}-\d{2}-\d{2}\b", prompt)
        base_date = datetime.now().date() + timedelta(days=14)
        if date_matches:
            try:
                base_date = datetime.strptime(date_matches[0], "%Y-%m-%d").date()
                if len(date_matches) >= 2:
                    end_date = datetime.strptime(date_matches[1], "%Y-%m-%d").date()
                    days_count = max(1, (end_date - base_date).days + 1)
            except Exception:
                pass

        for i in range(days_count):
            dates.append((base_date + timedelta(days=i)).isoformat())

        # 3. Detect currency and budget
        currency = "USD"
        curr_match = re.search(r"Currency:\s*([A-Z]{3})", prompt, re.IGNORECASE)
        if curr_match:
            currency = curr_match.group(1).upper()

        total_budget = 1500.0
        budget_match = re.search(r"Budget:\s*([0-9.]+)", prompt, re.IGNORECASE)
        if budget_match:
            try:
                total_budget = float(budget_match.group(1))
            except Exception:
                pass

        trip_id = "demo-trip"
        id_match = re.search(r"Trip ID:\s*([a-zA-Z0-9_-]+)", prompt, re.IGNORECASE)
        if id_match:
            trip_id = id_match.group(1).strip()

        # 4. Choose or build template days
        city_key = destination.lower().split()[0]
        template = CITY_TEMPLATES.get(city_key)

        days_payload = []
        running_cost = 0.0
        daily_target = total_budget / days_count if days_count > 0 else 200.0

        for day_idx in range(days_count):
            day_num = day_idx + 1
            date_str = dates[day_idx]

            if template and day_idx < len(template["days"]):
                proto_day = template["days"][day_idx]
                summary = proto_day["summary"]
                notes = proto_day["notes"]
                activities = []
                day_cost = 0.0
                for act in proto_day["activities"]:
                    cost = act["estimated_cost"]
                    day_cost += cost
                    activities.append({
                        "name": act["name"],
                        "category": act["category"],
                        "description": act["description"],
                        "location": act["location"],
                        "latitude": act["latitude"],
                        "longitude": act["longitude"],
                        "start_time": act["start_time"],
                        "duration_minutes": act["duration_minutes"],
                        "estimated_cost": cost,
                        "currency": currency,
                        "travel_notes": act["travel_notes"],
                        "order": act["order"],
                    })
            else:
                # Procedurally generate generic destination activities
                summary = f"Exploring {destination}: Culture, Highlights & Local Cuisine"
                notes = f"Check opening hours and weather forecast before departure in {destination}."
                day_cost = 0.0
                proto_activities = [
                    (
                        f"Morning Highlights of {destination}",
                        "sightseeing",
                        f"Visit historical monuments and scenic viewpoints in the heart of {destination}.",
                        f"Historic Center, {destination}",
                        0.0,
                        "09:30",
                        120,
                        15.0,
                    ),
                    (
                        f"Traditional Lunch in {destination}",
                        "food",
                        f"Savor authentic regional delicacies at a highly rated local tavern in {destination}.",
                        f"Old Town Market, {destination}",
                        0.005,
                        "12:30",
                        75,
                        25.0,
                    ),
                    (
                        f"Cultural Discovery & Artisan Walk",
                        "culture",
                        f"Browse artisan workshops, heritage galleries, and lively street life in {destination}.",
                        f"Arts Quarter, {destination}",
                        0.010,
                        "14:30",
                        120,
                        20.0,
                    ),
                    (
                        f"Sunset Dinner & Evening Atmosphere",
                        "relaxation",
                        f"Relax with dinner and evening entertainment soaking in {destination}'s nightlife.",
                        f"Promenade District, {destination}",
                        0.015,
                        "18:30",
                        120,
                        40.0,
                    ),
                ]
                activities = []
                for order, (name, cat, desc, loc, offset, start_t, dur, cost) in enumerate(proto_activities, start=1):
                    day_cost += cost
                    activities.append({
                        "name": name,
                        "category": cat,
                        "description": desc,
                        "location": loc,
                        "latitude": 40.7128 + offset,
                        "longitude": -74.0060 + offset,
                        "start_time": start_t,
                        "duration_minutes": dur,
                        "estimated_cost": cost,
                        "currency": currency,
                        "travel_notes": "Use recommended local transit or walk between spots.",
                        "order": order,
                    })

            running_cost += day_cost
            days_payload.append({
                "day_number": day_num,
                "date": date_str,
                "summary": summary,
                "activities": activities,
                "daily_budget": round(daily_target, 2),
                "notes": notes,
            })

        planning_notes = (
            template.get("planning_notes", f"Enjoy your curated journey to {destination}! Remember to carry local currency and stay hydrated.")
            if template
            else f"Personalized itinerary crafted for {destination}. Check local recommendations and public transport passes for great savings."
        )

        response_dict = {
            "trip_id": trip_id,
            "days": days_payload,
            "total_estimated_cost": round(running_cost, 2),
            "currency": currency,
            "planning_notes": planning_notes,
            "is_demo": True,
        }

        return json.dumps(response_dict, indent=2)

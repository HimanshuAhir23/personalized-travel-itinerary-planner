"""Prompt engineering templates for WanderWise AI itinerary generation."""

from typing import Optional
from app.schemas.itinerary import ItineraryDay
from app.schemas.trip import TripCreate
from app.utils.helpers import calculate_days_between, get_date_range_strings

SYSTEM_ITINERARY_PROMPT = """You are WanderWise AI, the world's most capable and knowledgeable travel planning intelligence.
Your task is to generate an exhaustive, highly realistic, day-by-day travel itinerary tailored precisely to the user's destination, budget, group dynamics, travel pace, and personal preferences.

STRICT OPERATIONAL RULES:
1. OUTPUT FORMAT: Respond ONLY with a valid JSON object matching the requested schema. Do NOT wrap the JSON in Markdown backticks or commentary outside the JSON.
2. DATES & DAYS: Create an entry for every single calendar day between start_date and end_date (inclusive). Do not skip days.
3. LOGICAL PACING & REALISM:
   - "relaxed": 2-3 quality activities per day with ample downtime.
   - "moderate": 3-5 well-paced activities per day.
   - "fast": 5-7 energetic activities per day.
4. MEAL BREAKS & DIETARY REQUIREMENTS:
   - Provide dedicated meal breaks (lunch between 12:00-14:00, dinner between 18:00-20:30).
   - Ensure dining suggestions strictly honor dietary restrictions (e.g. halal, vegetarian, vegan, gluten-free, kosher).
5. GEOGRAPHIC PROXIMITY & TRANSIT EFFICIENCY:
   - Cluster activities in the same neighborhood or geographic sector on each day to minimize commute times.
   - Order activities sequentially from morning to evening so travel flows naturally.
   - Include realistic estimated GPS latitude and longitude coordinates for each activity.
6. BUDGET DISCIPLINE:
   - Ensure the total sum of activity estimated costs respects the user's budget and budget tier (budget, moderate, premium, luxury).
   - Provide realistic entry ticket and dining cost estimates in the specified currency.
7. NO DUPLICATE SIGHTS:
   - Each major attraction, landmark, or specific venue must be visited only once across the entire trip.
8. ACCESSIBILITY & AVOIDANCES:
   - Strictly honor accessibility needs (e.g., wheelchair friendly, step-free access, minimal steep climbs).
   - Strictly exclude any activities, venues, or themes listed in avoid_activities.
"""


def build_itinerary_prompt(trip: TripCreate, trip_id: Optional[str] = None) -> str:
    """Build a comprehensive prompt incorporating all user travel preferences."""
    days_count = calculate_days_between(trip.start_date, trip.end_date)
    date_list = get_date_range_strings(trip.start_date, trip.end_date)
    dates_str = ", ".join(date_list)

    interests_str = ", ".join(trip.interests) if trip.interests else "General sightseeing, culture, and highlights"
    diet_str = ", ".join(trip.dietary_restrictions) if trip.dietary_restrictions else "No special restrictions"
    access_str = ", ".join(trip.accessibility_needs) if trip.accessibility_needs else "Standard accessibility"
    avoid_str = ", ".join(trip.avoid_activities) if trip.avoid_activities else "None"
    transit_str = ", ".join(trip.transportation) if trip.transportation else "Public transit & walking"
    notes_str = trip.additional_notes.strip() if trip.additional_notes else "None"

    prompt = f"""Generate a complete {days_count}-day travel itinerary for:
Trip ID: {trip_id or 'new-trip'}
Destination: {trip.destination}
Dates: {trip.start_date} to {trip.end_date} ({days_count} days: {dates_str})
Travelers: {trip.travelers} ({trip.travel_group})
Budget: {trip.budget} {trip.currency} (Budget Level: {trip.budget_level})
Travel Pace: {trip.travel_pace}
Lodging Style: {trip.accommodation_style}
Preferred Transportation: {transit_str}
Interests & Passions: {interests_str}
Dietary Restrictions: {diet_str}
Accessibility Needs: {access_str}
Activities / Themes to Avoid: {avoid_str}
Additional Personal Requests: {notes_str}

SCHEMA REQUIREMENTS:
Return a JSON object with this exact structure:
{{
  "trip_id": "{trip_id or 'new-trip'}",
  "total_estimated_cost": <number, sum of all activity costs>,
  "currency": "{trip.currency}",
  "planning_notes": "<string with key advice, transit pass tips, cultural etiquette, packing>",
  "days": [
    {{
      "day_number": 1,
      "date": "{date_list[0]}",
      "summary": "<string title/summary for day 1>",
      "daily_budget": <number>,
      "notes": "<string daily tips>",
      "activities": [
        {{
          "name": "<string>",
          "category": "<sightseeing|food|culture|nature|adventure|shopping|relaxation|entertainment|nightlife|travel>",
          "description": "<string details>",
          "location": "<string landmark/address>",
          "latitude": <float>,
          "longitude": <float>,
          "start_time": "09:00",
          "duration_minutes": <int>,
          "estimated_cost": <number>,
          "currency": "{trip.currency}",
          "travel_notes": "<string transit advice>",
          "order": 1
        }}
      ]
    }}
  ]
}}
"""
    return prompt


def build_day_regeneration_prompt(
    trip: TripCreate,
    existing_day: ItineraryDay,
    instructions: str = "",
) -> str:
    """Build a prompt to regenerate a specific day of the itinerary."""
    diet_str = ", ".join(trip.dietary_restrictions) if trip.dietary_restrictions else "None"
    interests_str = ", ".join(trip.interests) if trip.interests else "General highlights"

    prompt = f"""Regenerate Day {existing_day.day_number} ({existing_day.date}) for the trip to {trip.destination}.
User Pace: {trip.travel_pace}
Travel Group: {trip.travel_group} ({trip.travelers} travelers)
Budget: {trip.budget} {trip.currency} ({trip.budget_level})
Interests: {interests_str}
Dietary Restrictions: {diet_str}
Special Instructions for this Day: {instructions or 'Provide an exciting alternative plan for this day.'}

SCHEMA REQUIREMENT:
Return a single JSON object for this day:
{{
  "day_number": {existing_day.day_number},
  "date": "{existing_day.date}",
  "summary": "<string summary>",
  "daily_budget": <number>,
  "notes": "<string notes>",
  "activities": [
    {{
      "name": "<string>",
      "category": "<category>",
      "description": "<description>",
      "location": "<location>",
      "latitude": <float>,
      "longitude": <float>,
      "start_time": "09:00",
      "duration_minutes": 90,
      "estimated_cost": 25.0,
      "currency": "{trip.currency}",
      "travel_notes": "<transit directions>",
      "order": 1
    }}
  ]
}}
"""
    return prompt

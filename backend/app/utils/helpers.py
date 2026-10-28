"""Utility helper functions for dates, coordinates, time, and JSON parsing."""

from datetime import date, datetime, timedelta
import json
import math
import re
from typing import Any, Optional


def calculate_days_between(start_date: date, end_date: date) -> int:
    """Return the inclusive number of days between start_date and end_date."""
    delta = (end_date - start_date).days
    return max(1, delta + 1)


def get_date_range_strings(start_date: date, end_date: date) -> list[str]:
    """Generate list of 'YYYY-MM-DD' date strings between start_date and end_date inclusive."""
    days_count = calculate_days_between(start_date, end_date)
    return [(start_date + timedelta(days=i)).isoformat() for i in range(days_count)]


def haversine_distance(
    lat1: Optional[float],
    lon1: Optional[float],
    lat2: Optional[float],
    lon2: Optional[float],
) -> float:
    """Calculate the great-circle distance between two points on the Earth (in kilometers).

    Returns 0.0 if any coordinate is None.
    """
    if lat1 is None or lon1 is None or lat2 is None or lon2 is None:
        return 0.0

    r = 6371.0  # Earth's radius in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(delta_phi / 2.0) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


def add_minutes_to_time(time_str: str, minutes_to_add: int) -> str:
    """Add minutes to a 'HH:MM' 24-hour time string and return new 'HH:MM' string."""
    try:
        parts = time_str.strip().split(":")
        hours = int(parts[0])
        minutes = int(parts[1]) if len(parts) > 1 else 0
        total_minutes = (hours * 60 + minutes + minutes_to_add) % (24 * 60)
        new_hours = total_minutes // 60
        new_minutes = total_minutes % 60
        return f"{new_hours:02d}:{new_minutes:02d}"
    except Exception:
        return time_str


def extract_json_from_text(text: str) -> dict[str, Any]:
    """Extract and parse valid JSON from text that may contain markdown or preamble."""
    text = text.strip()

    # Try 1: direct parse
    try:
        return json.loads(text)
    except Exception:
        pass

    # Try 2: extract from markdown ```json ... ``` code fence
    fence_pattern = r"```(?:json)?\s*([\s\S]*?)\s*```"
    match = re.search(fence_pattern, text)
    if match:
        fence_content = match.group(1).strip()
        try:
            return json.loads(fence_content)
        except Exception:
            pass

    # Try 3: find the first outer JSON object {...}
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            pass

    raise ValueError(f"Could not extract valid JSON from response: {text[:200]}...")

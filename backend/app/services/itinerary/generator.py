"""Generation service that coordinates LLM calls, parsing, retries, and optimization."""

from datetime import UTC, datetime
import logging
from typing import Optional
from app.schemas.itinerary import Activity, Itinerary, ItineraryDay
from app.schemas.trip import TripCreate
from app.services.ai.demo_provider import DemoProvider
from app.services.ai.provider import LLMProvider, get_provider
from app.services.itinerary.optimizer import ItineraryOptimizer
from app.services.prompts.itinerary_prompt import (
    SYSTEM_ITINERARY_PROMPT,
    build_day_regeneration_prompt,
    build_itinerary_prompt,
)
from app.utils.helpers import extract_json_from_text

logger = logging.getLogger(__name__)


class ItineraryGenerator:
    """Service to create and regenerate travel itineraries using AI with automated retries and optimizations."""

    def __init__(
        self,
        provider: Optional[LLMProvider] = None,
        optimizer: Optional[ItineraryOptimizer] = None,
    ):
        self.provider = provider or get_provider()
        self.optimizer = optimizer or ItineraryOptimizer()

    async def generate(self, trip: TripCreate, trip_id: str) -> Itinerary:
        """Generate a complete, optimized itinerary for the given trip parameters."""
        prompt = build_itinerary_prompt(trip, trip_id)
        max_retries = 2
        last_error = None

        for attempt in range(max_retries + 1):
            try:
                raw_response = await self.provider.generate(
                    prompt=prompt,
                    system_prompt=SYSTEM_ITINERARY_PROMPT,
                )
                parsed_json = extract_json_from_text(raw_response)
                # Ensure trip_id is set
                parsed_json["trip_id"] = trip_id

                # Handle is_demo flag
                if isinstance(self.provider, DemoProvider):
                    parsed_json["is_demo"] = True

                itinerary = Itinerary.model_validate(parsed_json)
                itinerary.created_at = datetime.now(UTC).isoformat()

                # Run post-generation optimization
                optimized = self.optimizer.optimize(itinerary, trip)
                return optimized

            except Exception as e:
                last_error = e
                logger.warning(
                    "Itinerary generation attempt %d failed: %s. Retrying...",
                    attempt + 1,
                    e,
                )

        # Fallback to DemoProvider if external LLM failed after retries
        logger.warning(
            "All LLM generation attempts failed with error: %s. Engaging DemoProvider fallback.",
            last_error,
        )
        demo = DemoProvider()
        raw_demo = await demo.generate(prompt=prompt, system_prompt=SYSTEM_ITINERARY_PROMPT)
        demo_json = extract_json_from_text(raw_demo)
        demo_json["trip_id"] = trip_id
        demo_json["is_demo"] = True
        demo_itinerary = Itinerary.model_validate(demo_json)
        demo_itinerary.created_at = datetime.now(UTC).isoformat()
        return self.optimizer.optimize(demo_itinerary, trip)

    async def regenerate_day(
        self,
        trip: TripCreate,
        existing_itinerary: Itinerary,
        day_number: int,
        instructions: str = "",
    ) -> ItineraryDay:
        """Regenerate a single day within an existing itinerary."""
        matching_day = next(
            (d for d in existing_itinerary.days if d.day_number == day_number),
            None,
        )
        if not matching_day:
            raise ValueError(f"Day {day_number} not found in itinerary for trip {existing_itinerary.trip_id}")

        prompt = build_day_regeneration_prompt(trip, matching_day, instructions)
        max_retries = 2
        last_error = None

        for attempt in range(max_retries + 1):
            try:
                raw_response = await self.provider.generate(
                    prompt=prompt,
                    system_prompt=SYSTEM_ITINERARY_PROMPT,
                )
                parsed_json = extract_json_from_text(raw_response)
                # Ensure day_number and date match
                parsed_json["day_number"] = day_number
                parsed_json["date"] = matching_day.date
                new_day = ItineraryDay.model_validate(parsed_json)
                return new_day
            except Exception as e:
                last_error = e
                logger.warning(
                    "Day regeneration attempt %d failed: %s. Retrying...",
                    attempt + 1,
                    e,
                )

        logger.warning("Day regeneration failed (%s); using fallback generation.", last_error)
        demo = DemoProvider()
        raw_demo = await demo.generate(prompt=prompt)
        demo_json = extract_json_from_text(raw_demo)
        if "days" in demo_json and demo_json["days"]:
            day_candidate = demo_json["days"][0]
            day_candidate["day_number"] = day_number
            day_candidate["date"] = matching_day.date
            return ItineraryDay.model_validate(day_candidate)

        return matching_day

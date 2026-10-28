"""Optimization and post-generation refinement for travel itineraries."""

import copy
import logging
from typing import Optional
from app.schemas.itinerary import Activity, Itinerary
from app.schemas.trip import TripCreate
from app.utils.helpers import add_minutes_to_time, haversine_distance

logger = logging.getLogger(__name__)


class ItineraryOptimizer:
    """Refines itineraries by reordering activities by geographic proximity,

    verifying meal breaks, validating budget constraints, and checking travel pace.
    """

    def optimize(self, itinerary: Itinerary, trip: TripCreate) -> Itinerary:
        """Run all optimization passes and return the enhanced itinerary."""
        # Work on a deep copy to avoid side-effects
        optimized_days = []
        warnings: list[str] = list(itinerary.warnings) if itinerary.warnings else []

        total_cost = 0.0

        for day in itinerary.days:
            # 1. Check activity count against travel pace
            day_warnings = self._check_pace(day.day_number, len(day.activities), trip.travel_pace)
            warnings.extend(day_warnings)

            # 2. Check for meal breaks
            meal_warnings = self._check_meal_breaks(day.day_number, day.activities)
            warnings.extend(meal_warnings)

            # 3. Optimize geographic route ordering
            optimized_activities = self._optimize_route(day.activities)

            # 4. Sum day cost
            day_cost = sum(act.estimated_cost for act in optimized_activities)
            total_cost += day_cost

            # Update daily budget if not set
            daily_budget = day.daily_budget if day.daily_budget > 0 else (trip.budget / max(1, len(itinerary.days)))

            updated_day = day.model_copy(
                update={
                    "activities": optimized_activities,
                    "daily_budget": round(daily_budget, 2),
                }
            )
            optimized_days.append(updated_day)

        # 5. Budget constraints check
        budget_warnings = self._check_budget(total_cost, trip.budget, trip.currency)
        warnings.extend(budget_warnings)

        return itinerary.model_copy(
            update={
                "days": optimized_days,
                "total_estimated_cost": round(total_cost, 2),
                "warnings": warnings,
            }
        )

    def _check_pace(self, day_num: int, activity_count: int, pace: str) -> list[str]:
        """Validate if the day's activity count aligns with user travel pace."""
        warnings = []
        pace_lower = (pace or "moderate").lower()

        if pace_lower == "relaxed" and activity_count > 3:
            warnings.append(
                f"Day {day_num} has {activity_count} activities, which may feel rushed for a relaxed pace (recommended: 2-3)."
            )
        elif pace_lower == "moderate" and activity_count > 5:
            warnings.append(
                f"Day {day_num} has {activity_count} activities, which might exceed a standard moderate pace (recommended: 3-5)."
            )
        elif pace_lower == "fast" and activity_count < 3:
            warnings.append(
                f"Day {day_num} has only {activity_count} activities for a fast-paced trip (recommended: 5-7)."
            )
        return warnings

    def _check_meal_breaks(self, day_num: int, activities: list[Activity]) -> list[str]:
        """Ensure the day features adequate meal or refreshments."""
        warnings = []
        meal_keywords = {"lunch", "dinner", "breakfast", "brunch", "bistro", "restaurant", "cafe", "food", "snack", "eat"}

        has_meal = any(
            act.category.lower() == "food"
            or any(k in act.name.lower() or k in act.description.lower() for k in meal_keywords)
            for act in activities
        )

        if not has_meal and len(activities) >= 2:
            warnings.append(f"Day {day_num} does not feature a dedicated meal break. Consider scheduling lunch or dinner.")

        return warnings

    def _optimize_route(self, activities: list[Activity]) -> list[Activity]:
        """Order activities using nearest-neighbor heuristic based on GPS coordinates.

        Preserves chronological start times while minimizing travel distances.
        """
        if len(activities) <= 1:
            return activities

        # Check if coordinates are present for all or most activities
        coords_count = sum(1 for a in activities if a.latitude is not None and a.longitude is not None)
        if coords_count < 2:
            # Re-index orders cleanly and return
            return [
                act.model_copy(update={"order": idx + 1})
                for idx, act in enumerate(activities)
            ]

        # Use nearest neighbor traveling salesperson algorithm starting with the first activity
        unvisited = list(activities)
        route: list[Activity] = []

        # Start with the first activity (typically morning)
        current = unvisited.pop(0)
        route.append(current)

        while unvisited:
            best_idx = 0
            best_dist = float("inf")

            for i, candidate in enumerate(unvisited):
                dist = haversine_distance(
                    current.latitude, current.longitude,
                    candidate.latitude, candidate.longitude,
                )
                if dist < best_dist:
                    best_dist = dist
                    best_idx = i

            current = unvisited.pop(best_idx)
            route.append(current)

        # Re-sequence times and order numbers
        reordered: list[Activity] = []
        current_time = route[0].start_time or "09:00"

        for idx, act in enumerate(route):
            # Calculate next start time if previous activity had a duration
            if idx > 0:
                prev_act = reordered[-1]
                # Add activity duration + 30 minutes transit buffer
                transit_buffer = 30
                current_time = add_minutes_to_time(prev_act.start_time, prev_act.duration_minutes + transit_buffer)

            updated_act = act.model_copy(
                update={
                    "order": idx + 1,
                    "start_time": current_time,
                }
            )
            reordered.append(updated_act)

        return reordered

    def _check_budget(self, total_cost: float, budget: float, currency: str) -> list[str]:
        """Verify if total estimated itinerary cost is within user budget limits."""
        warnings = []
        if budget > 0:
            if total_cost > budget:
                overage = round(total_cost - budget, 2)
                warnings.append(
                    f"Total estimated cost ({total_cost:.2f} {currency}) exceeds your planned budget of {budget:.2f} {currency} by {overage:.2f} {currency}."
                )
            elif total_cost < budget * 0.4:
                warnings.append(
                    f"Estimated activity costs ({total_cost:.2f} {currency}) are well below your allocated budget ({budget:.2f} {currency}), allowing room for premium experiences or fine dining."
                )
        return warnings

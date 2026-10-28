"""Trip and itinerary data persistence service using Supabase."""

from datetime import UTC, datetime, timedelta
import logging
import secrets
from typing import Any, Optional
import uuid
from fastapi import HTTPException, status
from app.schemas.itinerary import Activity, ActivityCreate, ActivityUpdate, Itinerary
from app.schemas.trip import TripCreate, TripUpdate

logger = logging.getLogger(__name__)


class TripService:
    """Handles CRUD operations for trips, itineraries, activities, and sharing links."""

    def __init__(self, supabase_client: Any):
        self.supabase = supabase_client

    async def create_trip(self, user_id: str, trip_data: TripCreate) -> dict[str, Any]:
        """Create a new trip record for the specified user."""
        trip_id = str(uuid.uuid4())
        now = datetime.now(UTC).isoformat()

        row = {
            "id": trip_id,
            "user_id": user_id,
            "destination": trip_data.destination,
            "start_date": trip_data.start_date.isoformat(),
            "end_date": trip_data.end_date.isoformat(),
            "travelers": trip_data.travelers,
            "travel_group": trip_data.travel_group,
            "budget": trip_data.budget,
            "currency": trip_data.currency,
            "budget_level": trip_data.budget_level,
            "interests": trip_data.interests,
            "travel_pace": trip_data.travel_pace,
            "accommodation_style": trip_data.accommodation_style,
            "transportation": trip_data.transportation,
            "dietary_restrictions": trip_data.dietary_restrictions,
            "accessibility_needs": trip_data.accessibility_needs,
            "avoid_activities": trip_data.avoid_activities,
            "additional_notes": trip_data.additional_notes,
            "status": "draft",
            "created_at": now,
            "updated_at": now,
            "has_itinerary": False,
        }

        try:
            res = self.supabase.table("trips").insert(row).execute()
            data = res.data
            if isinstance(data, list) and data:
                return data[0]
            if isinstance(data, dict):
                return data
            return row
        except Exception as e:
            logger.error("Failed to insert trip in Supabase: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create trip: {str(e)}",
            ) from e

    async def get_trips(self, user_id: str) -> list[dict[str, Any]]:
        """List all trips owned by the user, ordered by creation date."""
        try:
            res = (
                self.supabase.table("trips")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .execute()
            )
            return res.data or []
        except Exception as e:
            logger.error("Failed to query trips: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to fetch trips: {str(e)}",
            ) from e

    async def get_trip(self, trip_id: str, user_id: str) -> dict[str, Any]:
        """Fetch a specific trip owned by the user."""
        try:
            res = (
                self.supabase.table("trips")
                .select("*")
                .eq("id", trip_id)
                .execute()
            )
            data = res.data or []
            if not data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Trip with ID {trip_id} not found",
                )
            trip = data[0] if isinstance(data, list) else data
            if trip.get("user_id") != user_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to view this trip",
                )
            return trip
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to get trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve trip: {str(e)}",
            ) from e

    async def update_trip(
        self,
        trip_id: str,
        user_id: str,
        data: TripUpdate | dict[str, Any],
    ) -> dict[str, Any]:
        """Update fields on an existing trip."""
        # Check ownership first
        await self.get_trip(trip_id, user_id)

        update_dict = (
            data.model_dump(exclude_unset=True)
            if isinstance(data, TripUpdate)
            else dict(data)
        )

        if "start_date" in update_dict and hasattr(update_dict["start_date"], "isoformat"):
            update_dict["start_date"] = update_dict["start_date"].isoformat()
        if "end_date" in update_dict and hasattr(update_dict["end_date"], "isoformat"):
            update_dict["end_date"] = update_dict["end_date"].isoformat()

        update_dict["updated_at"] = datetime.now(UTC).isoformat()

        try:
            res = (
                self.supabase.table("trips")
                .update(update_dict)
                .eq("id", trip_id)
                .execute()
            )
            updated = res.data
            if isinstance(updated, list) and updated:
                return updated[0]
            if isinstance(updated, dict):
                return updated
            return await self.get_trip(trip_id, user_id)
        except Exception as e:
            logger.error("Failed to update trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update trip: {str(e)}",
            ) from e

    async def delete_trip(self, trip_id: str, user_id: str) -> bool:
        """Delete a trip and associated itinerary/shares."""
        await self.get_trip(trip_id, user_id)

        try:
            # Delete associated itinerary
            self.supabase.table("itineraries").delete().eq("trip_id", trip_id).execute()
            # Delete shares
            self.supabase.table("shares").delete().eq("trip_id", trip_id).execute()
            # Delete trip
            self.supabase.table("trips").delete().eq("id", trip_id).execute()
            return True
        except Exception as e:
            logger.error("Failed to delete trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete trip: {str(e)}",
            ) from e

    async def save_itinerary(
        self,
        trip_id: str,
        user_id: str,
        itinerary: Itinerary | dict[str, Any],
    ) -> dict[str, Any]:
        """Save or overwrite an itinerary for a trip."""
        await self.get_trip(trip_id, user_id)

        itinerary_data = (
            itinerary.model_dump()
            if isinstance(itinerary, Itinerary)
            else dict(itinerary)
        )
        itinerary_data["trip_id"] = trip_id
        now = datetime.now(UTC).isoformat()
        itinerary_data["updated_at"] = now

        try:
            # Check if itinerary exists
            existing = (
                self.supabase.table("itineraries")
                .select("*")
                .eq("trip_id", trip_id)
                .execute()
            )
            if existing.data and len(existing.data) > 0:
                res = (
                    self.supabase.table("itineraries")
                    .update(itinerary_data)
                    .eq("trip_id", trip_id)
                    .execute()
                )
            else:
                itinerary_data["created_at"] = now
                res = (
                    self.supabase.table("itineraries")
                    .insert(itinerary_data)
                    .execute()
                )

            # Update trip status and has_itinerary flag
            self.supabase.table("trips").update({
                "has_itinerary": True,
                "status": "generated",
                "updated_at": now,
            }).eq("id", trip_id).execute()

            saved = res.data
            if isinstance(saved, list) and saved:
                return saved[0]
            if isinstance(saved, dict):
                return saved
            return itinerary_data
        except Exception as e:
            logger.error("Failed to save itinerary for trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save itinerary: {str(e)}",
            ) from e

    async def get_itinerary(self, trip_id: str, user_id: str) -> dict[str, Any]:
        """Retrieve itinerary for a specific trip owned by user."""
        await self.get_trip(trip_id, user_id)

        try:
            res = (
                self.supabase.table("itineraries")
                .select("*")
                .eq("trip_id", trip_id)
                .execute()
            )
            data = res.data or []
            if not data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"No itinerary found for trip {trip_id}",
                )
            itinerary_record = data[0] if isinstance(data, list) else data
            return itinerary_record
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to fetch itinerary for trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get itinerary: {str(e)}",
            ) from e

    async def update_itinerary(
        self,
        trip_id: str,
        user_id: str,
        itinerary_data: dict[str, Any],
    ) -> dict[str, Any]:
        """Update itinerary details."""
        await self.get_itinerary(trip_id, user_id)
        itinerary_data["updated_at"] = datetime.now(UTC).isoformat()

        try:
            res = (
                self.supabase.table("itineraries")
                .update(itinerary_data)
                .eq("trip_id", trip_id)
                .execute()
            )
            updated = res.data
            if isinstance(updated, list) and updated:
                return updated[0]
            return itinerary_data
        except Exception as e:
            logger.error("Failed to update itinerary: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to update itinerary: {str(e)}",
            ) from e

    async def add_activity(
        self,
        trip_id: str,
        user_id: str,
        day_number: int,
        activity_data: ActivityCreate,
    ) -> dict[str, Any]:
        """Add a new activity to a specific day in the itinerary."""
        itinerary_dict = await self.get_itinerary(trip_id, user_id)
        days = itinerary_dict.get("days", [])

        target_day = next((d for d in days if d.get("day_number") == day_number), None)
        if not target_day:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Day {day_number} not found in trip itinerary",
            )

        existing_activities = target_day.get("activities", [])
        new_order = activity_data.order if activity_data.order is not None else len(existing_activities) + 1

        new_activity = Activity(
            id=str(uuid.uuid4()),
            name=activity_data.name,
            category=activity_data.category,
            description=activity_data.description,
            location=activity_data.location,
            latitude=activity_data.latitude,
            longitude=activity_data.longitude,
            start_time=activity_data.start_time,
            duration_minutes=activity_data.duration_minutes,
            estimated_cost=activity_data.estimated_cost,
            currency=activity_data.currency,
            travel_notes=activity_data.travel_notes,
            order=new_order,
        )

        existing_activities.append(new_activity.model_dump())
        target_day["activities"] = existing_activities

        # Recalculate total cost
        total_cost = sum(
            act.get("estimated_cost", 0.0)
            for d in days
            for act in d.get("activities", [])
        )
        itinerary_dict["total_estimated_cost"] = round(total_cost, 2)
        itinerary_dict["days"] = days

        await self.update_itinerary(trip_id, user_id, itinerary_dict)
        return new_activity.model_dump()

    async def remove_activity(
        self,
        trip_id: str,
        user_id: str,
        activity_id: str,
    ) -> dict[str, Any]:
        """Remove an activity by activity_id across any day in the itinerary."""
        itinerary_dict = await self.get_itinerary(trip_id, user_id)
        days = itinerary_dict.get("days", [])

        found = False
        for d in days:
            acts = d.get("activities", [])
            for i, act in enumerate(acts):
                if act.get("id") == activity_id:
                    acts.pop(i)
                    found = True
                    # Re-sequence orders
                    for o_idx, remaining in enumerate(acts):
                        remaining["order"] = o_idx + 1
                    break
            if found:
                break

        if not found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity {activity_id} not found in trip itinerary",
            )

        total_cost = sum(
            act.get("estimated_cost", 0.0)
            for d in days
            for act in d.get("activities", [])
        )
        itinerary_dict["total_estimated_cost"] = round(total_cost, 2)
        itinerary_dict["days"] = days

        await self.update_itinerary(trip_id, user_id, itinerary_dict)
        return {"success": True, "removed_activity_id": activity_id}

    async def update_activity(
        self,
        trip_id: str,
        user_id: str,
        activity_id: str,
        update_data: ActivityUpdate,
    ) -> dict[str, Any]:
        """Update properties of a specific activity in the itinerary."""
        itinerary_dict = await self.get_itinerary(trip_id, user_id)
        days = itinerary_dict.get("days", [])

        target_act = None
        for d in days:
            for act in d.get("activities", []):
                if act.get("id") == activity_id:
                    target_act = act
                    break
            if target_act:
                break

        if not target_act:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Activity {activity_id} not found",
            )

        changes = update_data.model_dump(exclude_unset=True)
        target_act.update(changes)

        total_cost = sum(
            act.get("estimated_cost", 0.0)
            for d in days
            for act in d.get("activities", [])
        )
        itinerary_dict["total_estimated_cost"] = round(total_cost, 2)
        itinerary_dict["days"] = days

        await self.update_itinerary(trip_id, user_id, itinerary_dict)
        return target_act

    async def create_share_link(
        self,
        trip_id: str,
        user_id: str,
        allow_fork: bool = True,
        expires_in_days: Optional[int] = 30,
        frontend_url: str = "http://localhost:5173",
    ) -> dict[str, Any]:
        """Generate a public share token for the trip."""
        await self.get_trip(trip_id, user_id)

        share_token = secrets.token_urlsafe(16)
        now = datetime.now(UTC)
        expires_at = (now + timedelta(days=expires_in_days)).isoformat() if expires_in_days else None

        share_record = {
            "share_token": share_token,
            "trip_id": trip_id,
            "user_id": user_id,
            "allow_fork": allow_fork,
            "created_at": now.isoformat(),
            "expires_at": expires_at,
            "is_active": True,
        }

        try:
            self.supabase.table("shares").insert(share_record).execute()
            return {
                "share_token": share_token,
                "share_url": f"{frontend_url}/shared/{share_token}",
                "trip_id": trip_id,
                "created_at": now,
                "expires_at": expires_at,
                "is_active": True,
                "allow_fork": allow_fork,
            }
        except Exception as e:
            logger.error("Failed to create share link: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create share link: {str(e)}",
            ) from e

    async def revoke_share_link(self, trip_id: str, user_id: str) -> bool:
        """Deactivate all share links for a trip."""
        await self.get_trip(trip_id, user_id)

        try:
            self.supabase.table("shares").update({"is_active": False}).eq("trip_id", trip_id).execute()
            return True
        except Exception as e:
            logger.error("Failed to revoke share links for trip %s: %s", trip_id, e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to revoke share link: {str(e)}",
            ) from e

    async def get_shared_trip(self, share_token: str) -> dict[str, Any]:
        """Fetch shared trip view by token (public, unauthenticated)."""
        try:
            res = (
                self.supabase.table("shares")
                .select("*")
                .eq("share_token", share_token)
                .eq("is_active", True)
                .execute()
            )
            data = res.data or []
            if not data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Shared trip link is invalid or has expired",
                )
            share_record = data[0] if isinstance(data, list) else data

            # Check expiration
            expires_at = share_record.get("expires_at")
            if expires_at:
                exp_date = datetime.fromisoformat(expires_at.replace("Z", "+00:00"))
                if datetime.now(UTC).replace(tzinfo=exp_date.tzinfo) > exp_date:
                    raise HTTPException(
                        status_code=status.HTTP_410_GONE,
                        detail="Shared trip link has expired",
                    )

            trip_id = share_record["trip_id"]

            trip_res = self.supabase.table("trips").select("*").eq("id", trip_id).execute()
            trips = trip_res.data or []
            if not trips:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Trip not found",
                )
            trip = trips[0] if isinstance(trips, list) else trips

            # Get itinerary
            itin_res = self.supabase.table("itineraries").select("*").eq("trip_id", trip_id).execute()
            itins = itin_res.data or []
            itinerary = itins[0] if itins else None

            return {
                "trip": trip,
                "itinerary": itinerary,
                "shared_by": "WanderWise Traveler",
                "created_at": share_record.get("created_at"),
                "share_token": share_token,
                "allow_fork": share_record.get("allow_fork", True),
            }
        except HTTPException:
            raise
        except Exception as e:
            logger.error("Failed to get shared trip: %s", e)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to retrieve shared trip: {str(e)}",
            ) from e

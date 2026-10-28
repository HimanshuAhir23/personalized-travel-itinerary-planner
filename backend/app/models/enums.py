"""Domain enums for WanderWise AI."""

from enum import Enum


class TravelGroup(str, Enum):
    SOLO = "solo"
    COUPLE = "couple"
    FAMILY = "family"
    FRIENDS = "friends"
    BUSINESS = "business"


class BudgetLevel(str, Enum):
    BUDGET = "budget"
    MODERATE = "moderate"
    PREMIUM = "premium"
    LUXURY = "luxury"


class TravelPace(str, Enum):
    RELAXED = "relaxed"
    MODERATE = "moderate"
    FAST = "fast"


class AccommodationStyle(str, Enum):
    HOTEL = "hotel"
    HOSTEL = "hostel"
    RESORT = "resort"
    APARTMENT = "apartment"
    BOUTIQUE = "boutique"
    VILLA = "villa"


class TransportationType(str, Enum):
    PUBLIC_TRANSIT = "public_transit"
    WALKING = "walking"
    RENTAL_CAR = "rental_car"
    RIDESHARE = "rideshare"
    BICYCLE = "bicycle"


class ActivityCategory(str, Enum):
    SIGHTSEEING = "sightseeing"
    FOOD = "food"
    CULTURE = "culture"
    NATURE = "nature"
    ADVENTURE = "adventure"
    SHOPPING = "shopping"
    RELAXATION = "relaxation"
    ENTERTAINMENT = "entertainment"
    NIGHTLIFE = "nightlife"
    TRAVEL = "travel"


class TripStatus(str, Enum):
    DRAFT = "draft"
    GENERATED = "generated"
    CUSTOMIZED = "customized"
    ARCHIVED = "archived"

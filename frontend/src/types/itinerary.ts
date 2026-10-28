export interface Activity {
  id?: string;
  name: string;
  category: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  start_time: string;
  duration_minutes: number;
  estimated_cost: number;
  currency: string;
  travel_notes: string;
  order: number;
}

export interface ItineraryDay {
  id?: string;
  day_number: number;
  date: string;
  summary: string;
  activities: Activity[];
  daily_budget: number;
  notes: string;
}

export interface Itinerary {
  trip_id: string;
  days: ItineraryDay[];
  total_estimated_cost: number;
  currency: string;
  planning_notes: string;
  is_demo: boolean;
}

export interface ShareOptions {
  trip_id: string;
  is_public: boolean;
  shareable_url: string;
  allow_copy?: boolean;
}

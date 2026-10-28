export type TravelGroup = 'solo' | 'couple' | 'family' | 'friends' | 'business';
export type BudgetLevel = 'budget' | 'moderate' | 'premium' | 'luxury';
export type TravelPace = 'relaxed' | 'moderate' | 'fast';
export type TripStatus = 'draft' | 'generating' | 'completed' | 'error';

export interface TripCreate {
  destination: string;
  start_date: string;
  end_date: string;
  travelers: number;
  travel_group: TravelGroup;
  budget: number;
  currency: string;
  budget_level: BudgetLevel;
  interests: string[];
  travel_pace: TravelPace;
  accommodation_style: string;
  transportation: string[];
  dietary_restrictions: string[];
  accessibility_needs: string[];
  avoid_activities: string[];
  additional_notes: string;
}

export interface Trip extends TripCreate {
  id: string;
  user_id: string;
  status: TripStatus;
  created_at: string;
  updated_at: string;
}

export interface TripStats {
  total_trips: number;
  upcoming_trips: number;
  countries_visited: number;
  total_budget_spent: number;
}

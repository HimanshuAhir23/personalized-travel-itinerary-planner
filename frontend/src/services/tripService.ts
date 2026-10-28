import api from './api';
import { Trip, TripCreate, TripStats } from '../types/trip';

const LOCAL_STORAGE_TRIPS_KEY = 'wanderwise_trips';

const INITIAL_MOCK_TRIPS: Trip[] = [
  {
    id: 'trip_kyoto_01',
    user_id: 'usr_demo_101',
    destination: 'Kyoto & Tokyo, Japan',
    start_date: '2026-11-10',
    end_date: '2026-11-18',
    travelers: 2,
    travel_group: 'couple',
    budget: 3800,
    currency: 'USD',
    budget_level: 'premium',
    interests: ['art_culture', 'culinary', 'historical', 'nature', 'photography'],
    travel_pace: 'moderate',
    accommodation_style: 'boutique_hotel',
    transportation: ['public_transit', 'train', 'walking'],
    dietary_restrictions: ['Pescatarian'],
    accessibility_needs: [],
    avoid_activities: ['Crowded tour buses'],
    additional_notes: 'Keen to experience traditional tea ceremonies, autumn foliage, and morning temple walks.',
    status: 'completed',
    created_at: '2026-10-20T10:00:00Z',
    updated_at: '2026-10-20T12:00:00Z',
  },
  {
    id: 'trip_barcelona_02',
    user_id: 'usr_demo_101',
    destination: 'Barcelona & Costa Brava, Spain',
    start_date: '2027-04-12',
    end_date: '2027-04-19',
    travelers: 4,
    travel_group: 'friends',
    budget: 4200,
    currency: 'EUR',
    budget_level: 'moderate',
    interests: ['culinary', 'art_culture', 'beaches', 'nightlife'],
    travel_pace: 'moderate',
    accommodation_style: 'vacation_rental',
    transportation: ['walking', 'public_transit', 'taxi_rideshare'],
    dietary_restrictions: [],
    accessibility_needs: [],
    avoid_activities: [],
    additional_notes: 'Tapas crawl, modernist architecture, and a catamaran day excursion.',
    status: 'completed',
    created_at: '2026-10-22T14:30:00Z',
    updated_at: '2026-10-22T15:00:00Z',
  },
  {
    id: 'trip_reykjavik_03',
    user_id: 'usr_demo_101',
    destination: 'Reykjavik & South Coast, Iceland',
    start_date: '2027-09-01',
    end_date: '2027-09-08',
    travelers: 1,
    travel_group: 'solo',
    budget: 2900,
    currency: 'USD',
    budget_level: 'premium',
    interests: ['nature', 'adventure', 'photography', 'wellness'],
    travel_pace: 'relaxed',
    accommodation_style: 'eco_lodge',
    transportation: ['rental_car'],
    dietary_restrictions: ['Gluten-Free'],
    accessibility_needs: [],
    avoid_activities: [],
    additional_notes: 'Chasing the aurora borealis, thermal lagoons, and glacier walks.',
    status: 'completed',
    created_at: '2026-10-25T09:15:00Z',
    updated_at: '2026-10-25T09:15:00Z',
  },
];

function getStoredTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(INITIAL_MOCK_TRIPS));
      return INITIAL_MOCK_TRIPS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_TRIPS;
  }
}

function saveStoredTrips(trips: Trip[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
  } catch (err) {
    console.error('Failed to save trips to localStorage:', err);
  }
}

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    try {
      const response = await api.get<Trip[]>('/trips');
      if (Array.isArray(response.data) && response.data.length > 0) {
        saveStoredTrips(response.data);
        return response.data;
      }
      return getStoredTrips();
    } catch {
      return getStoredTrips();
    }
  },

  async getTripById(id: string): Promise<Trip> {
    try {
      const response = await api.get<Trip>(`/trips/${id}`);
      return response.data;
    } catch {
      const local = getStoredTrips().find((t) => t.id === id);
      if (local) return local;
      throw new Error(`Trip with ID ${id} not found.`);
    }
  },

  async createTrip(tripData: TripCreate): Promise<Trip> {
    try {
      const response = await api.post<Trip>('/trips', tripData);
      const newTrip = response.data;
      const current = getStoredTrips();
      saveStoredTrips([newTrip, ...current]);
      return newTrip;
    } catch {
      const newTrip: Trip = {
        ...tripData,
        id: 'trip_' + Math.random().toString(36).substring(2, 9),
        user_id: 'usr_demo_101',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const current = getStoredTrips();
      saveStoredTrips([newTrip, ...current]);
      return newTrip;
    }
  },

  async updateTrip(id: string, updates: Partial<TripCreate>): Promise<Trip> {
    try {
      const response = await api.patch<Trip>(`/trips/${id}`, updates);
      return response.data;
    } catch {
      const current = getStoredTrips();
      const index = current.findIndex((t) => t.id === id);
      if (index === -1) throw new Error('Trip not found');
      const updated: Trip = {
        ...current[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      current[index] = updated;
      saveStoredTrips(current);
      return updated;
    }
  },

  async deleteTrip(id: string): Promise<void> {
    try {
      await api.delete(`/trips/${id}`);
    } catch {
      // Local fallback
    } finally {
      const current = getStoredTrips();
      saveStoredTrips(current.filter((t) => t.id !== id));
    }
  },

  async getStats(): Promise<TripStats> {
    try {
      const response = await api.get<TripStats>('/trips/stats');
      return response.data;
    } catch {
      const trips = getStoredTrips();
      const today = new Date().toISOString().split('T')[0];
      const upcoming = trips.filter((t) => t.start_date >= today).length;
      const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
      return {
        total_trips: trips.length,
        upcoming_trips: upcoming,
        countries_visited: 7, // Sample metric
        total_budget_spent: totalBudget,
      };
    }
  },
};

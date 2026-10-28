import api from './api';
import { Itinerary, ItineraryDay, Activity, ShareOptions } from '../types/itinerary';
import { tripService } from './tripService';

const MOCK_KYOTO_ITINERARY: Itinerary = {
  trip_id: 'trip_kyoto_01',
  currency: 'USD',
  total_estimated_cost: 3450,
  planning_notes: 'Crafted with balanced cultural pacing, serene morning temple visits before peak hours, and authentic kaiseki cuisine.',
  is_demo: true,
  days: [
    {
      id: 'day_1',
      day_number: 1,
      date: '2026-11-10',
      summary: 'Arrival in Ancient Kyoto & Gion Lantern Evening Walk',
      daily_budget: 350,
      notes: 'Check into your boutique machiya hotel, take an easy evening stroll along the Shirakawa canal, and taste fresh soba.',
      activities: [
        {
          id: 'act_1_1',
          name: 'Check-in at Machiya Ryokan Gion',
          category: 'Accommodation',
          description: 'Settle into a traditional preserved Japanese townhouse with private cypress wooden bath and garden views.',
          location: 'Gion-machi Minamigawa, Higashiyama, Kyoto',
          latitude: 35.0037,
          longitude: 135.7762,
          start_time: '14:00',
          duration_minutes: 60,
          estimated_cost: 0,
          currency: 'USD',
          travel_notes: '12 min taxi ride from Kyoto Station or direct Hankyu Line.',
          order: 1,
        },
        {
          id: 'act_1_2',
          name: 'Sunset Walk along Shirakawa Canal',
          category: 'Culture',
          description: 'Stroll along cobblestone paths lined with weeping willows, wooden machiya teahouses, and soft paper lanterns.',
          location: 'Shirakawa Minamidori, Kyoto',
          latitude: 35.0062,
          longitude: 135.7735,
          start_time: '16:30',
          duration_minutes: 75,
          estimated_cost: 0,
          currency: 'USD',
          travel_notes: '5 min walk from the hotel. Photogenic bridge spot.',
          order: 2,
        },
        {
          id: 'act_1_3',
          name: 'Welcome Dinner: Seasonal Soba & Tempura at Honke Owariya',
          category: 'Dining',
          description: 'Dine at Kyoto’s oldest soba establishment (dating back to 1465), known for fresh buckwheat noodles and dashi broth.',
          location: '322 Niomontsukinukecho, Nakagyo Ward, Kyoto',
          latitude: 35.0128,
          longitude: 135.7598,
          start_time: '18:30',
          duration_minutes: 90,
          estimated_cost: 65,
          currency: 'USD',
          travel_notes: 'Reservation advised. English menu available.',
          order: 3,
        },
      ],
    },
    {
      id: 'day_2',
      day_number: 2,
      date: '2026-11-11',
      summary: 'Torii Gates of Fushimi Inari & Historic Higashiyama',
      daily_budget: 420,
      notes: 'Early morning hike through the 10,000 vermilion gates to avoid crowds, followed by Kiyomizu-dera sunset.',
      activities: [
        {
          id: 'act_2_1',
          name: 'Early Morning Ascent at Fushimi Inari-Taisha',
          category: 'Culture & Nature',
          description: 'Hike through scenic trails spanned by thousands of vibrant vermilion torii gates dedicated to Inari, the Shinto god of rice.',
          location: '68 Fukakusa Yabunouchicho, Fushimi Ward, Kyoto',
          latitude: 34.9671,
          longitude: 135.7727,
          start_time: '07:30',
          duration_minutes: 150,
          estimated_cost: 15,
          currency: 'USD',
          travel_notes: 'JR Nara Line from Kyoto Station to Inari Station (5 mins).',
          order: 1,
        },
        {
          id: 'act_2_2',
          name: 'Nishiki Market Culinary Exploration',
          category: 'Food & Market',
          description: 'Kyoto’s famous "Kitchen" featuring five blocks of skewers, matcha soft serve, octopus treats, and artisanal spices.',
          location: 'Nakagyo Ward, Kyoto',
          latitude: 35.005,
          longitude: 135.7649,
          start_time: '12:00',
          duration_minutes: 100,
          estimated_cost: 45,
          currency: 'USD',
          travel_notes: 'Take the subway back to Shijo Station.',
          order: 2,
        },
        {
          id: 'act_2_3',
          name: 'Kiyomizu-dera Temple at Golden Hour',
          category: 'Sightseeing',
          description: 'Iconic UNESCO heritage wooden temple cantilevered high over maple trees with panoramic views of Kyoto.',
          location: '1 Chome-294 Kiyomizu, Higashiyama Ward, Kyoto',
          latitude: 34.9949,
          longitude: 135.785,
          start_time: '16:00',
          duration_minutes: 120,
          estimated_cost: 30,
          currency: 'USD',
          travel_notes: 'Walk via scenic Ninenzaka and Sannenzaka preservation streets.',
          order: 3,
        },
      ],
    },
    {
      id: 'day_3',
      day_number: 3,
      date: '2026-11-12',
      summary: 'Arashiyama Bamboo Grove & Tenryu-ji Zen Garden',
      daily_budget: 390,
      notes: 'Western Kyoto exploration, crossing the Togetsukyo bridge and sipping matcha inside a monastery courtyard.',
      activities: [
        {
          id: 'act_3_1',
          name: 'Arashiyama Bamboo Grove Walk',
          category: 'Nature',
          description: 'Wander under the towering natural green canopy as gentle mountain winds create the ethereal sound of rustling bamboo.',
          location: 'Sagatenryuji Susukinobabacho, Ukyo Ward, Kyoto',
          latitude: 35.017,
          longitude: 135.6713,
          start_time: '08:00',
          duration_minutes: 90,
          estimated_cost: 0,
          currency: 'USD',
          travel_notes: 'Take the San-in line train to Saga-Arashiyama Station.',
          order: 1,
        },
        {
          id: 'act_3_2',
          name: 'Zen Meditation & Pond Garden at Tenryu-ji',
          category: 'Culture',
          description: 'Marvel at Soseki’s 14th-century circular landscaping that mirrors the surrounding Arashiyama mountain ridge.',
          location: '68 Sagatenryuji Susukinobabacho, Ukyo Ward, Kyoto',
          latitude: 35.0157,
          longitude: 135.6776,
          start_time: '10:00',
          duration_minutes: 90,
          estimated_cost: 25,
          currency: 'USD',
          travel_notes: 'Immediately adjacent to the bamboo forest path.',
          order: 2,
        },
        {
          id: 'act_3_3',
          name: 'Okochi Sanso Villa & Matcha Garden',
          category: 'Leisure',
          description: 'A hillside mountain villa with tranquil teahouse serving fresh matcha and traditional sweet confection.',
          location: '8 Sagaogurayama Tabuchiyamacho, Ukyo Ward, Kyoto',
          latitude: 35.0185,
          longitude: 135.6698,
          start_time: '14:00',
          duration_minutes: 75,
          estimated_cost: 20,
          currency: 'USD',
          travel_notes: 'Includes entrance to tea pavilion.',
          order: 3,
        },
      ],
    },
  ],
};

function generateDynamicItinerary(tripId: string, destination: string, startDate: string, endDate: string, budget: number, currency: string): Itinerary {
  const daysCount = 4;
  const days: ItineraryDay[] = [];
  const dailyBudget = Math.round(budget / daysCount);

  const sampleSpots = [
    { name: `Historic Old Town & Central Square of ${destination}`, cat: 'Culture', dur: 120, time: '09:30', cost: 25 },
    { name: `Artisan Culinary Tasting Tour`, cat: 'Food & Dining', dur: 90, time: '13:00', cost: 45 },
    { name: `Panoramic Scenic Viewpoint & Promenade`, cat: 'Sightseeing', dur: 100, time: '16:00', cost: 15 },
    { name: `Atmospheric Evening Bistro Experience`, cat: 'Dining', dur: 120, time: '19:30', cost: 60 },
  ];

  for (let i = 1; i <= daysCount; i++) {
    const curDate = new Date();
    curDate.setDate(curDate.getDate() + i);
    const dateStr = curDate.toISOString().split('T')[0];

    days.push({
      id: `day_${tripId}_${i}`,
      day_number: i,
      date: dateStr,
      summary: `Day ${i}: Discovering Highlights & Hidden Gems of ${destination}`,
      daily_budget: dailyBudget,
      notes: `A well-paced day combining cultural landmarks, relaxed pedestrian exploration, and local culinary delicacies.`,
      activities: sampleSpots.map((spot, idx) => ({
        id: `act_${tripId}_${i}_${idx + 1}`,
        name: idx === 0 ? `Morning: ${spot.name}` : spot.name,
        category: spot.cat,
        description: `Experience the finest ${spot.cat.toLowerCase()} that ${destination} has to offer with curated local recommendations.`,
        location: `${destination} City Center`,
        latitude: 48.8566 + (Math.random() - 0.5) * 0.05,
        longitude: 2.3522 + (Math.random() - 0.5) * 0.05,
        start_time: spot.time,
        duration_minutes: spot.dur,
        estimated_cost: spot.cost,
        currency: currency || 'USD',
        travel_notes: 'Walking or short public transit ride.',
        order: idx + 1,
      })),
    });
  }

  return {
    trip_id: tripId,
    days,
    total_estimated_cost: budget ? Math.round(budget * 0.9) : 2200,
    currency: currency || 'USD',
    planning_notes: `Personalized AI itinerary generated for ${destination}. Balanced pace optimized for comfortable travel.`,
    is_demo: true,
  };
}

export const itineraryService = {
  async getItinerary(tripId: string): Promise<Itinerary> {
    try {
      const response = await api.get<Itinerary>(`/trips/${tripId}/itinerary`);
      if (response.data && response.data.days && response.data.days.length > 0) {
        return response.data;
      }
    } catch {
      // Fallback
    }

    // Check localStorage for saved itinerary
    const stored = localStorage.getItem(`wanderwise_itinerary_${tripId}`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // ignore
      }
    }

    if (tripId === 'trip_kyoto_01') {
      return MOCK_KYOTO_ITINERARY;
    }

    // Generate dynamic
    let destination = 'Destination';
    let budget = 2500;
    let currency = 'USD';
    try {
      const trip = await tripService.getTripById(tripId);
      if (trip) {
        destination = trip.destination;
        budget = trip.budget;
        currency = trip.currency;
      }
    } catch {
      // ignore
    }

    const generated = generateDynamicItinerary(tripId, destination, '', '', budget, currency);
    localStorage.setItem(`wanderwise_itinerary_${tripId}`, JSON.stringify(generated));
    return generated;
  },

  async generateItinerary(tripId: string): Promise<Itinerary> {
    try {
      const response = await api.post<Itinerary>(`/trips/${tripId}/itinerary/generate`);
      if (response.data) {
        localStorage.setItem(`wanderwise_itinerary_${tripId}`, JSON.stringify(response.data));
        return response.data;
      }
    } catch {
      // Local fallback
    }

    const trip = await tripService.getTripById(tripId);
    const newItinerary = generateDynamicItinerary(
      tripId,
      trip?.destination || 'Destination',
      trip?.start_date || '',
      trip?.end_date || '',
      trip?.budget || 2400,
      trip?.currency || 'USD'
    );
    localStorage.setItem(`wanderwise_itinerary_${tripId}`, JSON.stringify(newItinerary));
    return newItinerary;
  },

  async regenerateDay(tripId: string, dayNumber: number): Promise<ItineraryDay> {
    try {
      const response = await api.post<ItineraryDay>(`/trips/${tripId}/itinerary/days/${dayNumber}/regenerate`);
      return response.data;
    } catch {
      const current = await this.getItinerary(tripId);
      const targetDay = current.days.find((d) => d.day_number === dayNumber);
      if (!targetDay) throw new Error('Day not found');

      const regeneratedActivities: Activity[] = targetDay.activities.map((a, i) => ({
        ...a,
        name: `${a.name} (Curated Alternative)`,
        description: `Enhanced schedule alternative: ${a.description}`,
      }));

      const updatedDay: ItineraryDay = {
        ...targetDay,
        summary: `${targetDay.summary} • Refreshed Route`,
        activities: regeneratedActivities,
      };

      current.days = current.days.map((d) => (d.day_number === dayNumber ? updatedDay : d));
      localStorage.setItem(`wanderwise_itinerary_${tripId}`, JSON.stringify(current));
      return updatedDay;
    }
  },

  async updateActivityOrder(tripId: string, dayNumber: number, activities: Activity[]): Promise<Itinerary> {
    const current = await this.getItinerary(tripId);
    const updatedDays = current.days.map((day) => {
      if (day.day_number === dayNumber) {
        return {
          ...day,
          activities: activities.map((act, index) => ({
            ...act,
            order: index + 1,
          })),
        };
      }
      return day;
    });

    const updatedItinerary: Itinerary = {
      ...current,
      days: updatedDays,
    };

    try {
      await api.put(`/trips/${tripId}/itinerary/days/${dayNumber}/activities`, { activities });
    } catch {
      // Local fallback
    }

    localStorage.setItem(`wanderwise_itinerary_${tripId}`, JSON.stringify(updatedItinerary));
    return updatedItinerary;
  },

  async shareItinerary(tripId: string): Promise<ShareOptions> {
    const origin = window.location.origin;
    const shareUrl = `${origin}/share/${tripId}`;
    try {
      const response = await api.post<ShareOptions>(`/trips/${tripId}/share`);
      return response.data;
    } catch {
      return {
        trip_id: tripId,
        is_public: true,
        shareable_url: shareUrl,
        allow_copy: true,
      };
    }
  },

  async getSharedItinerary(tripId: string): Promise<{ trip: any; itinerary: Itinerary }> {
    try {
      const response = await api.get<{ trip: any; itinerary: Itinerary }>(`/share/${tripId}`);
      return response.data;
    } catch {
      const trip = await tripService.getTripById(tripId);
      const itinerary = await this.getItinerary(tripId);
      return { trip, itinerary };
    }
  },
};

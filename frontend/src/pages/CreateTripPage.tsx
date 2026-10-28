import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { TripForm } from '../components/trips/TripForm';
import { TripCreate } from '../types/trip';

export const CreateTripPage: React.FC = () => {
  const { createTrip, isCreating } = useTrips();
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('dest') || '';

  const handleSubmit = async (tripData: TripCreate) => {
    return await createTrip(tripData);
  };

  return (
    <div className="py-8 bg-[#FFFFF0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6 text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
          Design Your Next Journey
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          Share your destination, dates, travel style, and budget. Our AI will assemble a customized, day-by-day itinerary.
        </p>
      </div>

      <TripForm
        onSubmit={handleSubmit}
        isSubmitting={isCreating}
        initialDestination={initialDestination}
      />
    </div>
  );
};

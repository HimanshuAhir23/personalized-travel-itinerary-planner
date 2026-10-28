import React from 'react';
import { MapPin, Calendar, Users, Wallet, Compass, Sparkles, Edit3, ShieldAlert } from 'lucide-react';
import { TripCreate } from '../../types/trip';
import { formatCurrency, formatTripDates, calculateDays } from '../../utils/formatters';

export interface ReviewStepProps {
  tripData: TripCreate;
  onEditStep: (stepNumber: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ tripData, onEditStep }) => {
  const days = calculateDays(tripData.start_date, tripData.end_date);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          Review Your Travel Blueprint
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Double-check your preferences before WanderWise AI generates your day-by-day itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destination & Dates */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Destination & Dates
              </span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A2E]">{tripData.destination}</h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#87A96B]" />
              {formatTripDates(tripData.start_date, tripData.end_date)} ({days} Days)
            </p>
          </div>
        </div>

        {/* Travelers */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Group Dynamics
              </span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <h3 className="text-lg font-bold text-[#1A1A2E]">
              {tripData.travelers} {tripData.travelers === 1 ? 'Traveler' : 'Travelers'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              Group Type: <span className="font-semibold text-gray-700">{tripData.travel_group}</span>
            </p>
          </div>
        </div>

        {/* Budget */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
                <Wallet className="w-4 h-4" /> Budget & Comfort
              </span>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <h3 className="text-lg font-bold text-[#2D5016]">
              {formatCurrency(tripData.budget, tripData.currency)}
            </h3>
            <p className="text-xs text-gray-500 mt-1 capitalize">
              Tier: <span className="font-semibold text-gray-700">{tripData.budget_level}</span>
            </p>
          </div>
        </div>

        {/* Pace & Accommodation */}
        <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Style & Pace
              </span>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <p className="text-sm font-semibold text-[#1A1A2E] capitalize">
              {tripData.travel_pace} pace
            </p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              Lodging: {tripData.accommodation_style ? tripData.accommodation_style.replace(/_/g, ' ') : 'Standard'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Interests */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Selected Interests ({tripData.interests.length})
          </span>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tripData.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F0E4] text-[#2D5016] capitalize"
            >
              {interest.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Special Requirements */}
      {(tripData.dietary_restrictions.length > 0 ||
        tripData.accessibility_needs.length > 0 ||
        tripData.avoid_activities.length > 0 ||
        tripData.additional_notes) && (
        <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Preferences & Custom Notes
            </span>
            <button
              type="button"
              onClick={() => onEditStep(6)}
              className="text-xs font-semibold text-[#87A96B] hover:text-[#2D5016] flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <div className="space-y-2 text-xs text-gray-700">
            {tripData.dietary_restrictions.length > 0 && (
              <p>
                <strong className="text-[#1A1A2E]">Dietary:</strong> {tripData.dietary_restrictions.join(', ')}
              </p>
            )}
            {tripData.accessibility_needs.length > 0 && (
              <p>
                <strong className="text-[#1A1A2E]">Accessibility:</strong> {tripData.accessibility_needs.join(', ')}
              </p>
            )}
            {tripData.avoid_activities.length > 0 && (
              <p>
                <strong className="text-[#1A1A2E]">Avoid:</strong> {tripData.avoid_activities.join(', ')}
              </p>
            )}
            {tripData.additional_notes && (
              <p>
                <strong className="text-[#1A1A2E]">Notes:</strong> {tripData.additional_notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

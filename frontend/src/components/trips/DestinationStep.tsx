import React from 'react';
import { MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { Input } from '../common/Input';
import { calculateDays } from '../../utils/formatters';

export interface DestinationStepProps {
  destination: string;
  startDate: string;
  endDate: string;
  onChange: (fields: { destination?: string; start_date?: string; end_date?: string }) => void;
  errors?: Record<string, string>;
}

const QUICK_DESTINATIONS = [
  'Kyoto, Japan',
  'Barcelona, Spain',
  'Reykjavik, Iceland',
  'Florence, Italy',
  'Bali, Indonesia',
  'Cape Town, South Africa',
];

export const DestinationStep: React.FC<DestinationStepProps> = ({
  destination,
  startDate,
  endDate,
  onChange,
  errors = {},
}) => {
  const days = calculateDays(startDate, endDate);

  // Set minimum date for start_date to today
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          Where are you dreaming of going?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Pick any city, region, or multi-city route. WanderWise will customize daily logistics.
        </p>
      </div>

      {/* Destination Input */}
      <div className="space-y-3">
        <Input
          label="Destination City or Region"
          placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
          value={destination}
          onChange={(e) => onChange({ destination: e.target.value })}
          leftIcon={<MapPin className="w-5 h-5 text-[#2D5016]" />}
          error={errors.destination}
          required
        />

        {/* Quick Suggestion Chips */}
        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
            Trending Inspirations
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_DESTINATIONS.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onChange({ destination: city })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  destination === city
                    ? 'bg-[#2D5016] text-white shadow-xs'
                    : 'bg-white border border-[#87A96B]/30 text-gray-700 hover:bg-[#E8F0E4]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Range Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Input
          label="Departure Date"
          type="date"
          min={todayStr}
          value={startDate}
          onChange={(e) => onChange({ start_date: e.target.value })}
          leftIcon={<Calendar className="w-5 h-5 text-[#87A96B]" />}
          error={errors.start_date}
          required
        />

        <Input
          label="Return Date"
          type="date"
          min={startDate || todayStr}
          value={endDate}
          onChange={(e) => onChange({ end_date: e.target.value })}
          leftIcon={<Calendar className="w-5 h-5 text-[#87A96B]" />}
          error={errors.end_date}
          required
        />
      </div>

      {/* Duration Summary Callout */}
      {startDate && endDate && startDate <= endDate && (
        <div className="p-4 rounded-2xl bg-[#FFF8DC]/80 border border-[#87A96B]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2D5016] text-[#FFFFF0]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trip Length</p>
              <p className="text-base font-bold text-[#1A1A2E]">
                {days} {days === 1 ? 'Day' : 'Days'} ({Math.max(0, days - 1)} {days - 1 === 1 ? 'Night' : 'Nights'})
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-[#2D5016] bg-[#E8F0E4] px-3 py-1 rounded-full">
            Optimal for {days <= 3 ? 'Weekend getaway' : days <= 7 ? 'Full immersion' : 'Grand tour'}
          </span>
        </div>
      )}
    </div>
  );
};

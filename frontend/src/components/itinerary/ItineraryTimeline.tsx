import React, { useState } from 'react';
import { Calendar, Sparkles, Printer, Layers } from 'lucide-react';
import { Itinerary } from '../../types/itinerary';
import { DayCard } from './DayCard';
import { Button } from '../common/Button';

export interface ItineraryTimelineProps {
  itinerary: Itinerary;
  onRegenerateAll?: () => Promise<any>;
  onRegenerateDay?: (dayNumber: number) => Promise<any>;
  isGenerating?: boolean;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  itinerary,
  onRegenerateAll,
  onRegenerateDay,
  isGenerating = false,
}) => {
  const [selectedDayFilter, setSelectedDayFilter] = useState<number | 'all'>('all');
  const [regeneratingDayNumber, setRegeneratingDayNumber] = useState<number | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerateSingleDay = async (dayNumber: number) => {
    if (onRegenerateDay) {
      setRegeneratingDayNumber(dayNumber);
      try {
        await onRegenerateDay(dayNumber);
      } finally {
        setRegeneratingDayNumber(null);
      }
    }
  };

  const displayedDays =
    selectedDayFilter === 'all'
      ? itinerary.days
      : itinerary.days.filter((d) => d.day_number === selectedDayFilter);

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#E8F0E4] shadow-xs">
        {/* Day selection tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedDayFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              selectedDayFilter === 'all'
                ? 'bg-[#2D5016] text-[#FFFFF0] shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Days ({itinerary.days.length})
          </button>

          {itinerary.days.map((day) => (
            <button
              key={day.day_number}
              type="button"
              onClick={() => setSelectedDayFilter(day.day_number)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedDayFilter === day.day_number
                  ? 'bg-[#2D5016] text-[#FFFFF0] shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print / PDF
          </Button>

          {onRegenerateAll && (
            <Button
              variant="amber"
              size="sm"
              onClick={onRegenerateAll}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Regenerate All Days
            </Button>
          )}
        </div>
      </div>

      {/* Days Stack */}
      <div className="space-y-4">
        {displayedDays.map((day) => (
          <DayCard
            key={day.day_number}
            day={day}
            currency={itinerary.currency}
            onRegenerateDay={onRegenerateDay ? () => handleRegenerateSingleDay(day.day_number) : undefined}
            isRegenerating={regeneratingDayNumber === day.day_number}
          />
        ))}
      </div>
    </div>
  );
};

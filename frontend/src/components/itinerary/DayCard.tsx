import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Calendar, Wallet } from 'lucide-react';
import { ItineraryDay } from '../../types/itinerary';
import { ActivityCard } from './ActivityCard';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

export interface DayCardProps {
  day: ItineraryDay;
  currency: string;
  onRegenerateDay?: (dayNumber: number) => Promise<any>;
  isRegenerating?: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  currency,
  onRegenerateDay,
  isRegenerating = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRegenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegenerateDay) {
      await onRegenerateDay(day.day_number);
    }
  };

  return (
    <div className="bg-[#FFFFF0]/60 rounded-3xl border border-[#87A96B]/30 shadow-xs overflow-hidden transition-all duration-200">
      {/* Day Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/70 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#2D5016] text-[#FFFFF0] flex flex-col items-center justify-center font-bold shrink-0 shadow-xs">
            <span className="text-[10px] uppercase tracking-wider text-[#B2D8A3]">Day</span>
            <span className="text-lg leading-none">{day.day_number}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#87A96B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {day.date ? formatDate(day.date, 'EEEE, MMM d, yyyy') : `Day ${day.day_number}`}
              </span>
              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs font-semibold text-[#2D5016] bg-[#E8F0E4] px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wallet className="w-3 h-3 text-[#87A96B]" />
                Daily Est: {formatCurrency(day.daily_budget, currency)}
              </span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A2E] leading-snug">
              {day.summary}
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          {onRegenerateDay && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              isLoading={isRegenerating}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />}
            >
              Regenerate Day
            </Button>
          )}

          <button
            type="button"
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Expand day"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-4 border-t border-[#87A96B]/20">
          {day.notes && (
            <div className="p-3.5 rounded-2xl bg-[#FFF8DC] border border-[#87A96B]/20 text-xs text-gray-700">
              <span className="font-bold text-[#2D5016]">Daily Theme & Tips: </span>
              {day.notes}
            </div>
          )}

          {/* Activities list */}
          <div className="space-y-3">
            {day.activities.map((act, index) => (
              <ActivityCard key={act.id || index} activity={act} index={index} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

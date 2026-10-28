import React from 'react';
import {
  Clock,
  MapPin,
  DollarSign,
  GripVertical,
  Compass,
  Utensils,
  Camera,
  Trees,
  BedDouble,
  Landmark,
  Coffee,
} from 'lucide-react';
import { Activity } from '../../types/itinerary';
import { formatCurrency, formatDuration } from '../../utils/formatters';

export interface ActivityCardProps {
  activity: Activity;
  index: number;
}

const getCategoryIcon = (category: string) => {
  const lower = category.toLowerCase();
  if (lower.includes('din') || lower.includes('food') || lower.includes('culinary')) {
    return <Utensils className="w-4 h-4 text-[#E8735A]" />;
  }
  if (lower.includes('nature') || lower.includes('park') || lower.includes('beach')) {
    return <Trees className="w-4 h-4 text-[#4A7C23]" />;
  }
  if (lower.includes('hotel') || lower.includes('accommodat') || lower.includes('stay')) {
    return <BedDouble className="w-4 h-4 text-[#87A96B]" />;
  }
  if (lower.includes('museum') || lower.includes('culture') || lower.includes('historic')) {
    return <Landmark className="w-4 h-4 text-[#2D5016]" />;
  }
  if (lower.includes('photo') || lower.includes('sight')) {
    return <Camera className="w-4 h-4 text-[#D4A017]" />;
  }
  return <Compass className="w-4 h-4 text-[#2D5016]" />;
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index }) => {
  return (
    <div className="group relative bg-white rounded-2xl border border-[#E8F0E4] p-5 shadow-2xs hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3.5">
        {/* Drag handle & Order Badge */}
        <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
          <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors">
            <GripVertical className="w-4 h-4" />
          </div>
          <div className="w-7 h-7 rounded-xl bg-[#2D5016] text-[#FFFFF0] flex items-center justify-center text-xs font-bold shadow-xs">
            {activity.order || index + 1}
          </div>
        </div>

        {/* Core Activity Content */}
        <div className="flex-1 space-y-2">
          {/* Header with Title & Category badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <h4 className="text-base font-bold text-[#1A1A2E] leading-snug">
              {activity.name}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F0E4] text-[#2D5016]">
                {getCategoryIcon(activity.category)}
                <span>{activity.category}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {activity.description}
          </p>

          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-gray-500">
            {activity.start_time && (
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <Clock className="w-3.5 h-3.5 text-[#87A96B]" />
                {activity.start_time} ({formatDuration(activity.duration_minutes)})
              </span>
            )}

            {activity.location && (
              <span className="flex items-center gap-1 text-gray-600 max-w-xs truncate">
                <MapPin className="w-3.5 h-3.5 text-[#87A96B] shrink-0" />
                <span className="truncate">{activity.location}</span>
              </span>
            )}

            <span className="flex items-center gap-1 font-bold text-[#2D5016]">
              <DollarSign className="w-3.5 h-3.5 text-[#D4A017]" />
              {activity.estimated_cost === 0
                ? 'Free Landmark'
                : formatCurrency(activity.estimated_cost, activity.currency)}
            </span>
          </div>

          {/* Travel / Local Tips */}
          {activity.travel_notes && (
            <div className="mt-2 text-xs text-gray-600 bg-[#FFF8DC]/70 p-2.5 rounded-xl border border-[#87A96B]/20 flex items-start gap-2">
              <Coffee className="w-3.5 h-3.5 text-[#D4A017] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1A1A2E]">Insider tip:</strong> {activity.travel_notes}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, ArrowRight, Trash2, Clock, Sparkles } from 'lucide-react';
import { Trip } from '../../types/trip';
import { formatCurrency, formatTripDates, calculateDays } from '../../utils/formatters';

export interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onDelete }) => {
  const days = calculateDays(trip.start_date, trip.end_date);

  const statusBadges = {
    completed: { label: 'Ready', bg: 'bg-[#E8F0E4] text-[#2D5016] border-[#87A96B]/30' },
    generating: { label: 'Generating AI Plan...', bg: 'bg-amber-100 text-amber-800 border-amber-300' },
    draft: { label: 'Draft', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
    error: { label: 'Needs Review', bg: 'bg-red-100 text-[#E8735A] border-red-200' },
  };

  const currentBadge = statusBadges[trip.status] || statusBadges.completed;

  // Curated images for common destinations or fallback
  const getDestinationImage = (dest: string) => {
    const lower = dest.toLowerCase();
    if (lower.includes('kyoto') || lower.includes('japan')) {
      return 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=700&q=80';
    }
    if (lower.includes('barcelona') || lower.includes('spain')) {
      return 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=700&q=80';
    }
    if (lower.includes('reykjavik') || lower.includes('iceland')) {
      return 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80';
    }
    if (lower.includes('paris') || lower.includes('france')) {
      return 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=700&q=80';
    }
    if (lower.includes('rome') || lower.includes('italy')) {
      return 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=700&q=80';
    }
    return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-[#E8F0E4] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={getDestinationImage(trip.destination)}
          alt={trip.destination}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${currentBadge.bg}`}
          >
            {currentBadge.label}
          </span>
        </div>

        {/* Delete button */}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.confirm(`Delete the trip to ${trip.destination}?`)) {
                onDelete(trip.id);
              }
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-[#E8735A] transition-colors cursor-pointer backdrop-blur-xs"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Days count overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#F0C75E]" />
            {days} {days === 1 ? 'Day' : 'Days'} Itinerary
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#2D5016]/90 backdrop-blur-xs text-[#FFFFF0] uppercase tracking-wider">
            {trip.travel_group}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#1A1A2E] group-hover:text-[#2D5016] transition-colors line-clamp-1 mb-2">
            {trip.destination}
          </h3>

          <div className="space-y-2 text-xs text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#87A96B] shrink-0" />
              <span>{formatTripDates(trip.start_date, trip.end_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#87A96B] shrink-0" />
              <span>
                {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'} •{' '}
                <span className="capitalize">{trip.budget_level}</span> tier
              </span>
            </div>
          </div>

          {/* Interests preview pills */}
          {trip.interests && trip.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {trip.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FFF8DC] text-[#2D5016] border border-[#87A96B]/20 capitalize"
                >
                  {interest.replace(/_/g, ' ')}
                </span>
              ))}
              {trip.interests.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500">
                  +{trip.interests.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer & CTA */}
        <div className="pt-4 border-t border-[#E8F0E4] flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Budget</p>
            <p className="text-base font-bold text-[#2D5016]">
              {formatCurrency(trip.budget, trip.currency)}
            </p>
          </div>

          <Link
            to={`/trips/${trip.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5016] text-[#FFFFF0] text-xs font-semibold hover:bg-[#1F380F] transition-all group-hover:gap-2 shadow-xs"
          >
            <span>View Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

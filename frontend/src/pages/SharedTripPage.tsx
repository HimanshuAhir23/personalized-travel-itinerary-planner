import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  ArrowRight,
  Share2,
  Layers,
  Map as MapIcon,
} from 'lucide-react';
import { itineraryService } from '../services/itineraryService';
import { Itinerary } from '../types/itinerary';
import { Trip } from '../types/trip';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { DayCard } from '../components/itinerary/DayCard';
import { ItineraryMap } from '../components/itinerary/ItineraryMap';
import { formatCurrency, formatTripDates, calculateDays } from '../utils/formatters';

export const SharedTripPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'map'>('timeline');

  useEffect(() => {
    if (!id) return;

    const loadSharedData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await itineraryService.getSharedItinerary(id);
        setTrip(data.trip);
        setItinerary(data.itinerary);
      } catch (err: any) {
        setError(err.message || 'Unable to view this shared trip.');
      } finally {
        setIsLoading(false);
      }
    };

    loadSharedData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" message="Loading shared travel itinerary..." />
      </div>
    );
  }

  if (error || !trip || !itinerary) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <ErrorMessage
          title="Shared Itinerary Unavailable"
          message={error || 'This itinerary link may have expired or is set to private.'}
        />
        <div className="mt-6 text-center">
          <Link to="/">
            <Button variant="primary">Visit WanderWise Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysCount = calculateDays(trip.start_date, trip.end_date);
  const allActivities = itinerary.days.flatMap((d) => d.activities);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Shared Itinerary Header Banner */}
      <div className="bg-[#2D5016] text-[#FFFFF0] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-[#F0C75E]">
            <Share2 className="w-3.5 h-3.5" />
            <span>Shared Travel Blueprint</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
            {trip.destination}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#B2D8A3]" />
              {formatTripDates(trip.start_date, trip.end_date)} ({daysCount} Days)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#B2D8A3]" />
              {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#F0C75E] font-bold">
              <Wallet className="w-4 h-4" />
              Budget: {formatCurrency(trip.budget, trip.currency)}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <Link to="/trips/new">
            <Button
              variant="amber"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-md"
            >
              Plan Your Own Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-[#87A96B]/25">
        <button
          type="button"
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'timeline'
              ? 'border-[#2D5016] text-[#2D5016]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Day-by-Day Schedule</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'map'
              ? 'border-[#2D5016] text-[#2D5016]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Interactive Map</span>
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'timeline' ? (
          <div className="space-y-4">
            {itinerary.days.map((day) => (
              <DayCard
                key={day.day_number}
                day={day}
                currency={itinerary.currency}
              />
            ))}
          </div>
        ) : (
          <ItineraryMap activities={allActivities} destinationName={trip.destination} />
        )}
      </div>
    </div>
  );
};

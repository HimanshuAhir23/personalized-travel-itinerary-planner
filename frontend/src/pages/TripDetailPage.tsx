import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Wallet,
  Share2,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  PieChart,
  Map as MapIcon,
  Layers,
  Printer,
} from 'lucide-react';
import { useTrip } from '../hooks/useTrips';
import { useItinerary } from '../hooks/useItinerary';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { ItineraryTimeline } from '../components/itinerary/ItineraryTimeline';
import { BudgetSummary } from '../components/itinerary/BudgetSummary';
import { ItineraryMap } from '../components/itinerary/ItineraryMap';
import { ShareDialog } from '../components/itinerary/ShareDialog';
import { formatCurrency, formatTripDates, calculateDays } from '../utils/formatters';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { trip, isLoading: isTripLoading, isError: isTripError, error: tripError, refetch: refetchTrip } = useTrip(id);
  const {
    itinerary,
    isLoading: isItineraryLoading,
    isError: isItineraryError,
    error: itineraryError,
    generateItinerary,
    isGenerating,
    regenerateDay,
  } = useItinerary(id);

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'map'>('itinerary');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  if (isTripLoading || isItineraryLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner
          size="lg"
          message="Synthesizing your personalized day-by-day itinerary and local coordinates..."
        />
      </div>
    );
  }

  if (isTripError || !trip) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <ErrorMessage
          title="Trip Not Found"
          message={
            (tripError as any)?.message ||
            'We could not load details for this journey. It may have been removed or never created.'
          }
          onRetry={() => refetchTrip()}
        />
        <div className="mt-4 text-center">
          <Link to="/dashboard">
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysCount = calculateDays(trip.start_date, trip.end_date);
  const allActivities = itinerary ? itinerary.days.flatMap((d) => d.activities) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Share Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#2D5016] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 className="w-4 h-4 text-[#2D5016]" />}
          >
            Share Itinerary
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8F0E4] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FFFFF0] bg-[#2D5016] px-3 py-0.5 rounded-full">
                {trip.travel_group} Trip
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4A017] bg-[#FFF8DC] border border-[#D4A017]/30 px-3 py-0.5 rounded-full">
                {trip.budget_level} Tier
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
              {trip.destination}
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#87A96B]" />
                {formatTripDates(trip.start_date, trip.end_date)} ({daysCount} Days)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#87A96B]" />
                {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-[#2D5016]">
                <Wallet className="w-4 h-4 text-[#87A96B]" />
                Target Budget: {formatCurrency(trip.budget, trip.currency)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="amber"
              onClick={() => generateItinerary()}
              isLoading={isGenerating}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shadow-sm"
            >
              Re-Craft Itinerary
            </Button>
          </div>
        </div>

        {/* Interests & Style Quick Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
            Focus:
          </span>
          {trip.interests.map((int) => (
            <span
              key={int}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F0E4] text-[#2D5016] capitalize"
            >
              {int.replace(/_/g, ' ')}
            </span>
          ))}
          {trip.travel_pace && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 capitalize">
              {trip.travel_pace} Pace
            </span>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#87A96B]/25">
        <button
          type="button"
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'border-[#2D5016] text-[#2D5016]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Timeline Itinerary</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'budget'
              ? 'border-[#2D5016] text-[#2D5016]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Budget & Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'border-[#2D5016] text-[#2D5016]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>Map & Route</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'itinerary' && itinerary && (
          <ItineraryTimeline
            itinerary={itinerary}
            onRegenerateAll={() => generateItinerary()}
            onRegenerateDay={(dayNumber) => regenerateDay(dayNumber)}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'budget' && itinerary && (
          <BudgetSummary itinerary={itinerary} trip={trip} />
        )}

        {activeTab === 'map' && (
          <ItineraryMap activities={allActivities} destinationName={trip.destination} />
        )}
      </div>

      {/* Share Dialog Modal */}
      <ShareDialog
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripId={trip.id}
        destination={trip.destination}
      />
    </div>
  );
};

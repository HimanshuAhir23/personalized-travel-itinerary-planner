import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RecentTrips } from '../components/dashboard/RecentTrips';
import { Button } from '../components/common/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { trips, stats, isLoading, deleteTrip } = useTrips();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-[#E8F0E4]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#87A96B] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
              Explorer Headquarters
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
            Welcome back, {user?.display_name || 'Traveler'}
          </h1>
          <p className="text-sm text-gray-500">
            Track your upcoming adventures, manage daily itineraries, and plan your next escape.
          </p>
        </div>

        <Link to="/trips/new">
          <Button
            variant="primary"
            size="lg"
            leftIcon={<PlusCircle className="w-5 h-5 text-[#F0C75E]" />}
            className="shadow-md"
          >
            Create New Trip
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} isLoading={isLoading} />

      {/* Trips Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#1A1A2E]">
            My Planned Journeys
          </h2>
          <span className="text-xs font-semibold text-gray-500">
            {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Recorded
          </span>
        </div>

        <RecentTrips
          trips={trips}
          isLoading={isLoading}
          onDeleteTrip={(id) => deleteTrip(id)}
        />
      </div>
    </div>
  );
};

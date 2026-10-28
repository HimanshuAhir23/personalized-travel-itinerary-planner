import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, Compass } from 'lucide-react';
import { Trip } from '../../types/trip';
import { TripCard } from './TripCard';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export interface RecentTripsProps {
  trips: Trip[];
  isLoading?: boolean;
  onDeleteTrip?: (id: string) => void;
}

export const RecentTrips: React.FC<RecentTripsProps> = ({ trips, isLoading, onDeleteTrip }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter((t) =>
    t.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by destination or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#87A96B]/25 focus:border-[#87A96B]"
          />
        </div>

        <Link to="/trips/new">
          <Button variant="primary" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Trips Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-white/60 animate-pulse border border-gray-100 p-6 flex flex-col justify-between">
              <div className="h-44 bg-gray-200 rounded-2xl w-full" />
              <div className="space-y-3 mt-4">
                <div className="h-5 bg-gray-200 rounded-md w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-1/2" />
              </div>
              <div className="h-10 bg-gray-200 rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        searchTerm ? (
          <EmptyState
            title="No matching destinations found"
            description={`We couldn't find any trips matching "${searchTerm}". Try clearing your filter.`}
            actionText="Clear Search"
            onAction={() => setSearchTerm('')}
          />
        ) : (
          <EmptyState
            icon={<Compass className="w-8 h-8 text-[#2D5016]" />}
            title="Start your first AI journey"
            description="You haven't generated any travel itineraries yet. Tell WanderWise where you'd like to explore and let our AI craft your day-by-day itinerary."
            actionText="Create My First Itinerary"
            onAction={() => (window.location.href = '/trips/new')}
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onDelete={onDeleteTrip} />
          ))}
        </div>
      )}
    </div>
  );
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripService } from '../services/tripService';
import { Trip, TripCreate } from '../types/trip';

export const TRIPS_QUERY_KEY = ['trips'];
export const TRIP_DETAIL_KEY = (id: string) => ['trip', id];
export const STATS_QUERY_KEY = ['trips', 'stats'];

export const useTrips = () => {
  const queryClient = useQueryClient();

  const tripsQuery = useQuery({
    queryKey: TRIPS_QUERY_KEY,
    queryFn: tripService.getTrips,
    staleTime: 1000 * 60 * 5, // 5 mins
  });

  const statsQuery = useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: tripService.getStats,
    staleTime: 1000 * 60 * 5,
  });

  const createTripMutation = useMutation({
    mutationFn: (data: TripCreate) => tripService.createTrip(data),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
  });

  const deleteTripMutation = useMutation({
    mutationFn: (id: string) => tripService.deleteTrip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
  });

  return {
    trips: tripsQuery.data ?? [],
    stats: statsQuery.data,
    isLoading: tripsQuery.isLoading || statsQuery.isLoading,
    isError: tripsQuery.isError,
    error: tripsQuery.error,
    refetch: tripsQuery.refetch,
    createTrip: createTripMutation.mutateAsync,
    isCreating: createTripMutation.isPending,
    deleteTrip: deleteTripMutation.mutateAsync,
    isDeleting: deleteTripMutation.isPending,
  };
};

export const useTrip = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: TRIP_DETAIL_KEY(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Trip ID is required');
      return tripService.getTripById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<TripCreate>) => {
      if (!id) throw new Error('Trip ID is required');
      return tripService.updateTrip(id, updates);
    },
    onSuccess: (updatedTrip) => {
      queryClient.setQueryData(TRIP_DETAIL_KEY(id!), updatedTrip);
      queryClient.invalidateQueries({ queryKey: TRIPS_QUERY_KEY });
    },
  });

  return {
    trip: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    updateTrip: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

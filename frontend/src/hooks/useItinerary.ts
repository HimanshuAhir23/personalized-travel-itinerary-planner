import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itineraryService } from '../services/itineraryService';
import { Activity, Itinerary } from '../types/itinerary';

export const ITINERARY_QUERY_KEY = (tripId: string) => ['itinerary', tripId];

export const useItinerary = (tripId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ITINERARY_QUERY_KEY(tripId || ''),
    queryFn: () => {
      if (!tripId) throw new Error('Trip ID is required');
      return itineraryService.getItinerary(tripId);
    },
    enabled: !!tripId,
    staleTime: 1000 * 60 * 10,
  });

  const generateMutation = useMutation({
    mutationFn: () => {
      if (!tripId) throw new Error('Trip ID is required');
      return itineraryService.generateItinerary(tripId);
    },
    onSuccess: (data: Itinerary) => {
      queryClient.setQueryData(ITINERARY_QUERY_KEY(tripId!), data);
    },
  });

  const regenerateDayMutation = useMutation({
    mutationFn: (dayNumber: number) => {
      if (!tripId) throw new Error('Trip ID is required');
      return itineraryService.regenerateDay(tripId, dayNumber);
    },
    onSuccess: (newDay) => {
      queryClient.setQueryData<Itinerary>(ITINERARY_QUERY_KEY(tripId!), (old) => {
        if (!old) return old;
        return {
          ...old,
          days: old.days.map((d) => (d.day_number === newDay.day_number ? newDay : d)),
        };
      });
    },
  });

  const reorderActivitiesMutation = useMutation({
    mutationFn: ({ dayNumber, activities }: { dayNumber: number; activities: Activity[] }) => {
      if (!tripId) throw new Error('Trip ID is required');
      return itineraryService.updateActivityOrder(tripId, dayNumber, activities);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(ITINERARY_QUERY_KEY(tripId!), updated);
    },
  });

  return {
    itinerary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    generateItinerary: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    regenerateDay: regenerateDayMutation.mutateAsync,
    isRegeneratingDay: regenerateDayMutation.isPending,
    reorderActivities: reorderActivitiesMutation.mutateAsync,
    isReordering: reorderActivitiesMutation.isPending,
  };
};

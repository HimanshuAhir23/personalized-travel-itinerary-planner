import React from 'react';
import { Compass, Calendar, Globe2, Wallet } from 'lucide-react';
import { TripStats } from '../../types/trip';
import { formatCurrency } from '../../utils/formatters';

export interface DashboardStatsProps {
  stats?: TripStats;
  isLoading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, isLoading }) => {
  const statItems = [
    {
      label: 'Total Trips Planned',
      value: stats ? stats.total_trips : 0,
      icon: <Compass className="w-5 h-5 text-[#2D5016]" />,
      bg: 'bg-[#E8F0E4]',
      badge: 'Active Itineraries',
    },
    {
      label: 'Upcoming Adventures',
      value: stats ? stats.upcoming_trips : 0,
      icon: <Calendar className="w-5 h-5 text-[#4A7C23]" />,
      bg: 'bg-emerald-50',
      badge: 'Departing Soon',
    },
    {
      label: 'Countries Explored',
      value: stats ? stats.countries_visited : 0,
      icon: <Globe2 className="w-5 h-5 text-[#D4A017]" />,
      bg: 'bg-amber-50',
      badge: 'Passport Stamps',
    },
    {
      label: 'Trip Budgets Managed',
      value: stats ? formatCurrency(stats.total_budget_spent, 'USD') : '$0',
      icon: <Wallet className="w-5 h-5 text-[#87A96B]" />,
      bg: 'bg-[#FFF8DC]',
      badge: 'AI Optimized',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-[#E8F0E4] shadow-xs flex items-center justify-between transition-all duration-200 hover:shadow-md"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {item.label}
            </span>
            <div className="text-2xl font-bold text-[#1A1A2E]">
              {isLoading ? (
                <div className="h-7 w-16 bg-gray-200 animate-pulse rounded-md" />
              ) : (
                item.value
              )}
            </div>
            <span className="inline-block text-[11px] font-medium text-[#4A7C23] bg-[#E8F0E4] px-2 py-0.5 rounded-md">
              {item.badge}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

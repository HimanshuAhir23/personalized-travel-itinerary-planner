import React from 'react';
import { Wallet, PieChart, TrendingDown, CheckCircle2, AlertCircle } from 'lucide-react';
import { Itinerary } from '../../types/itinerary';
import { Trip } from '../../types/trip';
import { formatCurrency } from '../../utils/formatters';

export interface BudgetSummaryProps {
  itinerary: Itinerary;
  trip?: Trip;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ itinerary, trip }) => {
  const currency = itinerary.currency || trip?.currency || 'USD';
  const targetBudget = trip?.budget || itinerary.total_estimated_cost;
  const estimatedTotal = itinerary.total_estimated_cost;
  const variance = targetBudget - estimatedTotal;
  const isUnderBudget = variance >= 0;

  // Calculate activity category breakdown
  let activityCost = 0;
  let diningCost = 0;
  let accommodationCost = Math.round(targetBudget * 0.42); // Estimated 42% for lodging
  let transportCost = Math.round(targetBudget * 0.15); // Estimated 15% for transit

  itinerary.days.forEach((day) => {
    day.activities.forEach((act) => {
      const lower = act.category.toLowerCase();
      if (lower.includes('din') || lower.includes('food') || lower.includes('culinary')) {
        diningCost += act.estimated_cost;
      } else {
        activityCost += act.estimated_cost;
      }
    });
  });

  const categories = [
    { label: 'Lodging & Stays', amount: accommodationCost, color: 'bg-[#2D5016]', pct: 42 },
    { label: 'Activities & Attractions', amount: activityCost || Math.round(targetBudget * 0.23), color: 'bg-[#87A96B]', pct: 23 },
    { label: 'Dining & Tastings', amount: diningCost || Math.round(targetBudget * 0.2), color: 'bg-[#D4A017]', pct: 20 },
    { label: 'Transit & Miscellaneous', amount: transportCost, color: 'bg-[#E8735A]', pct: 15 },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E8F0E4] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] flex items-center gap-1.5">
            <PieChart className="w-4 h-4" /> Financial Allocation
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A2E] mt-1">
            Budget Overview & Analytics
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Estimated Itinerary Total</p>
            <p className="text-xl font-bold text-[#2D5016]">
              {formatCurrency(estimatedTotal, currency)}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0E4] flex items-center justify-center text-[#2D5016]">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Variance Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isUnderBudget
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3">
          {isUnderBudget ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <p className="text-sm font-bold">
              {isUnderBudget
                ? `Under Budget by ${formatCurrency(Math.abs(variance), currency)}`
                : `Target Exceeded by ${formatCurrency(Math.abs(variance), currency)}`}
            </p>
            <p className="text-xs opacity-80">
              {isUnderBudget
                ? 'Your planned daily activities fit comfortably inside your specified budget.'
                : 'Consider adjusting lodging tier or choosing free walking alternatives.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/80 shadow-2xs">
          Target: {formatCurrency(targetBudget, currency)}
        </span>
      </div>

      {/* Progress Distribution Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-gray-500">
          <span>Expense Distribution</span>
          <span>100% Calculated</span>
        </div>
        <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
          {categories.map((c, i) => (
            <div
              key={i}
              className={`${c.color} h-full transition-all duration-500`}
              style={{ width: `${c.pct}%` }}
              title={`${c.label}: ${c.pct}%`}
            />
          ))}
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {categories.map((c, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#FFFFF0] border border-[#87A96B]/20 space-y-1">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
              <span className="text-xs font-medium text-gray-600 truncate">{c.label}</span>
            </div>
            <p className="text-lg font-bold text-[#1A1A2E]">
              {formatCurrency(c.amount, currency)}
            </p>
            <p className="text-[11px] text-gray-500 font-semibold">{c.pct}% of budget</p>
          </div>
        ))}
      </div>
    </div>
  );
};

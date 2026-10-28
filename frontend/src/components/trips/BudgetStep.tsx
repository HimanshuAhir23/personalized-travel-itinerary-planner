import React from 'react';
import { PiggyBank, Wallet, Sparkles, Crown, Check } from 'lucide-react';
import { BudgetLevel } from '../../types/trip';
import { BUDGET_LEVELS, CURRENCIES } from '../../utils/constants';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { formatCurrency } from '../../utils/formatters';

const TIER_ICONS: Record<string, React.ReactNode> = {
  PiggyBank: <PiggyBank className="w-5 h-5" />,
  Wallet: <Wallet className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
};

export interface BudgetStepProps {
  budget: number;
  currency: string;
  budgetLevel: BudgetLevel;
  travelers: number;
  daysCount?: number;
  onChange: (fields: { budget?: number; currency?: string; budget_level?: BudgetLevel }) => void;
  errors?: Record<string, string>;
}

export const BudgetStep: React.FC<BudgetStepProps> = ({
  budget,
  currency,
  budgetLevel,
  travelers,
  daysCount = 4,
  onChange,
  errors = {},
}) => {
  const perPerson = travelers > 0 && budget > 0 ? Math.round(budget / travelers) : 0;
  const perDay = daysCount > 0 && budget > 0 ? Math.round(budget / daysCount) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          What is your total target budget?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          WanderWise calculates realistic activity fees, tickets, dining, and daily leisure based on this budget.
        </p>
      </div>

      {/* Budget & Currency Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Total Estimated Budget"
            type="number"
            min="100"
            step="50"
            placeholder="e.g. 3500"
            value={budget || ''}
            onChange={(e) => onChange({ budget: Number(e.target.value) })}
            error={errors.budget}
            required
          />
        </div>

        <div>
          <Select
            label="Currency"
            value={currency}
            onChange={(e) => onChange({ currency: e.target.value })}
            options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
            error={errors.currency}
            required
          />
        </div>
      </div>

      {/* Real-time Breakdown Pills */}
      {budget > 0 && (
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FFF8DC]/70 border border-[#87A96B]/20">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Per Person</p>
            <p className="text-lg font-bold text-[#2D5016]">
              {formatCurrency(perPerson, currency)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Daily Allocation</p>
            <p className="text-lg font-bold text-[#2D5016]">
              ~{formatCurrency(perDay, currency)} / day
            </p>
          </div>
        </div>
      )}

      {/* Budget Level Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Comfort Tier / Spending Style <span className="text-[#E8735A]">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BUDGET_LEVELS.map((tier) => {
            const isSelected = budgetLevel === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onChange({ budget_level: tier.id as BudgetLevel })}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2D5016] bg-[#E8F0E4]/70 ring-2 ring-[#2D5016]/20 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-[#87A96B]/50 hover:bg-[#FFFFF0]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-[#2D5016] text-[#FFFFF0]' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {TIER_ICONS[tier.icon] || <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#1A1A2E]">{tier.label}</h4>
                      <span className="text-[11px] font-semibold text-[#D4A017] uppercase tracking-wider">
                        {tier.range}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#2D5016] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
              </button>
            );
          })}
        </div>

        {errors.budget_level && (
          <p className="text-xs text-[#E8735A] font-medium">{errors.budget_level}</p>
        )}
      </div>
    </div>
  );
};

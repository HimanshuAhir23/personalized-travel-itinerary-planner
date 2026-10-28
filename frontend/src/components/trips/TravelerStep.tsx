import React from 'react';
import { Compass, Heart, Users, Smile, Briefcase, Plus, Minus, Check } from 'lucide-react';
import { TravelGroup } from '../../types/trip';
import { TRAVEL_GROUPS } from '../../utils/constants';

const GROUP_ICON_MAP: Record<string, React.ReactNode> = {
  Compass: <Compass className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Smile: <Smile className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
};

export interface TravelerStepProps {
  travelers: number;
  travelGroup: TravelGroup;
  onChange: (fields: { travelers?: number; travel_group?: TravelGroup }) => void;
  errors?: Record<string, string>;
}

export const TravelerStep: React.FC<TravelerStepProps> = ({
  travelers,
  travelGroup,
  onChange,
  errors = {},
}) => {
  const handleGroupSelect = (group: TravelGroup, defaultCount: number) => {
    onChange({
      travel_group: group,
      travelers: travelers === 1 && group !== 'solo' ? defaultCount : travelers,
    });
  };

  const handleIncrement = () => {
    if (travelers < 50) onChange({ travelers: travelers + 1 });
  };

  const handleDecrement = () => {
    if (travelers > 1) onChange({ travelers: travelers - 1 });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          Who is traveling with you?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Travel dynamics shape our dining choices, accommodation types, and daily schedules.
        </p>
      </div>

      {/* Traveler Count Stepper */}
      <div className="p-5 rounded-2xl bg-white border border-[#E8F0E4] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-base text-[#1A1A2E]">Total Travelers</h4>
          <p className="text-xs text-gray-500">Including adults and children</p>
          {errors.travelers && <p className="text-xs text-[#E8735A] mt-1 font-medium">{errors.travelers}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={travelers <= 1}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-[#E8F0E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Decrease travelers"
          >
            <Minus className="w-4 h-4" />
          </button>

          <span className="w-12 text-center text-xl font-bold text-[#2D5016]">
            {travelers}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            disabled={travelers >= 50}
            className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-[#E8F0E4] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Increase travelers"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Travel Group Type Grid */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Travel Group Dynamic <span className="text-[#E8735A]">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRAVEL_GROUPS.map((group) => {
            const isSelected = travelGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleGroupSelect(group.id as TravelGroup, group.defaultTravelers)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2D5016] bg-[#E8F0E4]/70 ring-2 ring-[#2D5016]/20 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-[#87A96B]/50 hover:bg-[#FFFFF0]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSelected ? 'bg-[#2D5016] text-[#FFFFF0]' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {GROUP_ICON_MAP[group.icon] || <Users className="w-5 h-5" />}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#2D5016] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#1A1A2E]">{group.label}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{group.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {errors.travel_group && (
          <p className="text-xs text-[#E8735A] font-medium">{errors.travel_group}</p>
        )}
      </div>
    </div>
  );
};

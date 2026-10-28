import React, { useState } from 'react';
import { Plus, X, Check, HeartHandshake } from 'lucide-react';
import { DIETARY_OPTIONS, ACCESSIBILITY_OPTIONS } from '../../utils/constants';

export interface RequirementsStepProps {
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  avoidActivities: string[];
  additionalNotes: string;
  onChange: (fields: {
    dietary_restrictions?: string[];
    accessibility_needs?: string[];
    avoid_activities?: string[];
    additional_notes?: string;
  }) => void;
}

export const RequirementsStep: React.FC<RequirementsStepProps> = ({
  dietaryRestrictions,
  accessibilityNeeds,
  avoidActivities,
  additionalNotes,
  onChange,
}) => {
  const [avoidInput, setAvoidInput] = useState('');

  const toggleDietary = (item: string) => {
    if (dietaryRestrictions.includes(item)) {
      onChange({ dietary_restrictions: dietaryRestrictions.filter((d) => d !== item) });
    } else {
      onChange({ dietary_restrictions: [...dietaryRestrictions, item] });
    }
  };

  const toggleAccessibility = (item: string) => {
    if (accessibilityNeeds.includes(item)) {
      onChange({ accessibility_needs: accessibilityNeeds.filter((a) => a !== item) });
    } else {
      onChange({ accessibility_needs: [...accessibilityNeeds, item] });
    }
  };

  const addAvoid = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (avoidInput.trim()) {
      if (!avoidActivities.includes(avoidInput.trim())) {
        onChange({ avoid_activities: [...avoidActivities, avoidInput.trim()] });
      }
      setAvoidInput('');
    }
  };

  const removeAvoid = (item: string) => {
    onChange({ avoid_activities: avoidActivities.filter((a) => a !== item) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          Special Requirements & Preferences
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about dietary needs, accessibility preferences, or things you prefer to skip.
        </p>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Dietary Restrictions & Allergies
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((item) => {
            const isSelected = dietaryRestrictions.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleDietary(item)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2D5016] text-[#FFFFF0] border-[#2D5016]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-[#E8F0E4]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibility Needs */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Accessibility Considerations
        </label>
        <div className="flex flex-wrap gap-2">
          {ACCESSIBILITY_OPTIONS.map((item) => {
            const isSelected = accessibilityNeeds.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleAccessibility(item)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#2D5016] text-[#FFFFF0] border-[#2D5016]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-[#E8F0E4]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{item}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Things to Avoid */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Activities or Environments to Avoid
        </label>
        <p className="text-xs text-gray-500">
          e.g. Crowded tour buses, strenuous stairs, loud nightclubs, rollercoasters
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type something to avoid and press Add..."
            value={avoidInput}
            onChange={(e) => setAvoidInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAvoid(e);
              }
            }}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#87A96B]/25 focus:border-[#87A96B]"
          />
          <button
            type="button"
            onClick={addAvoid}
            className="px-4 py-2.5 rounded-xl bg-[#87A96B] text-white hover:bg-[#729257] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        {avoidActivities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {avoidActivities.map((act) => (
              <span
                key={act}
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-[#E8735A] border border-red-200 flex items-center gap-1.5"
              >
                <span>{act}</span>
                <button
                  type="button"
                  onClick={() => removeAvoid(act)}
                  className="hover:text-red-800 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#87A96B]" />
          Additional Notes or Special Occasion
        </label>
        <textarea
          rows={3}
          placeholder="Is this a honeymoon, anniversary, birthday trip, or do you have any must-visit cafes or bucket list sights?"
          value={additionalNotes}
          onChange={(e) => onChange({ additional_notes: e.target.value })}
          className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#87A96B]/25 focus:border-[#87A96B]"
        />
      </div>
    </div>
  );
};

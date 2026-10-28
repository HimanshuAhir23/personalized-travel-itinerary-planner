import React from 'react';
import { InterestSelector } from '../forms/InterestSelector';

export interface InterestsStepProps {
  interests: string[];
  onChange: (interests: string[]) => void;
  errors?: Record<string, string>;
}

export const InterestsStep: React.FC<InterestsStepProps> = ({
  interests,
  onChange,
  errors = {},
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          What makes your perfect journey?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select all interests that match your travel personality. Our AI will intertwine these throughout your daily routes.
        </p>
      </div>

      <InterestSelector
        selectedInterests={interests}
        onChange={onChange}
        error={errors.interests}
      />
    </div>
  );
};

import React from 'react';
import { Check, MapPin, Users, Wallet, Compass, Sparkles, ShieldAlert, FileText } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const STEP_LABELS = [
  { step: 1, label: 'Destination', icon: MapPin },
  { step: 2, label: 'Travelers', icon: Users },
  { step: 3, label: 'Budget', icon: Wallet },
  { step: 4, label: 'Interests', icon: Compass },
  { step: 5, label: 'Pace & Style', icon: Sparkles },
  { step: 6, label: 'Preferences', icon: ShieldAlert },
  { step: 7, label: 'Review', icon: FileText },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      {/* Progress Bar Header */}
      <div className="flex items-center justify-between mb-2 text-xs font-semibold text-gray-500">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="text-[#2D5016] font-bold">
          {Math.round((currentStep / totalSteps) * 100)}% Completed
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-[#2D5016] via-[#87A96B] to-[#D4A017] transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step nodes for desktop */}
      <div className="hidden lg:grid grid-cols-7 gap-2">
        {STEP_LABELS.map((item) => {
          const isCurrent = item.step === currentStep;
          const isDone = item.step < currentStep;
          const IconComponent = item.icon;

          return (
            <button
              key={item.step}
              type="button"
              disabled={!isDone && !isCurrent}
              onClick={() => isDone && onStepClick && onStepClick(item.step)}
              className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                isCurrent
                  ? 'bg-[#2D5016] text-[#FFFFF0] shadow-sm'
                  : isDone
                  ? 'bg-[#E8F0E4] text-[#2D5016] hover:bg-[#d8e7d2] cursor-pointer'
                  : 'text-gray-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-[#87A96B] text-white'
                    : isDone
                    ? 'bg-[#2D5016] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <IconComponent className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="text-xs font-semibold truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Coffee, Compass, Zap, Check } from 'lucide-react';
import { TravelPace } from '../../types/trip';
import { TRAVEL_PACES, ACCOMMODATION_STYLES, TRANSPORT_MODES } from '../../utils/constants';

const PACE_ICONS: Record<string, React.ReactNode> = {
  Coffee: <Coffee className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
};

export interface StyleStepProps {
  travelPace: TravelPace;
  accommodationStyle: string;
  transportation: string[];
  onChange: (fields: {
    travel_pace?: TravelPace;
    accommodation_style?: string;
    transportation?: string[];
  }) => void;
  errors?: Record<string, string>;
}

export const StyleStep: React.FC<StyleStepProps> = ({
  travelPace,
  accommodationStyle,
  transportation,
  onChange,
  errors = {},
}) => {
  const toggleTransport = (id: string) => {
    if (transportation.includes(id)) {
      onChange({ transportation: transportation.filter((t) => t !== id) });
    } else {
      onChange({ transportation: [...transportation, id] });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A2E]">
          How do you like to explore?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us about your daily rhythm and how you prefer to move around.
        </p>
      </div>

      {/* Travel Pace */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Daily Travel Pace <span className="text-[#E8735A]">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TRAVEL_PACES.map((pace) => {
            const isSelected = travelPace === pace.id;
            return (
              <button
                key={pace.id}
                type="button"
                onClick={() => onChange({ travel_pace: pace.id as TravelPace })}
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
                    {PACE_ICONS[pace.icon] || <Compass className="w-5 h-5" />}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#2D5016] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#1A1A2E]">{pace.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{pace.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.travel_pace && <p className="text-xs text-[#E8735A] font-medium">{errors.travel_pace}</p>}
      </div>

      {/* Accommodation Style */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Preferred Lodging Style <span className="text-[#E8735A]">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACCOMMODATION_STYLES.map((style) => {
            const isSelected = accommodationStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => onChange({ accommodation_style: style.id })}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#2D5016] bg-[#E8F0E4]/70 ring-2 ring-[#2D5016]/20 shadow-xs'
                    : 'border-gray-200 bg-white hover:border-[#87A96B]/50 hover:bg-[#FFFFF0]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-bold text-[#1A1A2E]">{style.label}</h4>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#2D5016] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{style.desc}</p>
              </button>
            );
          })}
        </div>
        {errors.accommodation_style && (
          <p className="text-xs text-[#E8735A] font-medium">{errors.accommodation_style}</p>
        )}
      </div>

      {/* Transportation Preferences */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#1A1A2E]">
          Preferred Transportation Modes
        </label>

        <div className="flex flex-wrap gap-2.5">
          {TRANSPORT_MODES.map((mode) => {
            const isSelected = transportation.includes(mode.id);
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => toggleTransport(mode.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#2D5016] text-[#FFFFF0] border-[#2D5016] shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

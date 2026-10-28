import React from 'react';
import {
  Palette,
  Utensils,
  Trees,
  Sun,
  Landmark,
  Moon,
  ShoppingBag,
  Mountain,
  Flower2,
  Camera,
  MapPin,
  Music,
  Check,
} from 'lucide-react';
import { INTEREST_OPTIONS } from '../../utils/constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-5 h-5" />,
  Utensils: <Utensils className="w-5 h-5" />,
  Trees: <Trees className="w-5 h-5" />,
  Sun: <Sun className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
  Moon: <Moon className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Mountain: <Mountain className="w-5 h-5" />,
  Flower2: <Flower2 className="w-5 h-5" />,
  Camera: <Camera className="w-5 h-5" />,
  MapPin: <MapPin className="w-5 h-5" />,
  Music: <Music className="w-5 h-5" />,
};

export interface InterestSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  error?: string;
}

export const InterestSelector: React.FC<InterestSelectorProps> = ({
  selectedInterests,
  onChange,
  error,
}) => {
  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onChange(selectedInterests.filter((item) => item !== id));
    } else {
      onChange([...selectedInterests, id]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1A2E]">
          What excites you most? ({selectedInterests.length} selected)
        </span>
        <span className="text-xs text-gray-500">Select at least 1 category</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {INTEREST_OPTIONS.map((item) => {
          const isSelected = selectedInterests.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-[#2D5016] bg-[#E8F0E4]/70 ring-2 ring-[#2D5016]/20 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-[#87A96B]/50 hover:bg-[#FFFFF0]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isSelected ? 'bg-[#2D5016] text-[#FFFFF0]' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {ICON_MAP[item.icon] || <MapPin className="w-5 h-5" />}
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#2D5016] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#1A1A2E] leading-snug">{item.label}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-[#E8735A] font-medium mt-1">{error}</p>}
    </div>
  );
};

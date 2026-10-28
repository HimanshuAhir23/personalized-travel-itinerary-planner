import React from 'react';
import { Compass } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 space-y-3 ${className}`}>
      <div className="relative">
        <Compass className={`${sizeClasses[size]} text-[#2D5016] animate-spin`} />
        <span className="absolute inset-0 rounded-full border-2 border-[#87A96B]/20 animate-ping" />
      </div>
      {message && (
        <p className="text-sm font-medium text-gray-600 animate-pulse text-center max-w-sm">
          {message}
        </p>
      )}
    </div>
  );
};

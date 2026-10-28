import React, { ReactNode } from 'react';
import { Compass } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-6 rounded-3xl bg-white border border-[#E8F0E4] shadow-xs ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F0E4] flex items-center justify-center text-[#2D5016]">
        {icon || <Compass className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

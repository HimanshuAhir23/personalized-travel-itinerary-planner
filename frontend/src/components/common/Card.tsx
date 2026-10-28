import React, { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'warm' | 'outlined' | 'elevated' | 'forest';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-[#E8F0E4] shadow-sm',
    warm: 'bg-[#FFF8DC]/70 border border-[#87A96B]/20 shadow-sm',
    outlined: 'bg-transparent border-2 border-[#87A96B]/30',
    elevated: 'bg-white border border-gray-100 shadow-md',
    forest: 'bg-[#2D5016] text-[#FFFFF0] border border-[#4A7C23]',
  };

  const hoverClasses = hoverable
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-[#87A96B]/40'
    : '';

  return (
    <div
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

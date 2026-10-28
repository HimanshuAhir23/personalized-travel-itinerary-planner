import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 shadow-xs',
    md: 'text-sm px-4 py-2.5 gap-2 shadow-sm',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow-md font-semibold',
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#2D5016] text-[#FFFFF0] hover:bg-[#1F380F] focus:ring-[#4A7C23] shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-[#87A96B] text-[#FFFFF0] hover:bg-[#729257] focus:ring-[#87A96B] active:scale-[0.98]',
    outline: 'border border-[#87A96B] text-[#2D5016] bg-transparent hover:bg-[#E8F0E4] focus:ring-[#87A96B]',
    ghost: 'text-[#2D5016] bg-transparent hover:bg-[#E8F0E4]/60 focus:ring-[#87A96B]',
    amber: 'bg-[#D4A017] text-white hover:bg-[#B8860B] focus:ring-[#F0C75E] shadow-md active:scale-[0.98]',
    danger: 'bg-[#E8735A] text-white hover:bg-[#D45940] focus:ring-[#E8735A]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};

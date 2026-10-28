import React, { SelectHTMLAttributes, forwardRef, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, leftIcon, className = '', id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-semibold text-[#1A1A2E]">
            {label}
            {required && <span className="text-[#E8735A] ml-1">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </div>
          )}
          <select
            id={selectId}
            ref={ref}
            required={required}
            className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#1A1A2E] 
              transition duration-150 ease-in-out focus:outline-none focus:ring-2 pr-10
              ${leftIcon ? 'pl-10' : ''}
              ${
                error
                  ? 'border-[#E8735A] focus:border-[#E8735A] focus:ring-[#E8735A]/20'
                  : 'border-gray-200 focus:border-[#87A96B] focus:ring-[#87A96B]/25'
              }
              ${className}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-[#E8735A] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';

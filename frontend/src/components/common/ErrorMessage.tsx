import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while retrieving your travel details. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 rounded-2xl bg-red-50/80 border border-red-200 text-red-900 ${className}`}>
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-red-100 rounded-xl text-[#E8735A] shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="font-semibold text-base text-[#1A1A2E]">{title}</h4>
          <p className="text-sm text-gray-600">{message}</p>
          {onRetry && (
            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

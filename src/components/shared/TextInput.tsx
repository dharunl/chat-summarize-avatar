
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  isLoading?: boolean;
}

const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ className, label, helperText, error, isLoading, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            className={cn(
              "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y",
              error && "border-red-500 focus-visible:ring-red-500",
              isLoading && "opacity-70",
              className
            )}
            ref={ref}
            disabled={isLoading}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-3">
              <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}
        </div>
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
        )}
        {error && (
          <p className="mt-1.5 text-xs text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;

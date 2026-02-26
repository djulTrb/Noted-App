import React from 'react';
import { cn } from '../../lib/utils.js';

export const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
    return (
        <div className="w-full flex flex-col gap-1.5">
            {label && <label className="text-sm font-medium text-secondary">{label}</label>}
            <input
                ref={ref}
                className={cn(
                    'w-full h-11 px-4 bg-elevated border border-custom rounded-lg',
                    'text-primary placeholder:text-muted outline-none transition-colors duration-200',
                    'focus:border-accent focus:ring-1 focus:ring-accent',
                    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <span className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

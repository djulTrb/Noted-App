import React from 'react';
import { cn } from '../../lib/utils.js';
import { X } from 'lucide-react';

export function Tag({
    children,
    onRemove,
    onClick,
    active = false,
    className
}) {
    return (
        <span
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 text-sm rounded transition-colors',
                onClick ? 'cursor-pointer hover:bg-elevated border border-custom' : 'bg-elevated border border-transparent text-secondary',
                active && 'bg-accent/10 border-accent/20 text-accent',
                className
            )}
        >
            <span>{children}</span>
            {onRemove && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="hover:text-danger focus:outline-none transition-colors opacity-70 hover:opacity-100"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            )}
        </span>
    );
}

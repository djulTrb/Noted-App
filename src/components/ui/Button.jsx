import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { cn } from '../../lib/utils.js'; // We'll create a simple tailwind-merge util

export const Button = React.forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    className,
    onMouseEnter,
    onMouseLeave,
    ...props
}, ref) => {
    const localRef = useRef(null);
    const combinedRef = ref || localRef;

    useEffect(() => {
        const el = combinedRef.current;
        if (!el) return;

        const ctx = gsap.context(() => { }, el);
        return () => ctx.revert();
    }, [combinedRef]);

    const handleMouseEnter = (e) => {
        gsap.to(combinedRef.current, { scale: 1.03, duration: 0.2, ease: 'power2.out' });
        if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e) => {
        gsap.to(combinedRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
        if (onMouseLeave) onMouseLeave(e);
    };

    const variants = {
        primary: 'bg-accent text-white flex-shrink-0 relative overflow-hidden focus-accent',
        secondary: 'bg-elevated text-primary border border-custom focus-accent',
        ghost: 'bg-transparent text-secondary hover:bg-elevated hover:text-primary focus-accent text-sm',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:outline-red-500',
    };

    const sizes = {
        sm: 'h-8 px-3 text-sm',
        md: 'h-11 px-5 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-0 flex items-center justify-center'
    };

    return (
        <button
            ref={combinedRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'inline-flex items-center justify-center font-medium transition-colors outline-none rounded-lg',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            {variant === 'primary' && (
                <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity z-0 pointer-events-none" />
            )}
        </button>
    );
});

Button.displayName = 'Button';

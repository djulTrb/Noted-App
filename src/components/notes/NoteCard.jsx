import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useUiStore } from '../../stores/uiStore.js';
import { cn } from '../../lib/utils.js';

export function NoteCard({ note, onClick, index = 0 }) {
    const cardRef = useRef(null);

    // Stagger entry animation on mount
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        gsap.fromTo(el,
            { opacity: 0, y: 16, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out', delay: index * 0.07 }
        );
    }, [index]);

    const handleMouseEnter = () => {
        gsap.to(cardRef.current, { scale: 1.01, duration: 0.2, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, { scale: 1, duration: 0.2, ease: 'power2.out' });
    };

    // Determine grid span based on randomized background id, giving organic masonry feel
    // e.g., 1x1, 2x1, 1x2. Mobile is always 1 col so this mainly applies to md+ screens.
    const spanClass = React.useMemo(() => {
        const mod = note.gradient_id % 5;
        if (mod === 0) return 'md:col-span-2 md:row-span-1'; // Wide
        if (mod === 1) return 'md:col-span-1 md:row-span-2'; // Tall
        return 'md:col-span-1 md:row-span-1'; // Normal
    }, [note.gradient_id]);

    // Strip HTML for preview
    const previewText = React.useMemo(() => {
        if (!note.text_value) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = note.text_value;
        return tempDiv.textContent || tempDiv.innerText || '';
    }, [note.text_value]);

    const dateStr = new Date(note.updated_last_on || note.created_on).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div
            ref={cardRef}
            onClick={() => onClick(note)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                'group cursor-pointer rounded-[16px] p-5 border border-custom flex flex-col',
                'bg-surface hover:bg-elevated transition-colors duration-300 overflow-hidden relative shadow-sm hover:shadow-md',
                spanClass
            )}
        >
            {/* Subtle top accent line colored based on gradient_id to keep a hint of color */}
            <div
                className="absolute top-0 left-0 right-0 h-1 z-0 opacity-80"
                style={{ backgroundImage: `var(--gradient-card-${note.gradient_id})` }}
            ></div>

            <div className="flex flex-col h-full z-10 relative pt-1">
                <h3 className="font-sans font-bold text-lg md:text-xl text-primary mb-2 line-clamp-2 leading-tight">
                    {note.title || 'Untitled Note'}
                </h3>

                <p className="text-secondary text-sm line-clamp-4 md:line-clamp-6 mb-4 flex-1">
                    {previewText}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                    {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {note.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="px-2 py-0.5 bg-surface/80 backdrop-blur-sm border border-custom text-xs text-secondary rounded">
                                    {tag.val || tag}
                                </span>
                            ))}
                            {note.tags.length > 3 && (
                                <span className="px-2 py-0.5 bg-surface/80 backdrop-blur-sm border border-custom text-xs text-muted rounded">
                                    +{note.tags.length - 3}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                            {dateStr}
                        </span>
                    </div>
                </div>
            </div>

            {/* Subtle hover overlay effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors pointer-events-none z-0 mix-blend-overlay"></div>
        </div>
    );
}

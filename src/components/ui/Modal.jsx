import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children }) {
    const dialogRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        const content = contentRef.current;
        if (!dialog || !content) return;

        if (isOpen) {
            dialog.showModal();
            gsap.fromTo(
                content,
                { opacity: 0, scale: 0.96, y: 8 },
                { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: 'power2.out' }
            );
        } else {
            if (dialog.open) {
                gsap.to(content, {
                    opacity: 0,
                    scale: 0.96,
                    y: 8,
                    duration: 0.15,
                    ease: 'power2.in',
                    onComplete: () => {
                        dialog.close();
                    }
                });
            }
        }
    }, [isOpen]);

    const handleCancelClick = (e) => {
        e.preventDefault();
        onClose();
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current) {
            onClose();
        }
    };

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancelClick}
            onClick={handleBackdropClick}
            className="p-0 m-auto mt-[10vh] border-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm bg-transparent !fixed inset-0 min-w-0"
        >
            <div
                ref={contentRef}
                className="w-full max-w-2xl bg-elevated border border-custom rounded-[16px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 border-b border-custom">
                    <h2 className="text-xl font-semibold font-display truncate pr-4">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-surface transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="p-5 overflow-y-auto">
                    {children}
                </div>
            </div>
        </dialog>
    );
}

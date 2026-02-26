import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ message, type = 'success', duration = 3000 }) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id) => {
        // We don't remove immediately from state because we want to animate out
        // The ToastItem handles its own unmount animation then calls onRemove
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);

function ToastItem({ toast, onRemove }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Slide in
        gsap.fromTo(
            el,
            { opacity: 0, x: 32 },
            { opacity: 1, x: 0, duration: 0.28, ease: 'power3.out' }
        );

        // Auto-remove timeout
        const timer = setTimeout(() => {
            handleClose();
        }, toast.duration);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        const el = ref.current;
        if (!el) return;

        gsap.to(el, {
            opacity: 0,
            x: 32,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: onRemove,
        });
    };

    const types = {
        success: 'bg-green-500 text-white border-green-600',
        error: 'bg-danger text-white border-red-600',
        info: 'bg-surface text-primary border-custom',
    };

    return (
        <div
            ref={ref}
            className={`relative px-4 py-3 rounded-lg shadow-lg border pointer-events-auto flex items-center justify-between min-w-[280px] ${types[toast.type]}`}
        >
            <span className="font-medium text-sm">{toast.message}</span>
            <button
                onClick={handleClose}
                className="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
            >
                <X size={16} />
            </button>
        </div>
    );
}

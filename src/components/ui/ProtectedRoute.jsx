import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore.js';

export function ProtectedRoute({ children }) {
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const session = useAuthStore((state) => state.session);

    if (!isInitialized) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-surface">
                <div className="animate-pulse w-8 h-8 rounded-full bg-accent opacity-50"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

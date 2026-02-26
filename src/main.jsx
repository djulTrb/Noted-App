import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';
import { useAuthStore } from './stores/authStore.js';
import { ToastProvider } from './components/ui/Toast.jsx';
import App from './App.jsx';
import './styles/index.css';
import './styles/editor.css';

// We must correctly handle the auth initialization gating
// We create an AppWrapper to handle initialization before rendering
function AppWrapper() {
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const initialize = useAuthStore((state) => state.initialize);

    React.useEffect(() => {
        // initialize() sets up session and registers listeners via Supabase
        const unsubscribe = initialize();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [initialize]);

    if (!isInitialized) {
        // Show nothing or a clean loader until auth completes
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-surface">
                <div className="animate-pulse w-8 h-8 rounded-full bg-accent opacity-50"></div>
            </div>
        );
    }

    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ToastProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppWrapper />);

import React from 'react';
import { Menu } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore.js';

export function AppHeader({ title, children }) {
    const setDrawerOpen = useUiStore((state) => state.setMobileDrawerOpen);

    return (
        <header className="sticky top-0 z-40 bg-main/80 backdrop-blur-md border-b border-custom w-full h-16 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-4 min-w-0">
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="md:hidden p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-surface border border-transparent hover:border-custom transition-all"
                >
                    <Menu size={22} />
                </button>
                <h1 className="text-xl md:text-2xl font-bold font-display text-primary truncate">{title}</h1>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {children}
            </div>
        </header>
    );
}

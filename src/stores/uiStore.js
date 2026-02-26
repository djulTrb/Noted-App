import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
    persist(
        (set) => ({
            sidebarCollapsed: false,
            setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
            mobileDrawerOpen: false,
            setMobileDrawerOpen: (val) => set({ mobileDrawerOpen: val }),
            accentColor: 'violet',
            setAccentColor: (color) => {
                document.documentElement.dataset.accent = color;
                set({ accentColor: color });
            },
            darkMode: false,
            toggleDarkMode: () => {
                set((state) => {
                    const next = !state.darkMode;
                    if (next) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { darkMode: next };
                });
            },
        }),
        {
            name: 'noted-ui-storage',
            onRehydrateStorage: () => (state) => {
                // Hydrate DOM data attributes from persisted store
                if (state) {
                    document.documentElement.dataset.accent = state.accentColor;
                    if (state.darkMode) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                }
            },
        }
    )
);

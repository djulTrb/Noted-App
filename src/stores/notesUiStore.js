import { create } from 'zustand';

export const useNotesUiStore = create((set) => ({
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    selectedTags: [],
    toggleTag: (tag) => set((state) => ({
        selectedTags: state.selectedTags.includes(tag)
            ? state.selectedTags.filter((t) => t !== tag)
            : [...state.selectedTags, tag]
    })),
    clearTags: () => set({ selectedTags: [] }),
    sortBy: 'updated_last_on',
    setSortBy: (sortKey) => set({ sortBy: sortKey })
}));

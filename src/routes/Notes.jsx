import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FilterX, FileText, Loader2 } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { NoteGrid } from '../components/notes/NoteGrid.jsx';
import { NoteModal } from '../components/notes/NoteModal.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Tag } from '../components/ui/Tag.jsx';
import { useNotes, useDeleteNote } from '../queries/notes.js';
import { useNotesUiStore } from '../stores/notesUiStore.js';
import gsap from 'gsap';

export default function Notes() {
    const navigate = useNavigate();
    const { data: notes, isLoading, error } = useNotes();
    const { mutate: deleteNoteMutate, isPending: isDeleting } = useDeleteNote();

    const searchQuery = useNotesUiStore((state) => state.searchQuery);
    const setSearchQuery = useNotesUiStore((state) => state.setSearchQuery);
    const selectedTags = useNotesUiStore((state) => state.selectedTags);
    const toggleTag = useNotesUiStore((state) => state.toggleTag);
    const clearTags = useNotesUiStore((state) => state.clearTags);
    const sortBy = useNotesUiStore((state) => state.sortBy);
    const setSortBy = useNotesUiStore((state) => state.setSortBy);

    const [selectedNote, setSelectedNote] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const emptyStateRef = useRef(null);

    // Derive unique tags across all notes
    const allTags = useMemo(() => {
        if (!notes) return [];
        const tags = new Set();
        notes.forEach(note => {
            if (note.tags) {
                note.tags.forEach(t => tags.add(t.val || t));
            }
        });
        return Array.from(tags).sort();
    }, [notes]);

    // Filter and sort notes
    const filteredNotes = useMemo(() => {
        if (!notes) return [];

        let result = [...notes];

        // Filter by Search Query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(n =>
                (n.title && n.title.toLowerCase().includes(q)) ||
                (n.text_value && n.text_value.toLowerCase().includes(q))
            );
        }

        // Filter by Tags (must have ALL selected tags)
        if (selectedTags.length > 0) {
            result = result.filter(n => {
                if (!n.tags) return false;
                const noteTags = n.tags.map(t => typeof t === 'object' ? t.val : t);
                return selectedTags.every(tag => noteTags.includes(tag));
            });
        }

        // Sort
        result.sort((a, b) => {
            const dateA = new Date(a[sortBy] || a.created_on).getTime();
            const dateB = new Date(b[sortBy] || b.created_on).getTime();
            return dateB - dateA; // Descending (newest first)
        });

        return result;
    }, [notes, searchQuery, selectedTags, sortBy]);

    useEffect(() => {
        if (filteredNotes.length === 0 && !isLoading && emptyStateRef.current) {
            gsap.fromTo(emptyStateRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
            );
        }
    }, [filteredNotes.length, isLoading]);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
    };

    const handleCreateNote = () => {
        navigate('/editor');
    };

    if (error) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-danger bg-surface">
                <p>Error loading notes: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-main relative">
            <Sidebar />
            <MobileDrawer />

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <AppHeader title="All Notes">
                    <Button size="sm" variant="primary" onClick={handleCreateNote}>
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Note</span>
                    </Button>
                </AppHeader>

                <div className="flex-1 overflow-y-auto w-full p-4 md:p-6 pb-40 flex flex-col items-center">
                    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 h-full">

                        {/* Toolbar */}
                        <div className="flex w-full flex-col sm:flex-row gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <Input
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-10 bg-surface shadow-sm border-custom rounded-xl"
                                />
                            </div>

                            <div className="flex items-center gap-3 ml-auto sm:ml-0 overflow-x-auto pb-1 no-scrollbar shrink-0 w-full sm:w-auto">
                                <select
                                    className="h-10 px-3 py-2 bg-surface border border-custom rounded-xl text-sm font-medium text-primary outline-none focus:border-accent shadow-sm pr-8 shrink-0 min-w-32 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', appearance: 'none' }}
                                >
                                    <option value="updated_last_on">Last Updated</option>
                                    <option value="created_on">Created Date</option>
                                </select>
                            </div>
                        </div>

                        {/* Tag Filter Row */}
                        {allTags.length > 0 && (
                            <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 flex-wrap shrink-0">
                                {selectedTags.length > 0 && (
                                    <Button size="sm" variant="ghost" onClick={clearTags} className="shrink-0 h-8 px-2 text-danger hover:text-danger hover:bg-danger/10">
                                        <FilterX size={14} /> Clear
                                    </Button>
                                )}
                                <div className="w-[1px] h-5 bg-border mx-1 shrink-0"></div>
                                {allTags.map(tag => (
                                    <Tag
                                        key={tag}
                                        active={selectedTags.includes(tag)}
                                        onClick={() => toggleTag(tag)}
                                        className="shrink-0 font-medium"
                                    >
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        )}

                        {/* Content Area */}
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="animate-pulse w-8 h-8 rounded-full bg-accent opacity-50"></div>
                            </div>
                        ) : filteredNotes.length > 0 ? (
                            <NoteGrid notes={filteredNotes} onNoteClick={handleNoteClick} />
                        ) : (
                            <div ref={emptyStateRef} className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 px-8">
                                <div className="w-20 h-20 bg-elevated rounded-full flex items-center justify-center mb-6 shadow-inset border border-custom">
                                    <FileText className="w-8 h-8 text-muted" />
                                </div>
                                <h2 className="text-2xl font-bold font-sans text-primary mb-2">
                                    {notes.length === 0 ? "You have no notes" : "Nothing matched"}
                                </h2>
                                <p className="text-secondary leading-relaxed mb-8">
                                    {notes.length === 0
                                        ? "Start writing to see your collection grow. Your notes will appear here, securely encrypted."
                                        : "Try adjusting your search query or removing some tag filters to find what you're looking for."}
                                </p>
                                {notes.length === 0 ? (
                                    <Button size="lg" variant="primary" onClick={handleCreateNote}>
                                        Write your first note
                                    </Button>
                                ) : (
                                    <Button size="md" variant="secondary" onClick={() => { setSearchQuery(''); clearTags(); }}>
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* End spacer */}
                        <div className="h-safe min-h-6 w-full shrink-0"></div>
                    </div>
                </div>
            </main>

            <NoteModal
                note={selectedNote}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={(id) => {
                    if (isDeleting) return;
                    deleteNoteMutate(id);
                }}
                isDeleting={isDeleting}
            />
        </div>
    );
}

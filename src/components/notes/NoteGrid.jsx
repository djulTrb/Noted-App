import React from 'react';
import { NoteCard } from './NoteCard.jsx';

export function NoteGrid({ notes, onNoteClick }) {
    if (!notes || notes.length === 0) return null;

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-[160px]">
            {notes.map((note, index) => (
                <NoteCard
                    key={note.id_note}
                    note={note}
                    index={index}
                    onClick={onNoteClick}
                />
            ))}
        </div>
    );
}

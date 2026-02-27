import React from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { Tag } from '../ui/Tag.jsx';
import { Pencil, Trash2, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NoteModal({ note, isOpen, onClose, onDelete, isDeleting = false }) {
    const navigate = useNavigate();

    if (!note) return null;

    const dateStr = new Date(note.updated_last_on || note.created_on).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const handleEdit = () => {
        onClose();
        // Navigate slightly after modal starts closing animation for smoothness
        setTimeout(() => {
            navigate(`/editor/${note.id_note}`);
        }, 150);
    };

    const handleDelete = () => {
        if (isDeleting) return;
        if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
            onDelete(note.id_note);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={
            <div className="flex items-center gap-2">
                <span className="truncate">{note.title}</span>
                {note.gradient_id && (
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: `var(--gradient-card-${note.gradient_id})` }}></span>
                )}
            </div>
        }>
            <div className="flex flex-col gap-6">

                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted font-mono bg-main py-1 px-3 rounded-md border border-custom">
                        <Clock size={14} />
                        <span>Last edited: {dateStr}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDelete}
                            className="text-danger hover:text-white hover:bg-danger"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            <span className="hidden sm:inline">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                        </Button>
                        <Button size="sm" variant="secondary" onClick={handleEdit}>
                            <Pencil size={16} />
                            <span>Edit Note</span>
                        </Button>
                    </div>
                </div>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, i) => (
                            <Tag key={i} active>{tag.val || tag}</Tag>
                        ))}
                    </div>
                )}

                {/* Rendered HTML Content */}
                {/* TipTap classes added so the prose rendering matches the editor */}
                <div className="w-full rounded-xl bg-surface border border-custom p-6 sm:p-8 min-h-[300px]">
                    <div
                        className="ProseMirror max-w-none text-primary whitespace-pre-wrap !min-h-0"
                        dangerouslySetInnerHTML={{ __html: note.text_value }}
                    />
                </div>

            </div>
        </Modal>
    );
}

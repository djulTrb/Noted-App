import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { common, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import { EditorToolbar } from '../components/notes/EditorToolbar.jsx';
import { TagInput } from '../components/notes/TagInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useToast } from '../components/ui/Toast.jsx';
import { useNote, useSaveNote, useUpdateNote } from '../queries/notes.js';
import { AiAssistant } from '../components/notes/AiAssistant.jsx';
import { Bot, X } from 'lucide-react'; // For mobile toggle
import { cn } from '../lib/utils.js';

// Setup lowlight for syntax highlighting
const lowlight = createLowlight(common);

export default function NoteEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToast } = useToast();

    const isEditing = Boolean(id);
    const { data: note, isLoading } = useNote(id);

    const { mutateAsync: saveNote, isPending: isSaving } = useSaveNote();
    const { mutateAsync: updateNote, isPending: isUpdating } = useUpdateNote();

    const [title, setTitle] = useState('');
    const [tags, setTags] = useState([]);
    const [saveError, setSaveError] = useState('');
    const [isAiOpenMobile, setIsAiOpenMobile] = useState(false);

    // Setup Editor
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            CodeBlockLowlight.configure({ lowlight }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Link.configure({ openOnClick: false }),
            Image,
            Youtube,
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            CharacterCount,
            Placeholder.configure({ placeholder: 'Start writing...' })
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none p-6 md:p-8',
            },
        },
        immediatelyRender: false,
    });

    // Load existing note data
    useEffect(() => {
        if (isEditing && note && editor && !editor.isDestroyed) {
            setTitle(note.title);
            setTags(note.tags || []);
            // Only set content if it's different to avoid resetting cursor
            if (editor.getHTML() !== note.text_value) {
                editor.commands.setContent(note.text_value);
            }
        }
    }, [isEditing, note, editor]);

    const handleSave = async () => {
        if (!title.trim()) {
            setSaveError('Title is required');
            // Shake animation effect for error
            const titleInput = document.getElementById('note-title-input');
            if (titleInput) {
                titleInput.classList.add('animate-shake');
                setTimeout(() => titleInput.classList.remove('animate-shake'), 400);
            }
            return;
        }

        setSaveError('');
        const contentHTML = editor.getHTML();

        try {
            if (isEditing) {
                await updateNote({ id_note: id, title, content: contentHTML, tags });
                addToast({ message: 'Note updated successfully' });
            } else {
                await saveNote({ title, content: contentHTML, tags });
                addToast({ message: 'Note created successfully' });
            }
            navigate('/notes');
        } catch (err) {
            console.error(err);
            addToast({ message: 'Failed to save note', type: 'error' });
        }
    };

    const handleCancel = () => {
        navigate('/notes');
    };

    const handleInsertText = (text) => {
        if (!editor) return;
        editor.chain().focus().insertContent(text + '\n').run();
        if (window.innerWidth < 1024) setIsAiOpenMobile(false);
    };

    const handleInsertImage = (src) => {
        if (!editor || !src) return;
        editor.chain().focus().setImage({ src }).run();
        if (window.innerWidth < 1024) setIsAiOpenMobile(false);
    };

    if (isEditing && isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-surface">
                <div className="animate-pulse w-8 h-8 rounded-full bg-accent opacity-50"></div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen flex flex-col bg-surface overflow-hidden">

            {/* Editor Header Bar */}
            <header className="flex-none h-auto min-h-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 sm:px-6 border-b border-custom bg-main">
                <div className="flex-1 w-full max-w-xl">
                    <TagInput tags={tags} onChange={setTags} />
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
                    <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving || isUpdating}>
                        {isSaving || isUpdating ? 'Saving...' : 'Save Note'}
                    </Button>
                </div>
            </header>

            {/* Editor Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* Desktop AI Assistant (Persistent Left Sidebar) */}
                <div className="hidden lg:block w-[320px] shrink-0 border-r border-custom h-full bg-surface z-10 pb-10">
                    <AiAssistant onInsertText={handleInsertText} onInsertImage={handleInsertImage} />
                </div>

                {/* Mobile AI Assistant (Slide-out Overlay) */}
                <div className={cn(
                    "lg:hidden fixed inset-y-0 left-0 w-[85vw] sm:w-[320px] bg-surface z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col",
                    isAiOpenMobile ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="flex items-center justify-between p-4 border-b border-custom">
                        <span className="font-bold flex items-center gap-2 text-primary"><Bot size={18} className="text-accent" /> AI Assistant</span>
                        <button onClick={() => setIsAiOpenMobile(false)} className="p-2 bg-elevated rounded-full text-secondary hover:text-primary">
                            <X size={16} />
                        </button>
                    </div>
                    <AiAssistant
                        onInsertText={handleInsertText}
                        onInsertImage={handleInsertImage}
                        className="flex-1 h-auto pb-10"
                    />
                </div>

                {/* Mobile Backdrop */}
                {isAiOpenMobile && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsAiOpenMobile(false)}
                    />
                )}

                <main className="flex-1 overflow-y-auto flex justify-center bg-main relative">
                    <div className="w-full max-w-4xl bg-surface flex flex-col min-h-full lg:border-x border-custom shadow-sm relative pt-4 pb-20">

                        <div className="px-6 md:px-8 pt-6 pb-2 border-b border-custom flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-accent mb-1">Title</span>
                            <input
                                id="note-title-input"
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (saveError) setSaveError('');
                                }}
                                placeholder="Give it a name. Make it memorable."
                                className="w-full bg-transparent text-3xl md:text-5xl font-display font-bold outline-none text-primary placeholder:text-muted/50"
                            />
                            {saveError && <span className="text-danger text-sm mt-1 animate-in fade-in">{saveError}</span>}
                        </div>

                        <EditorToolbar editor={editor} />

                        <div className="flex-1 w-full overflow-visible cursor-text pb-8" onClick={() => editor?.commands.focus()}>
                            <EditorContent editor={editor} className="min-h-full" />
                        </div>

                    </div>
                </main>
            </div>

            {/* Mobile AI Toggle Button */}
            <button
                onClick={() => setIsAiOpenMobile(true)}
                className="lg:hidden fixed bottom-14 right-4 w-12 h-12 bg-accent text-white rounded-full shadow-lg flex items-center justify-center z-30 hover:scale-105 active:scale-95 transition-transform"
            >
                <Bot size={24} />
            </button>

            {/* Footer Meta Bar */}
            <footer className="fixed bottom-0 left-0 right-0 h-10 bg-elevated/80 backdrop-blur-md border-t border-custom flex items-center justify-end px-6 font-mono text-xs text-secondary z-20">
                {editor && (
                    <div className="flex items-center gap-4">
                        <span>{editor.storage.characterCount.words()} words</span>
                        <span>{editor.storage.characterCount.characters()} chars</span>
                    </div>
                )}
            </footer>

            {/* Shake animation util dynamically injected for the form save error shake */}
            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 2; }
      `}</style>
        </div>
    );
}

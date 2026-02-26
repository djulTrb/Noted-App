import React, { useCallback } from 'react';
import {
    Bold, Italic, Strikethrough, Code, Code2,
    Heading1, Heading2, Heading3,
    List, ListOrdered, CheckSquare, Quote,
    Minus, Image as ImageIcon, Link2, Youtube, Table
} from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function EditorToolbar({ editor }) {
    if (!editor) return null;

    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        const url = window.prompt('Image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    const addYoutube = useCallback(() => {
        const url = window.prompt('YouTube URL');
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: Math.max(320, parseInt(editor.view.dom.clientWidth, 10) - 40) || 640,
                height: Math.max(180, parseInt((editor.view.dom.clientWidth - 40) * 0.5625, 10)) || 480,
            });
        }
    }, [editor]);

    const addTable = useCallback(() => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }, [editor]);

    const ToolbarBtn = ({ action, isActive, icon: Icon, title }) => (
        <button
            onClick={(e) => { e.preventDefault(); action(); }}
            className={cn(
                'w-8 h-8 rounded-md flex items-center justify-center transition-colors',
                isActive ? 'bg-accent/15 text-accent' : 'text-secondary hover:bg-elevated hover:text-primary'
            )}
            title={title}
            type="button"
        >
            <Icon size={16} />
        </button>
    );

    const Divider = () => <div className="w-[1px] h-6 bg-border mx-1" />;

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-custom bg-surface sticky top-0 z-10 w-full overflow-x-auto no-scrollbar shrink-0">

            {/* Text Styles */}
            <ToolbarBtn action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold" />
            <ToolbarBtn action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic" />
            <ToolbarBtn action={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough" />
            <ToolbarBtn action={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} icon={Code} title="Inline Code" />

            <Divider />

            {/* Headings */}
            <ToolbarBtn action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="Heading 1" />
            <ToolbarBtn action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="Heading 2" />
            <ToolbarBtn action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} icon={Heading3} title="Heading 3" />

            <Divider />

            {/* Lists */}
            <ToolbarBtn action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
            <ToolbarBtn action={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Ordered List" />
            <ToolbarBtn action={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={CheckSquare} title="Task List" />

            <Divider />

            {/* Blocks */}
            <ToolbarBtn action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Quote" />
            <ToolbarBtn action={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code2} title="Code Block" />
            <ToolbarBtn action={() => editor.chain().focus().setHorizontalRule().run()} isActive={false} icon={Minus} title="Horizontal Rule" />

            <Divider />

            {/* Media & Embeds */}
            <ToolbarBtn action={setLink} isActive={editor.isActive('link')} icon={Link2} title="Link" />
            <ToolbarBtn action={addImage} isActive={editor.isActive('image')} icon={ImageIcon} title="Image" />
            <ToolbarBtn action={addYoutube} isActive={editor.isActive('youtube')} icon={Youtube} title="YouTube Video" />
            <ToolbarBtn action={addTable} isActive={editor.isActive('table')} icon={Table} title="Table" />

        </div>
    );
}

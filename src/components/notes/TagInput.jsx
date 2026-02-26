import React, { useRef, useState, useEffect } from 'react';
import { Tag } from '../ui/Tag.jsx';

export function TagInput({ tags, onChange }) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && inputValue === '') {
            if (tags.length > 0) {
                removeTag(tags[tags.length - 1]);
            }
        }
    };

    const addTag = () => {
        const newTag = inputValue.trim();
        if (newTag && !tags.some(t => (t.val || t) === newTag)) {
            onChange([...tags, { val: newTag, id: crypto.randomUUID() }]);
        }
        setInputValue('');
    };

    const handleBlur = () => {
        addTag();
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(t => t !== tagToRemove));
    };

    // Format legacy tags vs new tags gracefully
    const renderTag = (tag) => {
        const label = tag.val || tag;
        return (
            <Tag key={tag.id || label} onRemove={() => removeTag(tag)}>
                {label}
            </Tag>
        );
    };

    return (
        <div
            className="flex flex-wrap items-center gap-2 w-full p-2 bg-elevated border border-custom rounded-lg focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-colors cursor-text min-h-12"
            onClick={() => inputRef.current?.focus()}
        >
            {tags.map(renderTag)}
            <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={tags.length === 0 ? "Add tags (press Enter)..." : ""}
                className="flex-1 bg-transparent border-none outline-none min-w-[120px] text-sm text-primary placeholder:text-muted h-7 px-1"
            />
        </div>
    );
}

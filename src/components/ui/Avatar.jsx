import React from 'react';
import BoringAvatar from 'boring-avatars';
import { useUiStore } from '../../stores/uiStore';

export function Avatar({
    name = 'User',
    size = 40,
    colors,
    variant = 'beam'
}) {
    const accentColor = useUiStore((state) => state.accentColor);

    // Create a nice palette based on our themes if custom colors aren't provided
    const defaultColors = [
        '#2563EB', '#38BDF8', '#FB7185', '#A3E635', '#FB923C', '#7C6AFA'
    ];

    return (
        <div
            className="inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 border border-custom bg-elevated"
            style={{ width: size, height: size }}
        >
            <BoringAvatar
                size={size}
                name={name}
                variant={variant}
                colors={colors || defaultColors}
            />
        </div>
    );
}

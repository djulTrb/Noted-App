import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { Avatar } from '../components/ui/Avatar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { useUiStore } from '../stores/uiStore.js';
import { useProfile, useUpdateProfile } from '../queries/profile.js';
import { useToast } from '../components/ui/Toast.jsx';

export default function Settings() {
    const { user } = useAuthStore();
    const { data: profile } = useProfile();
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();
    const { addToast } = useToast();

    const accentColor = useUiStore((state) => state.accentColor);
    const setAccentColor = useUiStore((state) => state.setAccentColor);
    const darkMode = useUiStore((state) => state.darkMode);
    const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);

    const [username, setUsername] = useState(profile?.username || '');

    // Synchronize initial prop
    React.useEffect(() => {
        if (profile?.username) setUsername(profile.username);
    }, [profile?.username]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile({ username });
            addToast({ message: 'Profile updated successfully' });
        } catch (err) {
            addToast({ message: 'Failed to update profile', type: 'error' });
        }
    };

    const swatches = [
        { name: 'violet', hex: '#7C6AFA' },
        { name: 'sky', hex: '#38BDF8' },
        { name: 'rose', hex: '#FB7185' },
        { name: 'lime', hex: '#A3E635' },
        { name: 'orange', hex: '#FB923C' },
    ];

    return (
        <div className="flex h-screen bg-main relative">
            <Sidebar />
            <MobileDrawer />

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <AppHeader title="Settings" />

                <div className="flex-1 overflow-y-auto w-full p-4 md:p-6 pb-40 flex flex-col items-center">
                    <div className="w-full max-w-2xl flex flex-col gap-6 h-full">

                        {/* Profile Section */}
                        <section className="bg-surface border border-custom rounded-[16px] p-5 sm:p-6 shadow-sm">
                            <h2 className="text-lg font-bold font-sans text-primary mb-5">Profile</h2>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                                <Avatar name={profile?.username || user?.email || 'User'} size={80} />
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-secondary font-medium">Avatar is generated from your display name.</p>
                                    <p className="text-xs text-muted">A Boring Avatars feature.</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5 max-w-sm">
                                <Input
                                    label="Display Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <Input
                                    label="Email Address"
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-main text-muted cursor-not-allowed"
                                />

                                <Button type="submit" variant="secondary" className="mt-2 w-fit bg-elevated hover:bg-main" disabled={isPending || !username.trim()}>
                                    {isPending ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </section>

                        {/* Appearance Preferences */}
                        <section className="bg-surface border border-custom rounded-[16px] p-5 sm:p-6 shadow-sm">
                            <h2 className="text-lg font-bold font-sans text-primary mb-5">Appearance</h2>

                            <div className="flex flex-col gap-8">
                                <div>
                                    <h3 className="text-sm font-medium text-secondary mb-3">Accent Color</h3>
                                    <div className="flex flex-wrap gap-4">
                                        {swatches.map((swatch) => (
                                            <button
                                                key={swatch.name}
                                                onClick={() => setAccentColor(swatch.name)}
                                                className={`w-10 h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${accentColor === swatch.name ? 'ring-2 ring-offset-2 ring-offset-surface outline-none' : ''
                                                    }`}
                                                style={{
                                                    backgroundColor: swatch.hex,
                                                    outlineColor: swatch.hex, // For Tailwind ring color fallback representation
                                                    boxShadow: accentColor === swatch.name ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${swatch.hex}` : ''
                                                }}
                                                title={swatch.name}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-secondary mb-3">Theme</h3>
                                    <Button variant="secondary" onClick={toggleDarkMode}>
                                        Switch to {darkMode ? 'Light' : 'Dark'} Mode
                                    </Button>
                                </div>
                            </div>
                        </section>


                    </div>
                </div>
            </main>
        </div>
    );
}

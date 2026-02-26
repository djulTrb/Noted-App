import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { X, NotebookPen, SlidersHorizontal, Activity, LogOut, ListChecks, TrendingUp } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { Avatar } from '../ui/Avatar.jsx';

export function MobileDrawer() {
    const isOpen = useUiStore((state) => state.mobileDrawerOpen);
    const setOpen = useUiStore((state) => state.setMobileDrawerOpen);
    const { user, signOut } = useAuthStore();
    const location = useLocation();

    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    const displayName = user?.email?.split('@')[0] || 'User';

    useEffect(() => {
        if (isOpen) {
            // Unhide wrapper
            gsap.set(overlayRef.current, { display: 'block' });
            // Fade overlay
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' });
            // Slide drawer
            gsap.to(drawerRef.current, { x: 0, duration: 0.3, ease: 'power3.out' });
            // Body locked
            document.body.style.overflow = 'hidden';
        } else {
            gsap.to(drawerRef.current, { x: '-100%', duration: 0.25, ease: 'power3.out' });
            gsap.to(overlayRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power3.out',
                onComplete: () => {
                    gsap.set(overlayRef.current, { display: 'none' });
                }
            });
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    // Auto close on navigation
    useEffect(() => {
        setOpen(false);
    }, [location.pathname, setOpen]);

    const navItems = [
        { icon: <NotebookPen size={20} />, label: 'All Notes', path: '/notes' },
        { icon: <ListChecks size={20} />, label: 'To-Do List', path: '/todo' },
        { icon: <TrendingUp size={20} />, label: 'Expenses', path: '/expenses' },
        { icon: <Activity size={20} />, label: 'Statistiques', path: '/stats' },
        { icon: <SlidersHorizontal size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm opacity-0 hidden"
            onClick={() => setOpen(false)}
        >
            <div
                ref={drawerRef}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-0 left-0 w-[280px] h-full bg-surface shadow-2xl flex flex-col translate-x-[-100%]"
            >
                <div className="p-4 flex items-center justify-between border-b border-custom">
                    <Link to="/notes" className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        Noted
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-elevated transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-accent/10 text-accent font-medium'
                                    : 'text-secondary hover:bg-elevated hover:text-primary'
                                    }`}
                            >
                                <span className={isActive ? 'text-accent' : 'text-muted'}>
                                    {item.icon}
                                </span>
                                <span className="text-lg">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-custom pb-safe">
                    <div className="flex items-center gap-3 mb-6 px-3">
                        <Avatar name={displayName} size={40} />
                        <p className="text-base font-medium text-primary truncate">{displayName}</p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-danger hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-lg">Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { X, FileText, CheckSquare, Wallet, BarChart3, Settings, LogOut } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore.js';
import { useAuthStore } from '../../stores/authStore.js';
import { Avatar } from '../ui/Avatar.jsx';

const navItems = [
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/todo' },
    { icon: Wallet, label: 'Finance', path: '/expenses' },
    { icon: BarChart3, label: 'Stats', path: '/stats' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

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
            gsap.set(overlayRef.current, { display: 'block' });
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.2, ease: 'power2.out' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.3, ease: 'power3.out' });
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

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm opacity-0 hidden"
            onClick={() => setOpen(false)}
        >
            <div
                ref={drawerRef}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-0 left-0 w-[270px] h-full bg-surface shadow-2xl flex flex-col translate-x-[-100%]"
            >
                {/* Header */}
                <div className="px-5 flex items-center justify-between h-14 border-b border-custom">
                    <Link to="/notes" className="font-display font-bold text-lg text-primary flex items-center gap-2.5">
                        <span className="w-[22px] h-[22px] rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        Noted
                    </Link>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-elevated transition-colors"
                    >
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-accent/10 text-accent'
                                    : 'text-muted hover:bg-elevated hover:text-primary'
                                    }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                                <span className={`text-[0.95rem] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-custom pb-safe">
                    <div className="flex items-center gap-3 px-3 mb-4">
                        <Avatar name={displayName} size={36} />
                        <p className="text-sm font-medium text-primary truncate">{displayName}</p>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-muted hover:text-danger hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut size={18} strokeWidth={1.5} />
                        <span className="font-medium text-sm">Sign out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { NotebookPen, SlidersHorizontal, Activity, LogOut, X, ListChecks, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useUiStore } from '../../stores/uiStore.js';
import { Avatar } from '../ui/Avatar.jsx';

export function Sidebar() {
    const { user, signOut } = useAuthStore();
    const collapsed = useUiStore((state) => state.sidebarCollapsed);
    const setCollapsed = useUiStore((state) => state.setSidebarCollapsed);
    const location = useLocation();
    const sidebarRef = useRef(null);

    // Basic username inference since we don't have the profile query in sidebar for simplicity
    const displayName = user?.email?.split('@')[0] || 'User';

    const navItems = [
        { icon: <NotebookPen size={18} />, label: 'All Notes', path: '/notes' },
        { icon: <ListChecks size={18} />, label: 'To-Do List', path: '/todo' },
        { icon: <TrendingUp size={18} />, label: 'Expenses', path: '/expenses' },
        { icon: <Activity size={18} />, label: 'Statistiques', path: '/stats' },
        { icon: <SlidersHorizontal size={18} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside
            ref={sidebarRef}
            className={`hidden md:flex flex-col h-screen sticky top-0 bg-surface border-r border-custom transition-[width] duration-300 ease-in-out z-30 ${collapsed ? 'w-[72px]' : 'w-[200px]'
                }`}
        >
            <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 border-b border-custom`}>
                {!collapsed && (
                    <Link to="/notes" className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        Noted
                    </Link>
                )}
                {collapsed && (
                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0" onClick={() => setCollapsed(false)}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1.5">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
                                ? 'bg-accent/10 text-accent font-medium'
                                : 'text-secondary hover:bg-elevated hover:text-primary'
                                }`}
                            title={collapsed ? item.label : undefined}
                        >
                            <span className={`shrink-0 ${isActive ? 'text-accent' : 'text-muted group-hover:text-primary'}`}>
                                {item.icon}
                            </span>
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-custom">
                <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                    <Avatar name={displayName} size={32} />
                    {!collapsed && (
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-sm font-medium text-primary truncate">{displayName}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => signOut()}
                    className={`mt-4 flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-danger hover:bg-red-500/10 transition-colors ${collapsed ? 'justify-center' : ''}`}
                    title={collapsed ? 'Sign out' : undefined}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!collapsed && <span className="font-medium">Sign out</span>}
                </button>
            </div>

            {/* Toggle button - floating on edge */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex absolute top-[18px] -right-3 w-6 h-6 bg-surface border border-custom items-center justify-center rounded-full text-muted hover:text-primary transition-colors hover:shadow-sm"
            >
                <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`}
                >
                    <path d="m15 18-6-6 6-6" />
                </svg>
            </button>
        </aside>
    );
}

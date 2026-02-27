import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, CheckSquare, Wallet, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore.js';
import { useUiStore } from '../../stores/uiStore.js';
import { Avatar } from '../ui/Avatar.jsx';

const navItems = [
    { icon: FileText, label: 'Notes', path: '/notes' },
    { icon: CheckSquare, label: 'Tasks', path: '/todo' },
    { icon: Wallet, label: 'Finance', path: '/expenses' },
    { icon: BarChart3, label: 'Stats', path: '/stats' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
    const { user, signOut } = useAuthStore();
    const collapsed = useUiStore((state) => state.sidebarCollapsed);
    const setCollapsed = useUiStore((state) => state.setSidebarCollapsed);
    const location = useLocation();
    const sidebarRef = useRef(null);

    const displayName = user?.email?.split('@')[0] || 'User';

    return (
        <aside
            ref={sidebarRef}
            className={`hidden md:flex flex-col h-screen sticky top-0 bg-surface border-r border-custom transition-[width] duration-300 ease-in-out z-30 ${collapsed ? 'w-[68px]' : 'w-[200px]'}`}
        >
            {/* Header / Logo */}
            <div className={`flex items-center h-14 border-b border-custom shrink-0 ${collapsed ? 'justify-center px-0' : 'px-5'}`}>
                {!collapsed && (
                    <Link to="/notes" className="font-display font-bold text-lg text-primary flex items-center gap-2.5">
                        <span className="w-[22px] h-[22px] rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        Noted
                    </Link>
                )}
                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                    >
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto flex flex-col gap-1 py-4 ${collapsed ? 'px-2.5' : 'px-3'}`}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : undefined}
                            className={`
                                flex items-center rounded-lg transition-colors
                                ${collapsed
                                    ? 'justify-center w-full aspect-square'
                                    : 'gap-3 px-3 py-2.5'
                                }
                                ${isActive
                                    ? 'bg-accent/10 text-accent'
                                    : 'text-muted hover:bg-elevated hover:text-primary'
                                }
                            `}
                        >
                            <Icon size={collapsed ? 20 : 18} strokeWidth={isActive ? 2 : 1.5} className="shrink-0" />
                            {!collapsed && (
                                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className={`border-t border-custom py-3 ${collapsed ? 'px-2.5' : 'px-3'}`}>
                {/* User */}
                <div className={`flex items-center mb-2 ${collapsed ? 'justify-center py-1' : 'gap-3 px-3 py-2'}`}>
                    <Avatar name={displayName} size={collapsed ? 28 : 30} />
                    {!collapsed && (
                        <p className="text-sm font-medium text-primary truncate flex-1 min-w-0">{displayName}</p>
                    )}
                </div>

                {/* Sign out */}
                <button
                    onClick={() => signOut()}
                    title={collapsed ? 'Sign out' : undefined}
                    className={`
                        flex items-center rounded-lg text-muted hover:text-danger hover:bg-red-500/10 transition-colors w-full
                        ${collapsed ? 'justify-center aspect-square' : 'gap-3 px-3 py-2.5'}
                    `}
                >
                    <LogOut size={collapsed ? 18 : 17} strokeWidth={1.5} className="shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Sign out</span>}
                </button>
            </div>

            {/* Collapse toggle — floating on edge */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex absolute top-[15px] -right-3 w-6 h-6 bg-surface border border-custom items-center justify-center rounded-full text-muted hover:text-primary transition-colors hover:shadow-sm"
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

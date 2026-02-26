import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Button } from '../ui/Button.jsx';
import { useUiStore } from '../../stores/uiStore.js';
import { Sun, Moon } from 'lucide-react';

export function Navbar() {
    const navRef = useRef(null);
    const { isDarkMode, toggleDarkMode } = useUiStore();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navRef.current.classList.add('bg-surface/80', 'backdrop-blur-md', 'border', 'border-custom');
                navRef.current.classList.remove('bg-transparent', 'border-transparent');
            } else {
                navRef.current.classList.add('bg-transparent', 'border-transparent');
                navRef.current.classList.remove('bg-surface/80', 'backdrop-blur-md', 'border', 'border-custom');
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            ref={navRef}
            className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl h-14 md:h-16 rounded-[20px] md:rounded-full flex items-center justify-between px-6 z-50 transition-all duration-300 bg-transparent border border-transparent shadow-none"
        >
            <Link to="/" className="font-display font-bold text-2xl text-primary flex items-center gap-2 group">
                <span className="w-8 h-8 rounded-[10px] bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <span className="w-2.5 h-2.5 bg-accent rounded-full"></span>
                </span>
                <span className="tracking-tight">Noted</span>
            </Link>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-secondary hover:text-primary transition-colors hover:bg-elevated rounded-full"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <Link to="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors hidden sm:block">
                    Sign in
                </Link>
                <Link to="/signup">
                    <Button size="sm" variant="primary">Open workspace</Button>
                </Link>
            </div>
        </nav>
    );
}

import React from 'react';
import { Github, Twitter } from 'lucide-react';

export function LandingFooter() {
    return (
        <footer className="w-full bg-surface/50 border-t border-custom pt-8 pb-8 px-6 md:px-12 relative z-10 mt-12 backdrop-blur-md">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Brand & Copyright */}
                <div className="flex items-center gap-3">
                    <div className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center shrink-0">
                            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                        </span>
                        Noted
                    </div>
                    <span className="text-muted/40">|</span>
                    <p className="text-sm text-secondary">
                        &copy; {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>

                {/* Minimal Socials */}
                <div className="flex items-center gap-6">
                    <a href="https://github.com/djulTrb" target="_blank" rel="noreferrer" className="text-muted hover:text-primary transition-colors">
                        <Github size={18} />
                    </a>
                </div>

            </div>
        </footer>
    );
}

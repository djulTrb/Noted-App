import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';

export function Hero() {
    const containerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.hero-stagger', {
                opacity: 0,
                y: 30,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out',
                delay: 0.2
            });

            gsap.from('.hero-badge', {
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                ease: 'back.out(1.7)',
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={containerRef}
            className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-6 relative z-10 overflow-hidden"
        >
            {/* Extremely subtle atmospheric background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0,transparent_50%)] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>

            <div className="w-full max-w-4xl flex flex-col items-center justify-center text-center mt-12 md:mt-0 relative z-10 gap-8">

                {/* Modern Pill Badge */}
                <div className="hero-badge flex items-center gap-2 px-4 py-1.5 rounded-full border border-custom bg-surface/50 backdrop-blur-md shadow-sm mb-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                    <span className="text-xs font-medium tracking-wide text-secondary uppercase">Noted v2.0 is live</span>
                </div>

                {/* Typography First Heading */}
                <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-sans font-extrabold tracking-tighter text-primary leading-[1.05] hero-stagger">
                    Clarity through<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-sky-400">
                        encryption.
                    </span>
                </h1>

                {/* Refined Subtitle */}
                <p className="text-lg md:text-xl text-muted max-w-2xl leading-relaxed hero-stagger font-medium">
                    The quiet workspace for your life's work. Securely capture thoughts, master your tasks, and direct your finances in one beautifully engineered ecosystem.
                </p>

                {/* Calls to Action */}
                <div className="pt-4 hero-stagger flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
                    <Link to="/signup" className="w-full sm:w-auto">
                        <Button size="lg" variant="primary" className="text-base px-8 h-12 md:h-14 rounded-full shadow-lg shadow-accent/20 hover:shadow-accent/40 w-full hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 group">
                            Open your workspace
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link to="/login" className="w-full sm:w-auto">
                        <Button size="lg" variant="ghost" className="text-base px-8 h-12 md:h-14 rounded-full w-full sm:w-auto hover:bg-surface border border-transparent hover:border-custom transition-all">
                            Sign in to account
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bottom Gradient Fade to transition into Features organically */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-main to-transparent pointer-events-none"></div>
        </section>
    );
}

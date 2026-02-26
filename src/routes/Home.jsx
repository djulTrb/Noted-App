import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Hero } from '../components/landing/Hero.jsx';
import { Features } from '../components/landing/Features.jsx';
import { LandingFooter } from '../components/landing/LandingFooter.jsx';
import { useAuthStore } from '../stores/authStore.js';
import { Button } from '../components/ui/Button.jsx';
import { ArrowRight } from 'lucide-react';

export default function Home() {
    const session = useAuthStore((state) => state.session);

    // If already logged in, redirect to workspace directly
    if (session) {
        return <Navigate to="/notes" replace />;
    }

    return (
        <div className="w-full min-h-screen bg-main flex flex-col items-center selection:bg-accent/30 selection:text-primary">
            <Navbar />
            <div className="flex-1 w-full relative z-10 flex flex-col items-center w-full">
                <Hero />
                <Features />

                {/* Pre-Footer CTA */}
                <section className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 my-8 md:my-16 flex flex-col items-center text-center">
                    <div className="w-full bg-gradient-to-br from-surface to-elevated border border-custom rounded-[2rem] p-12 md:p-20 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-700"></div>

                        <h2 className="text-3xl md:text-5xl font-bold font-sans text-primary mb-4 tracking-tight relative z-10">
                            Ready to rethink your workspace?
                        </h2>
                        <p className="text-secondary text-base md:text-lg mb-8 max-w-xl mx-auto relative z-10">
                            Join Noted today and experience the calm, secure, and focused environment built for your most important thoughts.
                        </p>

                        <div className="relative z-10">
                            <Link to="/signup">
                                <Button size="lg" variant="primary" className="h-14 px-8 rounded-full text-base font-medium shadow-xl shadow-accent/20 hover:-translate-y-1 transition-transform flex items-center gap-2 mx-auto group/btn">
                                    Create your free account
                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <LandingFooter />
        </div>
    );
}

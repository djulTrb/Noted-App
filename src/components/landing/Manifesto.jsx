import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Manifesto() {
    const containerRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Background parallax/scale
            gsap.to(bgRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                scale: 1.15,
                ease: 'none'
            });

            // Split text roughly by span wrappers for word reveal
            const words = gsap.utils.toArray('.reveal-word');

            gsap.from(words, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 75%',
                },
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.08,
                ease: 'power4.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const Line2 = "Noted gets out of the way.".split(" ").map((word, i) => (
        <span key={i} className="reveal-word inline-block mr-3 md:mr-4">{word}</span>
    ));

    return (
        <section ref={containerRef} className="py-40 min-h-[80vh] w-full relative z-10 overflow-hidden flex items-center justify-center">
            {/* Dark elegant background with image overlay */}
            <div className="absolute inset-0 bg-[#0B0E14] -z-20"></div>
            <img
                ref={bgRef}
                src="/assets/manifesto-bg.jpg"
                alt="Abstract Background"
                className="absolute inset-0 w-full h-full object-cover opacity-20 -z-10 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-[#0B0E14] -z-10"></div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 text-center md:text-left flex flex-col items-center md:items-start">
                <p className="text-slate-300 text-2xl md:text-3xl font-medium mb-12 reveal-word inline-block max-w-3xl leading-relaxed text-center md:text-left">
                    Most note apps get in the way. They force you into rigid structures, overwhelm you with messy UI, and distract from the work.
                </p>
                <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-display italic text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-200 to-accent leading-[1.1] flex flex-wrap justify-center md:justify-start drop-shadow-2xl font-bold">
                    {Line2}
                </h2>
            </div>
        </section>
    );
}

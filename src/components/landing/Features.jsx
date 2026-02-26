import React from 'react';

const features = [
    {
        num: '01',
        label: 'Security',
        title: 'Encrypted Thoughts',
        description: 'Your notes are encrypted with AES-GCM 256-bit before leaving your device. A completely private, distraction-free environment for your most sensitive thoughts.',
        gradient: 'from-violet-500/20 via-transparent to-transparent',
        glowColor: 'bg-violet-500/30',
        labelColor: 'text-violet-400',
        numColor: 'text-violet-500/[0.07]',
    },
    {
        num: '02',
        label: 'Finance',
        title: 'Financial Tracking',
        description: 'Keep a transparent log of income and expenses. Understand your cash flow instantly.',
        gradient: 'from-emerald-500/20 via-transparent to-transparent',
        glowColor: 'bg-emerald-500/30',
        labelColor: 'text-emerald-400',
        numColor: 'text-emerald-500/[0.07]',
    },
    {
        num: '03',
        label: 'Productivity',
        title: 'Task Mastery',
        description: 'Organize your agenda alongside your thoughts. Track productivity with beautiful visual charts.',
        gradient: 'from-amber-500/20 via-transparent to-transparent',
        glowColor: 'bg-amber-500/30',
        labelColor: 'text-amber-400',
        numColor: 'text-amber-500/[0.07]',
    },
    {
        num: '04',
        label: 'Intelligence',
        title: 'AI Assist',
        description: 'Summon the built-in AI to brainstorm ideas, rewrite paragraphs, or generate imagery — directly inside the editor without leaving your flow.',
        gradient: 'from-sky-500/20 via-transparent to-transparent',
        glowColor: 'bg-sky-500/30',
        labelColor: 'text-sky-400',
        numColor: 'text-sky-500/[0.07]',
    },
];

export function Features() {
    return (
        <section className="py-16 md:py-28 px-6 max-w-6xl mx-auto w-full relative z-10">

            <div className="text-center mb-14 md:mb-20 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-custom bg-surface/60 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider text-secondary mb-5">
                    Core Capabilities
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-sans tracking-tight text-primary mb-4 max-w-2xl leading-[1.1]">
                    Everything you need,<br /><span className="text-accent">nothing you don't.</span>
                </h2>
                <p className="text-base md:text-lg text-secondary max-w-lg mx-auto leading-relaxed">
                    A focused toolkit to manage your digital life with uncompromising privacy.
                </p>
            </div>

            {/* Bento Grid — 3-column asymmetric */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-auto">

                {/* Card 1 — tall left */}
                <Card {...features[0]} className="md:row-span-2" />

                {/* Card 2 — top right */}
                <Card {...features[1]} className="md:col-span-2" />

                {/* Card 3 — bottom middle */}
                <Card {...features[2]} />

                {/* Card 4 — bottom right */}
                <Card {...features[3]} />

            </div>

        </section>
    );
}

function Card({ num, label, title, description, gradient, glowColor, labelColor, numColor, className = '' }) {
    return (
        <div
            className={`
                group relative rounded-[22px] border border-custom
                bg-surface overflow-hidden
                p-7 md:p-9 flex flex-col justify-end
                transition-all duration-500
                hover:border-transparent hover:shadow-2xl hover:shadow-black/10
                ${className}
            `}
            style={{ minHeight: '220px' }}
        >
            {/* Ambient corner glow */}
            <div className={`absolute -top-16 -left-16 w-48 h-48 ${glowColor} rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none`}></div>

            {/* Gradient wash */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

            {/* Giant background number */}
            <span
                className={`absolute -top-4 -right-2 font-sans font-black text-[10rem] leading-none select-none pointer-events-none ${numColor} transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2`}
                aria-hidden="true"
            >
                {num}
            </span>

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3">
                <span className={`text-xs font-bold uppercase tracking-[0.2em] ${labelColor}`}>
                    {label}
                </span>
                <h3 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-primary leading-snug">
                    {title}
                </h3>
                <p className="text-secondary leading-relaxed text-[0.84rem] max-w-md">
                    {description}
                </p>
            </div>
        </div>
    );
}

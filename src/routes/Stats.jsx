import React, { useMemo, useEffect, useRef } from 'react';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { AppHeader } from '../components/layout/AppHeader.jsx';
import { useStats } from '../queries/profile.js';
import { useNotes } from '../queries/notes.js';
import { useFetchTodos } from '../queries/todos.js';
import { useFetchExpenses } from '../queries/expenses.js';
import gsap from 'gsap';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

export default function Stats() {
    const { data: stats, isLoading: statsLoading } = useStats();
    const { data: notes, isLoading: notesLoading } = useNotes();
    const { data: todos, isLoading: todosLoading } = useFetchTodos();
    const { data: expenses, isLoading: expensesLoading } = useFetchExpenses();

    const isLoading = statsLoading || notesLoading || todosLoading || expensesLoading;
    const containerRef = useRef(null);

    // Entrance Animation
    useEffect(() => {
        if (isLoading || !containerRef.current) return;
        const ctx = gsap.context(() => {
            gsap.from('.stat-card', {
                opacity: 0,
                y: 16,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, [isLoading]);

    const activeDaysCount = stats?.activity_dates?.length || 0;

    // Derived: Current Streak
    const streak = useMemo(() => {
        if (!stats?.activity_dates || stats.activity_dates.length === 0) return 0;
        let currentStreak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sortedDates = [...stats.activity_dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const firstDate = new Date(sortedDates[0]);
        firstDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) return 0;

        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const current = new Date(sortedDates[i - 1]);
            const previous = new Date(sortedDates[i]);
            current.setHours(0, 0, 0, 0);
            previous.setHours(0, 0, 0, 0);
            const gap = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
            if (gap === 1) currentStreak++;
            else if (gap === 0) continue;
            else break;
        }
        return currentStreak;
    }, [stats?.activity_dates]);

    // Data Processor (Last 10 Days)
    const generateTimeline = (days = 10) => {
        const data = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            data.push({
                name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                timestamp: d.getTime()
            });
        }
        return data;
    };

    const notesData = useMemo(() => {
        if (!notes) return [];
        const dateCounts = {};
        notes.forEach(note => {
            const dateStr = new Date(note.created_on).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        });
        return generateTimeline(10).map(t => ({ name: t.name, Created: dateCounts[t.name] || 0 }));
    }, [notes]);

    const expensesData = useMemo(() => {
        if (!expenses) return [];
        const timeline = generateTimeline(10);
        const dayData = {};
        timeline.forEach(t => dayData[t.name] = { income: 0, expense: 0 });
        expenses.forEach(exp => {
            const d = new Date(exp.created_at || new Date());
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dayData[dateStr]) {
                if (exp.type === 'income') dayData[dateStr].income += Number(exp.amount);
                else dayData[dateStr].expense += Number(exp.amount);
            }
        });
        return timeline.map(t => ({
            name: t.name,
            Expenses: dayData[t.name].expense,
            Income: dayData[t.name].income
        }));
    }, [expenses]);

    const todosData = useMemo(() => {
        if (!todos) return [];
        const timeline = generateTimeline(10);
        const dayData = {};
        timeline.forEach(t => dayData[t.name] = { added: 0, completed: 0 });
        todos.forEach(todo => {
            const createdStr = new Date(todo.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dayData[createdStr]) {
                dayData[createdStr].added += 1;
                if (todo.completed) dayData[createdStr].completed += 1;
            }
        });
        return timeline.map(t => ({ name: t.name, Added: dayData[t.name].added, Completed: dayData[t.name].completed }));
    }, [todos]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-elevated/90 backdrop-blur-md border border-custom p-4 rounded-xl shadow-xl">
                    <p className="text-secondary text-sm mb-3 font-medium">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} className="font-bold text-sm flex items-center justify-between gap-6" style={{ color: entry.color }}>
                            <span className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
                                {entry.name}
                            </span>
                            <span>{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex h-screen bg-main relative">
            <Sidebar />
            <MobileDrawer />

            <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                <AppHeader title="Statistiques" />

                <div className="flex-1 overflow-y-auto w-full p-6 md:p-10 pb-40 flex flex-col items-center">
                    <div ref={containerRef} className="w-full max-w-5xl flex flex-col gap-8 h-full">

                        <div className="stat-card">
                            <h2 className="text-3xl font-display font-bold text-primary mb-2">Your Data Trajectory</h2>
                            <p className="text-muted text-lg">A deep-dive into your creation and tracking habits over the last 10 days.</p>
                        </div>

                        {isLoading ? (
                            <div className="stat-card flex items-center justify-center p-12">
                                <div className="animate-pulse w-8 h-8 rounded-full bg-accent opacity-50"></div>
                            </div>
                        ) : (
                            <>
                                {/* Top KPI Cards — 2 columns */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="stat-card bg-surface border border-custom rounded-[20px] p-8 shadow-sm relative overflow-hidden group">
                                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl group-hover:bg-blue-400/10 transition-colors"></div>
                                        <p className="text-sm text-secondary font-medium uppercase tracking-widest mb-3">Active Days</p>
                                        <p className="text-6xl font-display font-bold text-primary leading-none">{activeDaysCount}</p>
                                        <div className="mt-8 pt-4 border-t border-custom border-dashed">
                                            <p className="text-xs text-muted">Days you've interacted with Noted.</p>
                                        </div>
                                    </div>
                                    <div className="stat-card bg-surface border border-custom rounded-[20px] p-8 shadow-sm relative overflow-hidden group">
                                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-orange-400/5 rounded-full blur-2xl group-hover:bg-orange-400/10 transition-colors"></div>
                                        <p className="text-sm text-secondary font-medium uppercase tracking-widest mb-3">Current Streak</p>
                                        <div className="flex items-end gap-3">
                                            <p className="text-6xl font-display font-bold text-primary leading-none text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-500">{streak}</p>
                                            <span className="text-xl font-medium mb-1 text-secondary">days</span>
                                        </div>
                                        <div className="mt-8 pt-4 border-t border-custom border-dashed">
                                            <p className="text-xs text-muted">Consecutive days of writing.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Bento-box Charts Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

                                    {/* Notes Velocity Chart */}
                                    <div className="stat-card bg-surface border border-custom rounded-[20px] p-6 sm:p-8 shadow-sm">
                                        <h3 className="text-lg font-bold font-sans text-primary mb-6">Notes Created</h3>
                                        <div className="w-full h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={notesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={false} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="Created" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorNotes)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Finance Tracker Chart */}
                                    <div className="stat-card bg-surface border border-custom rounded-[20px] p-6 sm:p-8 shadow-sm">
                                        <h3 className="text-lg font-bold font-sans text-primary mb-6">Cashflow Tracker</h3>
                                        <div className="w-full h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={expensesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#FB7185" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#FB7185" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={false} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="Income" stroke="#34D399" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                                    <Area type="monotone" dataKey="Expenses" stroke="#FB7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Tasks Chart */}
                                    <div className="stat-card bg-surface border border-custom rounded-[20px] p-6 sm:p-8 shadow-sm">
                                        <h3 className="text-lg font-bold font-sans text-primary mb-6">To-Do Completion</h3>
                                        <div className="w-full h-56">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart data={todosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <defs>
                                                        <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                                                            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                                                        </linearGradient>
                                                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                                                    <YAxis axisLine={false} tickLine={false} tick={false} />
                                                    <Tooltip content={<CustomTooltip />} />
                                                    <Area type="monotone" dataKey="Added" stroke="#9CA3AF" strokeWidth={2} fillOpacity={1} fill="url(#colorAdded)" />
                                                    <Area type="monotone" dataKey="Completed" stroke="#FB923C" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

import React, { useState } from 'react';
import { Plus, DollarSign, Trash2, TrendingDown, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';
import { useFetchExpenses, useCreateExpense, useDeleteExpense } from '../queries/expenses.js';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { useUiStore } from '../stores/uiStore.js';
import { Menu } from 'lucide-react';


export default function Expenses() {
    const { data: expenses = [], isLoading } = useFetchExpenses();
    const createExpense = useCreateExpense();
    const deleteExpenseMutation = useDeleteExpense();
    const setDrawerOpen = useUiStore((state) => state.setMobileDrawerOpen);

    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim() || !amount || createExpense.isPending) return;

        createExpense.mutate(
            { title: title.trim(), amount: parseFloat(amount), type },
            {
                onSuccess: () => {
                    setTitle('');
                    setAmount('');
                }
            }
        );
    };

    const deleteExpense = (id) => {
        deleteExpenseMutation.mutate(id);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const totalIncome = expenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const totalExpenses = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const netBalance = totalIncome - totalExpenses;

    return (
        <div className="flex h-screen bg-main relative">
            <Sidebar />
            <MobileDrawer />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 flex items-center gap-4">
                            <button onClick={() => setDrawerOpen(true)} className="md:hidden w-10 h-10 rounded-full bg-surface border border-custom flex items-center justify-center text-muted hover:text-primary hover:border-accent/50 transition-colors">
                                <Menu size={20} />
                            </button>
                            Finance Tracker
                        </h1>
                        <p className="text-secondary text-lg ml-14">Track your income and expenses easily.</p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                        <div className="bg-surface p-6 rounded-2xl border border-custom shadow-sm flex flex-col justify-center">
                            <p className="text-sm font-medium text-muted mb-1">Net Balance</p>
                            <p className={cn("text-3xl font-bold", netBalance >= 0 ? "text-primary" : "text-danger")}>
                                ${netBalance.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl border border-custom shadow-sm flex flex-col justify-center">
                            <p className="text-sm font-medium text-muted mb-1">Income</p>
                            <p className="text-2xl font-bold text-emerald-500">${totalIncome.toFixed(2)}</p>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl border border-custom shadow-sm flex flex-col justify-center">
                            <p className="text-sm font-medium text-muted mb-1">Expenses</p>
                            <p className="text-2xl font-bold text-danger">${totalExpenses.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl border border-custom shadow-sm overflow-hidden p-6 md:p-8">
                        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 mb-8">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Transaction title..."
                                className="flex-1 bg-elevated border-none rounded-xl px-4 py-3 text-primary placeholder:text-muted focus:ring-2 focus:ring-accent outline-none font-medium transition-shadow"
                            />
                            <div className="relative flex-1 md:max-w-[200px]">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                                    <DollarSign size={18} />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-elevated border-none rounded-xl pl-10 pr-4 py-3 text-primary placeholder:text-muted focus:ring-2 focus:ring-accent outline-none font-medium transition-shadow"
                                />
                            </div>
                            <div className="flex-1 md:max-w-[150px]">
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full bg-elevated border-none rounded-xl px-4 py-3 text-primary focus:ring-2 focus:ring-accent outline-none font-medium transition-shadow appearance-none cursor-pointer"
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <Button type="submit" variant="primary" className="shrink-0 group">
                                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                                Add
                            </Button>
                        </form>

                        <div className="flex flex-col gap-3">
                            {isLoading ? (
                                <div className="py-12 flex justify-center text-accent">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : expenses.length === 0 ? (
                                <div className="py-12 text-center text-muted">
                                    <p>No transactions logged.</p>
                                </div>
                            ) : (
                                expenses.map((expense) => (
                                    <div
                                        key={expense.id}
                                        className={cn(
                                            "group flex items-center justify-between p-4 rounded-xl border hover:shadow-sm transition-all duration-200 bg-surface",
                                            expense.type === 'income' ? "border-emerald-500/20 hover:border-emerald-500/50" : "border-danger/20 hover:border-danger/50"
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-base font-medium text-primary mb-1">{expense.title}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-xs px-2 py-0.5 rounded-md font-medium capitalize",
                                                    expense.type === 'income' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-danger/10 text-danger"
                                                )}>
                                                    {expense.type}
                                                </span>
                                                <span className="text-xs text-muted">{formatDate(expense.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={cn(
                                                "text-lg font-bold",
                                                expense.type === 'income' ? "text-emerald-500" : "text-primary"
                                            )}>
                                                {expense.type === 'income' ? '+' : '-'}${Number(expense.amount).toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => deleteExpense(expense.id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                                aria-label="Delete expense"
                                                disabled={deleteExpenseMutation.isPending}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

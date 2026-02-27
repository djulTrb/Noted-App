import React, { useState } from 'react';
import { Plus, Check, Trash2, Calendar, Loader2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';
import { useFetchTodos, useCreateTodo, useUpdateTodo, useDeleteTodo } from '../queries/todos.js';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { useUiStore } from '../stores/uiStore.js';
import { Menu } from 'lucide-react';


export default function TodoList() {
    const { data: todos = [], isLoading } = useFetchTodos();
    const { mutate: createTodoMutate, isPending: isCreating } = useCreateTodo();
    const { mutate: updateTodoMutate, isPending: isUpdating } = useUpdateTodo();
    const { mutate: deleteTodoMutate, isPending: isDeleting } = useDeleteTodo();
    const setDrawerOpen = useUiStore((state) => state.setMobileDrawerOpen);

    const [newTodo, setNewTodo] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTodo.trim() || isCreating) return;
        createTodoMutate(newTodo.trim(), {
            onSuccess: () => setNewTodo('')
        });
    };

    const toggleTodo = (id, currentStatus) => {
        if (isUpdating) return;
        updateTodoMutate({ id, completed: !currentStatus });
    };

    const deleteTodo = (id) => {
        if (isDeleting) return;
        deleteTodoMutate(id);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex h-screen bg-main relative">
            <Sidebar />
            <MobileDrawer />
            <main className="flex-1 overflow-y-auto w-full">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <header className="mb-12 flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4 flex items-center gap-4">
                                <button onClick={() => setDrawerOpen(true)} className="md:hidden w-10 h-10 rounded-full bg-surface border border-custom flex items-center justify-center text-muted hover:text-primary hover:border-accent/50 transition-colors">
                                    <Menu size={20} />
                                </button>
                                To-Do List
                            </h1>
                            <p className="text-secondary text-lg ml-14">Stay organized and get things done.</p>
                        </div>
                    </header>

                    <div className="bg-surface rounded-2xl border border-custom shadow-sm overflow-hidden p-6 md:p-8">
                        <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                            <input
                                type="text"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="What needs to be done?"
                                className="flex-1 bg-elevated border-none rounded-xl px-4 py-3 text-primary placeholder:text-muted focus:ring-2 focus:ring-accent outline-none font-medium transition-shadow"
                            />
                            <Button type="submit" variant="primary" className="shrink-0 group" disabled={isCreating}>
                                {isCreating ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                        Add Task
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="flex flex-col gap-3">
                            {isLoading ? (
                                <div className="py-12 flex justify-center text-accent">
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                </div>
                            ) : todos.length === 0 ? (
                                <div className="py-12 text-center text-muted">
                                    <p>No tasks yet. Enjoy your day!</p>
                                </div>
                            ) : (
                                todos.map((todo) => (
                                    <div
                                        key={todo.id}
                                        className={cn(
                                            "group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
                                            todo.completed ? "bg-elevated/50 border-transparent" : "bg-surface border-custom hover:border-accent/30 hover:shadow-sm"
                                        )}
                                    >
                                            <button
                                                onClick={() => toggleTodo(todo.id, todo.completed)}
                                                className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                                    todo.completed ? "bg-accent border-accent text-white" : "border-custom text-transparent hover:border-accent/50",
                                                    (isUpdating || isDeleting) && "opacity-60 cursor-wait"
                                                )}
                                                disabled={isUpdating || isDeleting}
                                            >
                                            <Check size={14} className={todo.completed ? "opacity-100" : "opacity-0"} />
                                        </button>

                                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                                            <span className={cn(
                                                "text-base font-medium truncate transition-colors",
                                                todo.completed ? "text-muted line-through" : "text-primary"
                                            )}>
                                                {todo.text}
                                            </span>
                                            <div className="flex items-center gap-1.5 text-xs text-muted shrink-0">
                                                <Calendar size={14} />
                                                <span>{formatDate(todo.created_at)}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            aria-label="Delete task"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
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

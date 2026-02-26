import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useRHForm } from 'react-hook-form';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuthStore } from '../stores/authStore.js';

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least 1 number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 special character')
});

import { ChevronLeft } from 'lucide-react';

export default function Signup() {
    const navigate = useNavigate();
    const signUp = useAuthStore((state) => state.signUp);
    const [authError, setAuthError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useRHForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setAuthError('');
        const { error } = await signUp(data.email, data.password, data.username);

        if (error) {
            setAuthError(error.message);
            gsap.fromTo('.auth-error', { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.2 });
        } else {
            // Supabase by default auto-signs you in if not demanding email confirmation
            navigate('/notes', { replace: true });
        }
    };

    return (
        <div className="w-full min-h-screen bg-main flex items-center justify-center p-6 relative">
            <div className="absolute top-6 left-6 md:top-10 md:left-10">
                <Link to="/" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm font-medium py-2 px-3 rounded-lg hover:bg-surface border border-transparent hover:border-custom">
                    <ChevronLeft size={16} />
                    Back to Home
                </Link>
            </div>

            <div className="w-full max-w-md bg-surface border border-custom rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold font-sans text-primary mb-2 text-center">Create your notebook</h2>
                <p className="text-secondary text-center mb-8">Join Noted and start writing instantly.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    <Input
                        label="Display Name"
                        type="text"
                        placeholder="How should we call you?"
                        {...register('username')}
                        error={errors.username?.message}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                    />

                    {authError && (
                        <div className="auth-error text-danger text-sm font-medium bg-danger/10 p-3 rounded-lg border border-danger/20 text-center">
                            {authError}
                        </div>
                    )}

                    <Button type="submit" variant="primary" className="w-full h-12 mt-2" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </Button>
                </form>

                <p className="text-center text-sm text-secondary mt-6">
                    Already have an account? <Link to="/login" className="text-accent hover:underline font-medium">Log in</Link>
                </p>
            </div>
        </div>
    );
}

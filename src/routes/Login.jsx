import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { useAuthStore } from '../stores/authStore.js';

const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
});

import { ChevronLeft } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const signIn = useAuthStore((state) => state.signIn);
    const [authError, setAuthError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setAuthError('');
        const { error } = await signIn(data.email, data.password);

        if (error) {
            setAuthError(error.message);
            gsap.fromTo('.auth-error', { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.2 });
        } else {
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
                <h2 className="text-2xl font-bold font-sans text-primary mb-2 text-center">Welcome back</h2>
                <p className="text-secondary text-center mb-8">Sign in to access your notebook.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <p className="text-center text-sm text-secondary mt-6">
                    Don't have an account? <Link to="/signup" className="text-accent hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
}

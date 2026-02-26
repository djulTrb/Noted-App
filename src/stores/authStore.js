import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

export const useAuthStore = create((set, get) => ({
    session: null,
    user: null,
    isInitialized: false,

    initialize: () => {
        // 1. Call getSession first
        supabase.auth.getSession().then(({ data: { session } }) => {
            set({ session, user: session?.user || null, isInitialized: true });
        });

        // 2. Subscribe to changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                set({ session, user: session?.user || null });
                if (_event === 'SIGNED_OUT') {
                    // Clear queries and ui state via custom event or global reset if needed
                    window.dispatchEvent(new Event('app:signout'));
                }
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    },

    signIn: async (email, password) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },

    signUp: async (email, password, username) => {
        const res = await supabase.auth.signUp({
            email,
            password,
            // Pass the username as metadata. Usually we then create the profile via webhook or trigger,
            // but if the app doesn't have it, we insert manually after success.
            options: { data: { username } }
        });

        // Auto-create user profile row to conform with existing DB
        if (res.data.user) {
            await supabase.from('User Informations').insert({
                id: res.data.user.id,
                username: username,
            });
            await supabase.from('statistics related').insert({
                id_user: res.data.user.id,
            });
        }
        return res;
    },

    signOut: async () => {
        return await supabase.auth.signOut();
    }
}));

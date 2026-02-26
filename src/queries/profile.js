import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { useAuthStore } from '../stores/authStore.js';

export function useProfile() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('User Informations')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        },
        enabled: !!user?.id,
    });
}

export function useStats() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['stats', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('statistics related')
                .select('*')
                .eq('id_user', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data || null;
        },
        enabled: !!user?.id,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (updates) => {
            const { data, error } = await supabase
                .from('User Informations')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(['profile', user?.id], updatedProfile);
        },
    });
}

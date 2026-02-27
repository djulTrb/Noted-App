import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export function useFetchTodos() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['todos', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('id_user', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });
}

export function useCreateTodo() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (text) => {
            if (!user) throw new Error("Must be logged in");
            const { data, error } = await supabase
                .from('todos')
                .insert([{ text, id_user: user.id }])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
        },
    });
}

export function useUpdateTodo() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async ({ id, completed }) => {
            const { data, error } = await supabase
                .from('todos')
                .update({ completed })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
        },
    });
}

export function useDeleteTodo() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos', user?.id] });
        },
    });
}

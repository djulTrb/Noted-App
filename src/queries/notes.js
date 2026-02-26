import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase.js';
import { encrypt, decrypt } from '../lib/crypto.js';
import { useAuthStore } from '../stores/authStore.js';
import { v4 as uuidv4 } from 'uuid';

export function useNotes() {
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['notes', user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('id_user', user.id)
                .order('created_on', { ascending: false });

            if (error) throw error;

            return Promise.all(data.map(async (note) => ({
                ...note,
                title: await decrypt(note.title),
                text_value: await decrypt(note.text_value),
                tags: note.tags ? note.tags.map(t => {
                    try { return JSON.parse(t); } catch (e) { return t; }
                }) : []
            })));
        },
        enabled: !!user?.id,
    });
}

export function useNote(idNote) {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useQuery({
        queryKey: ['note', idNote],
        queryFn: async () => {
            // First try to find it in the cache to avoid a network hop if we already have it
            const cachedNotes = queryClient.getQueryData(['notes', user?.id]);
            if (cachedNotes) {
                const cachedNote = cachedNotes.find((n) => n.id_note === idNote);
                if (cachedNote) return cachedNote;
            }

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('id_note', idNote)
                .eq('id_user', user.id)
                .single();

            if (error) throw error;

            return {
                ...data,
                title: await decrypt(data.title),
                text_value: await decrypt(data.text_value),
                tags: data.tags ? data.tags.map(t => {
                    try { return JSON.parse(t); } catch (e) { return t; }
                }) : []
            };
        },
        enabled: !!user?.id && !!idNote,
    });
}

export function useSaveNote() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async ({ title, content, tags }) => {
            const id_note = uuidv4();
            const gradient_id = Math.floor(Math.random() * 11) + 1; // 1-11
            const encTitle = await encrypt(title);
            const encContent = await encrypt(content);
            const stringifiedTags = tags.map(t => JSON.stringify(t));

            const newNoteData = {
                id_user: user.id,
                id_note,
                gradient_id,
                title: encTitle,
                text_value: encContent,
                tags: stringifiedTags,
                created_on: new Date().toISOString(),
                updated_last_on: new Date().toISOString()
            };

            // 1. Get current stats to increment securely, or just let DB do it via RPC if needed.
            // But we just read stats out, add to array, and UPSERT.
            const { data: statsData } = await supabase
                .from('statistics related')
                .select('*')
                .eq('id_user', user.id)
                .single();

            const today = new Date().toISOString().split('T')[0];
            const newDates = statsData?.activity_dates || [];
            if (!newDates.includes(today)) newDates.push(today);
            const newNbrNotes = (statsData?.nbr_notes || 0) + 1;

            // 2. Batch write
            const [noteRes, statsRes] = await Promise.all([
                supabase.from('notes').insert(newNoteData).select().single(),
                supabase.from('statistics related').upsert({
                    id_user: user.id,
                    nbr_notes: newNbrNotes,
                    activity_dates: newDates
                }, { onConflict: 'id_user' }).select().single()
            ]);

            if (noteRes.error) throw noteRes.error;
            if (statsRes.error) throw statsRes.error;

            return {
                ...noteRes.data,
                title,
                text_value: content,
                tags
            };
        },
        onMutate: async (newNote) => {
            await queryClient.cancelQueries({ queryKey: ['notes', user?.id] });
            const previous = queryClient.getQueryData(['notes', user?.id]);

            const optimisticNote = {
                id: Date.now(),
                id_user: user.id,
                id_note: 'temp-' + Date.now(),
                gradient_id: Math.floor(Math.random() * 11) + 1,
                title: newNote.title,
                text_value: newNote.content,
                tags: newNote.tags || [],
                created_on: new Date().toISOString(),
                updated_last_on: new Date().toISOString()
            };

            queryClient.setQueryData(['notes', user?.id], (old) => {
                return old ? [optimisticNote, ...old] : [optimisticNote];
            });

            return { previous };
        },
        onError: (err, newNote, context) => {
            queryClient.setQueryData(['notes', user?.id], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['stats', user?.id] });
        },
    });
}

export function useUpdateNote() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async ({ id_note, title, content, tags }) => {
            const encTitle = await encrypt(title);
            const encContent = await encrypt(content);
            const stringifiedTags = tags.map(t => JSON.stringify(t));

            const { data, error } = await supabase
                .from('notes')
                .update({
                    title: encTitle,
                    text_value: encContent,
                    tags: stringifiedTags,
                    updated_last_on: new Date().toISOString()
                })
                .eq('id_note', id_note)
                .eq('id_user', user.id)
                .select()
                .single();

            if (error) throw error;

            return {
                ...data,
                title,
                text_value: content,
                tags
            };
        },
        onMutate: async (updatedNote) => {
            await queryClient.cancelQueries({ queryKey: ['notes', user?.id] });
            const previous = queryClient.getQueryData(['notes', user?.id]);

            queryClient.setQueryData(['notes', user?.id], (old) => {
                if (!old) return old;
                return old.map(note =>
                    note.id_note === updatedNote.id_note
                        ? { ...note, title: updatedNote.title, text_value: updatedNote.content, tags: updatedNote.tags, updated_last_on: new Date().toISOString() }
                        : note
                );
            });

            return { previous };
        },
        onError: (err, updatedNote, context) => {
            queryClient.setQueryData(['notes', user?.id], context.previous);
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
            if (data) {
                queryClient.invalidateQueries({ queryKey: ['note', data.id_note] });
            }
        },
    });
}

export function useDeleteNote() {
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);

    return useMutation({
        mutationFn: async (id_note) => {
            const { error } = await supabase
                .from('notes')
                .delete()
                .eq('id_note', id_note)
                .eq('id_user', user.id);

            if (error) throw error;
            return id_note;
        },
        onMutate: async (id_note) => {
            await queryClient.cancelQueries({ queryKey: ['notes', user?.id] });
            const previous = queryClient.getQueryData(['notes', user?.id]);

            queryClient.setQueryData(['notes', user?.id], (old) => {
                return old ? old.filter(note => note.id_note !== id_note) : old;
            });

            return { previous };
        },
        onError: (err, id_note, context) => {
            queryClient.setQueryData(['notes', user?.id], context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['notes', user?.id] });
            queryClient.invalidateQueries({ queryKey: ['stats', user?.id] }); // Stats might update via DB trigger, best to refetch.
        },
    });
}

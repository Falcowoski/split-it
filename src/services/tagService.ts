import { supabase } from './supabase';
import { Tag } from '../types';

export const tagService = {
    async getAll(): Promise<Tag[]> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .is('deleted_at', null)
            .order('name');

        if (error) throw error;
        return data as Tag[];
    },

    async getById(id: string): Promise<Tag | null> {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as Tag;
    },

    async create(name: string, color: string): Promise<Tag> {
        const { data, error } = await supabase
            .from('tags')
            .insert([{ name, color }])
            .select()
            .single();

        if (error) throw error;
        return data as Tag;
    },

    async update(id: string, name: string, color: string): Promise<Tag> {
        const { data, error } = await supabase
            .from('tags')
            .update({ name, color, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Tag;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('tags')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};

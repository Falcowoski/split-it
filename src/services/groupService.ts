// src/services/groupService.ts
import { supabase } from './supabase';
import { Group } from '../types';

export const groupService = {
    async getAll(): Promise<Group[]> {
        const { data, error } = await supabase
            .from('groups')
            .select('*, expenses(*)')
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Group[];
    },

    async getById(id: string): Promise<Group | null> {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as Group;
    },

    async create(name: string): Promise<Group> {
        const { data, error } = await supabase
            .from('groups')
            .insert([{ name }])
            .select()
            .single();

        if (error) throw error;
        return data as Group;
    },

    async update(id: string, name: string): Promise<Group> {
        const { data, error } = await supabase
            .from('groups')
            .update({ name, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Group;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('groups')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};

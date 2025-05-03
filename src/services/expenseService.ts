// src/services/expenseService.ts
import { supabase } from './supabase';
import { Expense } from '../types';

export const expenseService = {
    async getAllByGroupId(groupId: string): Promise<Expense[]> {
        const { data, error } = await supabase
            .from('expenses')
            .select(
                `
        *,
        user:user_id(id, name),
        payment_method:payment_method_id(id, name, color)
      `,
            )
            .eq('group_id', groupId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Expense[];
    },

    async getById(id: string): Promise<Expense | null> {
        const { data, error } = await supabase
            .from('expenses')
            .select(
                `
        *,
        user:user_id(id, name),
        payment_method:payment_method_id(id, name, color)
      `,
            )
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as Expense;
    },

    async create(expense: {
        group_id: string;
        user_id: string;
        payment_method_id: string;
        name: string;
        amount: number;
    }): Promise<Expense> {
        const { data, error } = await supabase
            .from('expenses')
            .insert([expense])
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    },

    async update(
        id: string,
        expense: {
            user_id: string;
            payment_method_id: string;
            name: string;
            amount: number;
        },
    ): Promise<Expense> {
        const { data, error } = await supabase
            .from('expenses')
            .update({ ...expense, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Expense;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('expenses')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};

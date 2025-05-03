// src/services/expenseService.ts
import { supabase } from './supabase';
import { Expense, Tag } from '../types';

export const expenseService = {
    async getAllByGroupId(groupId: string): Promise<Expense[]> {
        const { data, error } = await supabase
            .from('expenses')
            .select(
                `
            *,
            user:user_id(id, name),
            payment_method:payment_method_id(id, name, color),
            expense_tags:expense_tags(tags(id, name, color))
        `,
            )
            .eq('group_id', groupId)
            .is('deleted_at', null)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return data.map((item) => ({
            ...item,
            tags: item.expense_tags.map((expenseTag: any) => expenseTag.tags),
        })) as Expense[];
    },

    // TODO: Add `tags` property
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

    async createTags(id: Expense['id'], tags: Tag['id'][]): Promise<void> {
        const expenseTags = tags.map((tag) => ({
            expense_id: id,
            tag_id: tag,
        }));

        const { error } = await supabase
            .from('expense_tags')
            .insert(expenseTags);

        if (error) throw error;
    },

    async create(
        expense: {
            group_id: string;
            user_id: string;
            payment_method_id: string;
            name: string;
            amount: number;
        },
        tags: Tag['id'][],
    ): Promise<Expense> {
        const { data, error } = await supabase
            .from('expenses')
            .insert([expense])
            .select()
            .single();

        if (error) throw error;

        if (tags.length > 0) await this.createTags(data.id, tags);

        return data as Expense;
    },

    async removeTags(id: Expense['id']): Promise<void> {
        const { error } = await supabase
            .from('expense_tags')
            .delete()
            .eq('expense_id', id);

        if (error) throw error;
    },

    async updateTags(id: Expense['id'], tags: Tag['id'][]): Promise<void> {
        await this.removeTags(id);

        if (tags.length > 0) await this.createTags(id, tags);
    },

    async update(
        id: string,
        expense: {
            user_id: string;
            payment_method_id: string;
            name: string;
            amount: number;
        },
        tags: Tag['id'][],
    ): Promise<Expense> {
        const { data, error } = await supabase
            .from('expenses')
            .update({ ...expense, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        await this.updateTags(data.id, tags);

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

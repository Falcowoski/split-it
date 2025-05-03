// src/services/paymentMethodService.ts
import { supabase } from './supabase';
import { PaymentMethod } from '../types';

export const paymentMethodService = {
    async getAll(): Promise<PaymentMethod[]> {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .is('deleted_at', null)
            .order('name');

        if (error) throw error;
        return data as PaymentMethod[];
    },

    async getById(id: string): Promise<PaymentMethod | null> {
        const { data, error } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error) throw error;
        return data as PaymentMethod;
    },

    async create(name: string, color: string): Promise<PaymentMethod> {
        const { data, error } = await supabase
            .from('payment_methods')
            .insert([{ name, color }])
            .select()
            .single();

        if (error) throw error;
        return data as PaymentMethod;
    },

    async update(
        id: string,
        name: string,
        color: string,
    ): Promise<PaymentMethod> {
        const { data, error } = await supabase
            .from('payment_methods')
            .update({ name, color, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as PaymentMethod;
    },

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from('payment_methods')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;
    },
};

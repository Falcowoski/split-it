export type User = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

/** @example '#RRGGBB' */
type Color = string;

export type PaymentMethod = {
    id: string;
    name: string;
    color: Color;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type Tag = {
    id: string;
    name: string;
    color: Color;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type Group = {
    id: string;
    name: string;
    expenses?: Expense[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
};

export type Expense = {
    id: string;
    group_id: string;
    user_id: string;
    payment_method_id: string;
    name: string;
    amount: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;

    // Relacionamentos (opcionais)
    group?: Group;
    user?: User;
    payment_method?: PaymentMethod;
    tags?: Tag[];
};

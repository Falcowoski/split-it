// src/types/index.ts

// Usuário
export type User = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  
  // Método de Pagamento
  export type PaymentMethod = {
    id: string;
    name: string;
    color: string; // formato hexadecimal: #RRGGBB
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  
  // Grupo
  export type Group = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  
  // Despesa
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
  };
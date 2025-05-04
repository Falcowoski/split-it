import React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { User, PaymentMethod, Tag } from '../../types';
import { TextField } from '../../components/ui/TextField';
import { SelectField } from '../../components/ui/SelectField';
import { MultiSelectField } from '../../components/ui/MultiSelectField';

type FormData = {
    name: string;
    amount: string;
    userId: string;
    paymentMethodId: string;
    tags: Tag['id'][];
};

type ExpenseFieldsProps = {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    users: User[];
    paymentMethods: PaymentMethod[];
    tags: Tag[];
};

export default function ExpenseFields({
    control,
    errors,
    users,
    paymentMethods,
    tags,
}: ExpenseFieldsProps) {
    const userOptions = users.map((user) => ({
        label: user.name,
        value: user.id,
    }));

    const paymentMethodOptions = paymentMethods.map((method) => ({
        label: method.name,
        value: method.id,
    }));

    const tagOptions = tags.map((tag) => ({
        label: tag.name,
        value: tag.id,
    }));

    return (
        <>
            <Controller
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Nome"
                        placeholder="Digite o nome da despesa"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.name?.message}
                    />
                )}
                name="name"
            />

            <Controller
                control={control}
                rules={{
                    required: 'Valor é obrigatório',
                    pattern: {
                        value: /^[0-9]+([,.][0-9]{1,2})?$/,
                        message: 'Digite um valor válido',
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Valor (R$)"
                        placeholder="Digite o valor da despesa"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.amount?.message}
                        keyboardType="numeric"
                    />
                )}
                name="amount"
            />

            <Controller
                control={control}
                rules={{ required: 'Usuário é obrigatório' }}
                render={({ field: { value, onChange } }) => (
                    <SelectField
                        label="Quem pagou"
                        options={userOptions}
                        selectedValue={value}
                        onValueChange={onChange}
                        error={errors.userId?.message}
                    />
                )}
                name="userId"
            />

            <Controller
                control={control}
                rules={{ required: 'Forma de pagamento é obrigatória' }}
                render={({ field: { value, onChange } }) => (
                    <SelectField
                        label="Forma de pagamento"
                        options={paymentMethodOptions}
                        selectedValue={value}
                        onValueChange={onChange}
                        error={errors.paymentMethodId?.message}
                    />
                )}
                name="paymentMethodId"
            />

            <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange } }) => (
                    <MultiSelectField
                        label="Tags"
                        options={tagOptions}
                        selectedValues={value}
                        onValuesChange={onChange}
                    />
                )}
            />
        </>
    );
}

// Exportamos o tipo FormData para ser reutilizado
export type { FormData };

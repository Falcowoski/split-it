import React from 'react';
import { Text, View } from 'react-native';
import { formatCurrency } from '../../helpers/Number.helper';
import { Expense } from '../../types';
import { filterUniqueUsers } from '../../helpers/User.helper';
import { tv } from 'tailwind-variants';

type TotalExpensesItemProps = {
    name: string;
    expenses: Expense[];
    /** @default 'md' */
    size?: 'sm' | 'md';
};

type TotalExpenseProps = { expenses: Expense[] };

const item = tv({
    slots: {
        container: 'flex-row items-center justify-between',
        label: null,
        value: null,
    },
    variants: {
        size: {
            sm: {
                label: 'text-sm text-neutral-500',
                value: 'text-sm text-neutral-500',
            },
            md: {
                label: 'text-neutral-600',
                value: 'text-xl font-bold',
            },
        },
    },
});

const TotalExpensesItem = ({
    name,
    expenses,
    size = 'md',
}: TotalExpensesItemProps) => {
    const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
    );

    const { container, label, value } = item({ size });

    return (
        <View className={container()}>
            <Text className={label()}>{name}:</Text>
            <Text className={value()}>{formatCurrency(totalAmount)}</Text>
        </View>
    );
};

export function TotalExpenses({ expenses }: TotalExpenseProps) {
    const users = expenses
        .map((expense) => expense.user)
        .filter((user) => user !== undefined);

    const uniqueUsers = filterUniqueUsers(users);

    const items = uniqueUsers.map((user) => (
        <TotalExpensesItem
            key={user.id}
            name={user.name}
            expenses={expenses.filter((expense) => expense.user_id === user.id)}
            size="sm"
        />
    ));

    return (
        <View className="flex gap-2">
            <TotalExpensesItem key="total" name="Total" expenses={expenses} />

            <View className="flex gap-1">{items}</View>
        </View>
    );
}

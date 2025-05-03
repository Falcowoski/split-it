// src/screens/expenses/CreateExpenseScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { expenseService } from '../../services/expenseService';
import { userService } from '../../services/userService';
import { paymentMethodService } from '../../services/paymentMethodService';
import { User, PaymentMethod } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { RootStackParamList } from '../../navigation';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { SelectField } from '../../components/ui/SelectField';
import { useToast } from '../../providers/ToastProvider';

type CreateExpenseScreenRouteProp = RouteProp<
    RootStackParamList,
    'CreateExpense'
>;

type FormData = {
    name: string;
    amount: string;
    userId: string;
    paymentMethodId: string;
};

export default function CreateExpenseScreen() {
    const navigation = useNavigation();
    const route = useRoute<CreateExpenseScreenRouteProp>();
    const { groupId } = route.params;
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            amount: '',
            userId: '',
            paymentMethodId: '',
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [usersData, paymentMethodsData] = await Promise.all([
                    userService.getAll(),
                    paymentMethodService.getAll(),
                ]);

                setUsers(usersData);
                setPaymentMethods(paymentMethodsData);

                // Definir valores padrão se houver dados
                if (usersData.length > 0) {
                    setValue('userId', usersData[0].id);
                }

                if (paymentMethodsData.length > 0) {
                    setValue('paymentMethodId', paymentMethodsData[0].id);
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                showToast(
                    'Não foi possível carregar os dados necessários',
                    'error',
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setValue]);

    // src/screens/expenses/CreateExpenseScreen.tsx (continuação)
    const onSubmit = async (data: FormData) => {
        try {
            // Validar se há usuários e formas de pagamento cadastrados
            if (!data.userId) {
                showToast(
                    'Selecione um usuário responsável pela despesa',
                    'error',
                );
                return;
            }

            if (!data.paymentMethodId) {
                showToast('Selecione uma forma de pagamento', 'error');
                return;
            }

            const amount = parseFloat(data.amount.replace(',', '.'));

            if (isNaN(amount) || amount <= 0) {
                showToast('Digite um valor válido para a despesa', 'error');
                return;
            }

            await expenseService.create({
                group_id: groupId,
                user_id: data.userId,
                payment_method_id: data.paymentMethodId,
                name: data.name,
                amount,
            });

            showToast('Despesa criada com sucesso', 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            showToast('Não foi possível criar a despesa', 'error');
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    // Verificar se há usuários e formas de pagamento cadastrados
    if (users.length === 0 || paymentMethods.length === 0) {
        return (
            <View className="flex-1 p-4 bg-neutral-50 items-center justify-center">
                <Text className="text-xl font-bold mb-4">
                    Não é possível criar uma despesa
                </Text>
                <Text className="text-center mb-6 text-neutral-600">
                    {users.length === 0
                        ? 'É necessário cadastrar pelo menos um usuário.'
                        : ''}
                    {paymentMethods.length === 0
                        ? '\nÉ necessário cadastrar pelo menos uma forma de pagamento.'
                        : ''}
                </Text>
                <Button title="Voltar" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    const userOptions = users.map((user) => ({
        label: user.name,
        value: user.id,
    }));

    const paymentMethodOptions = paymentMethods.map((method) => ({
        label: method.name,
        value: method.id,
    }));

    return (
        <View className="flex-1 p-4 bg-neutral-50">
            <Text className="text-xl font-bold mb-6">
                Adicionar Nova Despesa
            </Text>

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

            <Button
                title="Salvar"
                onPress={handleSubmit(onSubmit)}
                className="mt-4"
            />
        </View>
    );
}

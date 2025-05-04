import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { expenseService } from '../../services/expenseService';
import { userService } from '../../services/userService';
import { paymentMethodService } from '../../services/paymentMethodService';
import { User, PaymentMethod, Tag } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { RootStackParamList } from '../../navigation';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../providers/ToastProvider';
import { tagService } from '../../services/tagService';
import Animated from 'react-native-reanimated';
import ExpenseFields, { FormData } from './ExpenseFields';

type EditExpenseScreenRouteProp = RouteProp<RootStackParamList, 'EditExpense'>;

export default function EditExpenseScreen() {
    const navigation = useNavigation();
    const route = useRoute<EditExpenseScreenRouteProp>();
    const { id } = route.params;
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

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
            tags: [],
        },
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [expenseData, usersData, paymentMethodsData, tagsData] =
                    await Promise.all([
                        expenseService.getById(id),
                        userService.getAll(),
                        paymentMethodService.getAll(),
                        tagService.getAll(),
                    ]);

                setUsers(usersData);
                setPaymentMethods(paymentMethodsData);
                setTags(tagsData);

                if (!expenseData) throw new Error('Something went wrong');

                // Preencher os campos do formulário com os dados da despesa
                setValue('name', expenseData.name);
                setValue('amount', String(expenseData.amount));
                setValue('userId', expenseData.user_id);
                setValue('paymentMethodId', expenseData.payment_method_id);

                // Se a despesa já tiver tags, preencher o campo de tags
                if (expenseData.tags && Array.isArray(expenseData.tags)) {
                    setValue(
                        'tags',
                        expenseData.tags.map((tag) => tag.id),
                    );
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                showToast(
                    'Não foi possível carregar os dados necessários',
                    'error',
                );
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
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

            await expenseService.update(
                id,
                {
                    user_id: data.userId,
                    payment_method_id: data.paymentMethodId,
                    name: data.name,
                    amount,
                },
                data.tags,
            );

            showToast('Despesa atualizada com sucesso', 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao atualizar despesa:', error);
            showToast('Não foi possível atualizar a despesa', 'error');
        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    // Verificar se há usuários e formas de pagamento cadastrados
    if (users.length === 0 || paymentMethods.length === 0) {
        return (
            <View className="flex-1 items-center justify-center bg-neutral-50 p-4">
                <Text className="mb-4 text-xl font-bold">
                    Não é possível editar a despesa
                </Text>
                <Text className="mb-6 text-center text-neutral-600">
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

    return (
        <Animated.ScrollView
            className="flex-1 bg-neutral-50 p-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator
        >
            <Text className="mb-6 text-xl font-bold">Editar despesa</Text>

            <ExpenseFields
                control={control}
                errors={errors}
                users={users}
                paymentMethods={paymentMethods}
                tags={tags}
            />

            <Button
                title="Salvar"
                onPress={handleSubmit(onSubmit)}
                className="mt-4"
            />
        </Animated.ScrollView>
    );
}

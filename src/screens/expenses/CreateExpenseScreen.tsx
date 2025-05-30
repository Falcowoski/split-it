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

type CreateExpenseScreenRouteProp = RouteProp<
    RootStackParamList,
    'CreateExpense'
>;

export default function CreateExpenseScreen() {
    const navigation = useNavigation();
    const route = useRoute<CreateExpenseScreenRouteProp>();
    const { groupId } = route.params;
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
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

                const [usersData, paymentMethodsData, tagsData] =
                    await Promise.all([
                        userService.getAll(),
                        paymentMethodService.getAll(),
                        tagService.getAll(),
                    ]);

                setUsers(usersData);
                setPaymentMethods(paymentMethodsData);
                setTags(tagsData);
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
    }, []);

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

            await expenseService.create(
                {
                    group_id: groupId,
                    user_id: data.userId,
                    payment_method_id: data.paymentMethodId,
                    name: data.name,
                    amount,
                },
                data.tags,
            );

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
            <View className="flex-1 items-center justify-center bg-neutral-50 p-4">
                <Text className="mb-4 text-xl font-bold">
                    Não é possível criar uma despesa
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
            <Text className="mb-6 text-xl font-bold">
                Adicionar nova despesa
            </Text>

            <ExpenseFields
                control={control}
                errors={errors}
                users={users}
                paymentMethods={paymentMethods}
                tags={tags}
            />

            <Button
                title="Criar"
                onPress={handleSubmit(onSubmit)}
                className="mt-4"
            />
        </Animated.ScrollView>
    );
}

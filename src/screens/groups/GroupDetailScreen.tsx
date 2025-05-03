// src/screens/groups/GroupDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { expenseService } from '../../services/expenseService';
import { groupService } from '../../services/groupService';
import { Group, Expense } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Card } from '../../components/ui/Card';
import { RootStackParamList } from '../../navigation';
import { useToast } from '../../providers/ToastProvider';

type GroupDetailScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'GroupDetail'
>;
type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

export default function GroupDetailScreen() {
    const [group, setGroup] = useState<Group | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<GroupDetailScreenNavigationProp>();
    const route = useRoute<GroupDetailScreenRouteProp>();
    const { id } = route.params;
    const { showToast } = useToast();

    useEffect(() => {
        loadGroupAndExpenses();

        const unsubscribe = navigation.addListener('focus', () => {
            loadGroupAndExpenses();
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation, id]);

    const loadGroupAndExpenses = async () => {
        try {
            setLoading(true);
            const groupData = await groupService.getById(id);
            setGroup(groupData);

            const expensesData = await expenseService.getAllByGroupId(id);
            setExpenses(expensesData);
        } catch (error) {
            console.error('Erro ao carregar grupo e despesas:', error);
            showToast('Não foi possível carregar os dados do grupo', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const renderExpenseItem = ({ item }: { item: Expense }) => (
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-neutral-200">
            <View className="flex-row items-center">
                <View
                    className="w-6 h-6 rounded-full mr-3"
                    style={{
                        backgroundColor:
                            item.payment_method?.color || '#CCCCCC',
                    }}
                />
                <View>
                    <Text className="font-medium">{item.name}</Text>
                    <Text className="text-sm text-neutral-500">
                        Pago por: {item.user?.name || 'Desconhecido'}
                    </Text>
                </View>
            </View>
            <Text className="font-bold">{formatCurrency(item.amount)}</Text>
        </TouchableOpacity>
    );

    const navigateToCreateExpense = () => {
        navigation.navigate('CreateExpense', { groupId: id });
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!group) {
        return <EmptyList message="Grupo não encontrado." />;
    }

    const totalAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
    );

    return (
        <View className="flex-1 bg-neutral-50">
            <Card className="m-4 mb-2">
                <Text className="text-lg font-bold">{group.name}</Text>
                <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-neutral-600">Total:</Text>
                    <Text className="text-xl font-bold">
                        {formatCurrency(totalAmount)}
                    </Text>
                </View>
            </Card>

            {expenses.length === 0 ? (
                <EmptyList message="Nenhuma despesa encontrada. Clique no botão + para adicionar uma despesa." />
            ) : (
                <FlatList
                    data={expenses}
                    renderItem={renderExpenseItem}
                    keyExtractor={(item) => item.id}
                    className="flex-1 bg-white mx-4 mt-2 rounded-lg"
                />
            )}
            <FloatingActionButton onPress={navigateToCreateExpense} />
        </View>
    );
}

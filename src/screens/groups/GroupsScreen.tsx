// src/screens/groups/GroupsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { groupService } from '../../services/groupService';
import { Group } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';
import { useToast } from '../../providers/ToastProvider';
import { formatCurrency } from '../../helpers/Number.helper';

type GroupsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TabNavigator'
>;

export default function GroupsScreen() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<GroupsScreenNavigationProp>();
    const { showToast } = useToast();

    useEffect(() => {
        loadGroups();

        const unsubscribe = navigation.addListener('focus', () => {
            loadGroups();
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const data = await groupService.getAll();
            setGroups(data);
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
            showToast('Não foi possível carregar os grupos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderGroupItem = ({ item }: { item: Group }) => {
        const totalAmount = item.expenses?.reduce(
            (sum, expense) => sum + expense.amount,
            0,
        );

        const total =
            totalAmount !== undefined
                ? formatCurrency(totalAmount)
                : 'Desconhecido';

        return (
            <TouchableOpacity
                className="border-b border-neutral-200 p-4"
                onPress={() =>
                    navigation.navigate('GroupDetail', { id: item.id })
                }
            >
                <Text className="text-medium">{item.name}</Text>
                <Text className="text-sm text-neutral-500">Total: {total}</Text>
                <Text className="text-sm text-neutral-500">
                    Quantidade de despesas:{' '}
                    {item.expenses?.length ?? 'Desconhecido'}
                </Text>
            </TouchableOpacity>
        );
    };

    const navigateToCreateGroup = () => {
        navigation.navigate('CreateGroup');
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View className="flex-1 bg-neutral-50">
            {groups.length === 0 ? (
                <EmptyList message="Nenhum grupo encontrado. Clique no botão + para adicionar um grupo." />
            ) : (
                <FlatList
                    data={groups}
                    renderItem={renderGroupItem}
                    keyExtractor={(item) => item.id}
                    className="mx-4 mt-4 flex-1 rounded-lg bg-white"
                />
            )}
            <FloatingActionButton onPress={navigateToCreateGroup} />
        </View>
    );
}

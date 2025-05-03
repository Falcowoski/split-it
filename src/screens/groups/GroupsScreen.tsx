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

    const renderGroupItem = ({ item }: { item: Group }) => (
        <TouchableOpacity
            className="p-4 border-b border-neutral-200"
            onPress={() => navigation.navigate('GroupDetail', { id: item.id })}
        >
            <Text className="text-base">{item.name}</Text>
        </TouchableOpacity>
    );

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
                    className="flex-1"
                />
            )}
            <FloatingActionButton onPress={navigateToCreateGroup} />
        </View>
    );
}

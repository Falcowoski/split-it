// src/screens/users/UsersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';
import { useToast } from '../../providers/ToastProvider';

type UserScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TabNavigator'
>;

export default function UsersScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<UserScreenNavigationProp>();
    const { showToast } = useToast();

    useEffect(() => {
        loadUsers();

        const unsubscribe = navigation.addListener('focus', () => {
            loadUsers();
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            showToast('Não foi possível carregar os usuários', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderUserItem = ({ item }: { item: User }) => (
        <TouchableOpacity className="border-b border-neutral-200 p-4">
            <Text className="font-medium">{item.name}</Text>
            <Text className="text-sm text-neutral-500">
                Criado em: {new Date(item.created_at).toLocaleDateString()}
            </Text>
        </TouchableOpacity>
    );

    const navigateToCreateUser = () => {
        navigation.navigate('CreateUser');
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View className="flex-1 bg-neutral-50">
            {users.length === 0 ? (
                <EmptyList message="Nenhum usuário encontrado. Clique no botão + para adicionar um usuário." />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item.id}
                    className="mx-4 mt-4 flex-1 rounded-lg bg-white"
                />
            )}
            <FloatingActionButton onPress={navigateToCreateUser} />
        </View>
    );
}

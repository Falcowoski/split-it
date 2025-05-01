// src/screens/users/UsersScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Text, Card, Divider, List, ListItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TabNavigator'>;

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<UserScreenNavigationProp>();

  useEffect(() => {
    loadUsers();
    
    // Recarregar dados quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsers();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <ListItem
      title={item.name}
      description={`Criado em: ${new Date(item.created_at).toLocaleDateString()}`}
    />
  );

  const navigateToCreateUser = () => {
    navigation.navigate('CreateUser');
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {users.length === 0 ? (
        <EmptyList message="Nenhum usuário encontrado. Clique no botão + para adicionar um usuário." />
      ) : (
        <List
          data={users}
          renderItem={renderUserItem}
          ItemSeparatorComponent={Divider}
          style={styles.list}
        />
      )}
      <FloatingActionButton onPress={navigateToCreateUser} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  list: {
    flex: 1,
  },
});
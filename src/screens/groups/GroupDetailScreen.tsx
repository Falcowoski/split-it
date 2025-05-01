// src/screens/groups/GroupDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Text, Divider, List, ListItem, Card } from '@ui-kitten/components';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { expenseService } from '../../services/expenseService';
import { groupService } from '../../services/groupService';
import { Group, Expense } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';

type GroupDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupDetail'>;
type GroupDetailScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetail'>;

export default function GroupDetailScreen() {
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<GroupDetailScreenNavigationProp>();
  const route = useRoute<GroupDetailScreenRouteProp>();
  const { id } = route.params;

  useEffect(() => {
    loadGroupAndExpenses();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadGroupAndExpenses();
    });

    return unsubscribe;
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
      Alert.alert('Erro', 'Não foi possível carregar os dados do grupo.');
    } finally {
      setLoading(false);
    }
  };

  const renderColorIndicator = (color: string) => (
    <View
      style={[
        styles.colorIndicator,
        { backgroundColor: color }
      ]}
    />
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <ListItem
      title={item.name}
      description={`Pago por: ${item.user?.name || 'Desconhecido'}`}
      accessoryLeft={() => renderColorIndicator(item.payment_method?.color || '#CCCCCC')}
      accessoryRight={() => <Text category="s1">{formatCurrency(item.amount)}</Text>}
    />
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

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Text category="h6">{group.name}</Text>
        <View style={styles.totalContainer}>
          <Text category="label">Total:</Text>
          <Text category="h5" style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
        </View>
      </Card>
      
      {expenses.length === 0 ? (
        <EmptyList message="Nenhuma despesa encontrada. Clique no botão + para adicionar uma despesa." />
      ) : (
        <List
          data={expenses}
          renderItem={renderExpenseItem}
          ItemSeparatorComponent={Divider}
          style={styles.list}
        />
      )}
      <FloatingActionButton onPress={navigateToCreateExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  summaryCard: {
    margin: 16,
    marginBottom: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
});
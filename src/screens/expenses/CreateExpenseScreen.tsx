// src/screens/expenses/CreateExpenseScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Text, Select, SelectItem, IndexPath } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { expenseService } from '../../services/expenseService';
import { userService } from '../../services/userService';
import { paymentMethodService } from '../../services/paymentMethodService';
import { User, PaymentMethod } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { RootStackParamList } from '../../navigation';

type CreateExpenseScreenRouteProp = RouteProp<RootStackParamList, 'CreateExpense'>;

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
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState<IndexPath | null>(null);
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState<IndexPath | null>(null);

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
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
          setSelectedUserIndex(new IndexPath(0));
          setValue('userId', usersData[0].id);
        }
        
        if (paymentMethodsData.length > 0) {
          setSelectedPaymentMethodIndex(new IndexPath(0));
          setValue('paymentMethodId', paymentMethodsData[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados necessários.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setValue]);

  const onUserSelect = (index: IndexPath | IndexPath[]) => {
    const selectedIndex = index as IndexPath;
    setSelectedUserIndex(selectedIndex);
    setValue('userId', users[selectedIndex.row].id);
  };

  const onPaymentMethodSelect = (index: IndexPath | IndexPath[]) => {
    const selectedIndex = index as IndexPath;
    setSelectedPaymentMethodIndex(selectedIndex);
    setValue('paymentMethodId', paymentMethods[selectedIndex.row].id);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Validar se há usuários e formas de pagamento cadastrados
      if (!data.userId) {
        return Alert.alert('Erro', 'Selecione um usuário responsável pela despesa.');
      }
      
      if (!data.paymentMethodId) {
        return Alert.alert('Erro', 'Selecione uma forma de pagamento.');
      }

      const amount = parseFloat(data.amount.replace(',', '.'));
      
      if (isNaN(amount) || amount <= 0) {
        return Alert.alert('Erro', 'Digite um valor válido para a despesa.');
      }

      await expenseService.create({
        group_id: groupId,
        user_id: data.userId,
        payment_method_id: data.paymentMethodId,
        name: data.name,
        amount,
      });

      Alert.alert('Sucesso', 'Despesa criada com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      Alert.alert('Erro', 'Não foi possível criar a despesa. Tente novamente.');
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  // Verificar se há usuários e formas de pagamento cadastrados
  if (users.length === 0 || paymentMethods.length === 0) {
    return (
      <View style={styles.container}>
        <Text category="h5" style={styles.title}>Não é possível criar uma despesa</Text>
        <Text category="p1" style={styles.message}>
          {users.length === 0 ? 'É necessário cadastrar pelo menos um usuário.' : ''}
          {paymentMethods.length === 0 ? '\nÉ necessário cadastrar pelo menos uma forma de pagamento.' : ''}
        </Text>
        <Button onPress={() => navigation.goBack()} style={styles.button}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.title}>Adicionar Nova Despesa</Text>
      
      <Controller
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Digite o nome da despesa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            status={errors.name ? 'danger' : 'basic'}
            caption={errors.name?.message}
            style={styles.input}
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
            message: 'Digite um valor válido'
          }
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Valor (R$)"
            placeholder="Digite o valor da despesa"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            status={errors.amount ? 'danger' : 'basic'}
            caption={errors.amount?.message}
            style={styles.input}
            keyboardType="numeric"
          />
        )}
        name="amount"
      />
      
      <Text category="label" style={styles.selectLabel}>Quem pagou</Text>
      <Select
        selectedIndex={selectedUserIndex}
        onSelect={onUserSelect}
        style={styles.input}
        placeholder="Selecione um usuário"
        value={selectedUserIndex ? users[selectedUserIndex.row]?.name : ''}
      >
        {users.map((user) => (
          <SelectItem key={user.id} title={user.name} />
        ))}
      </Select>
      
      <Text category="label" style={styles.selectLabel}>Forma de pagamento</Text>
      <Select
        selectedIndex={selectedPaymentMethodIndex}
        onSelect={onPaymentMethodSelect}
        style={styles.input}
        placeholder="Selecione uma forma de pagamento"
        value={selectedPaymentMethodIndex ? paymentMethods[selectedPaymentMethodIndex.row]?.name : ''}
      >
        {paymentMethods.map((method) => (
          <SelectItem key={method.id} title={method.name} />
        ))}
      </Select>
      
      <Button onPress={handleSubmit(onSubmit)} style={styles.button}>
        Salvar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  title: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  selectLabel: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
});
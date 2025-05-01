// src/screens/paymentMethods/PaymentMethodsScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { paymentMethodService } from '../../services/paymentMethodService';
import { PaymentMethod } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TabNavigator'>;

export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();

  useEffect(() => {
    loadPaymentMethods();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadPaymentMethods();
    });

    return unsubscribe;
  }, [navigation]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const data = await paymentMethodService.getAll();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Erro ao carregar formas de pagamento:', error);
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

  const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
    <ListItem
      title={item.name}
      accessoryLeft={() => renderColorIndicator(item.color)}
    />
  );

  const navigateToCreatePaymentMethod = () => {
    navigation.navigate('CreatePaymentMethod');
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {paymentMethods.length === 0 ? (
        <EmptyList message="Nenhuma forma de pagamento encontrada. Clique no botão + para adicionar uma nova." />
      ) : (
        <List
          data={paymentMethods}
          renderItem={renderPaymentMethodItem}
          ItemSeparatorComponent={Divider}
          style={styles.list}
        />
      )}
      <FloatingActionButton onPress={navigateToCreatePaymentMethod} />
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
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
});
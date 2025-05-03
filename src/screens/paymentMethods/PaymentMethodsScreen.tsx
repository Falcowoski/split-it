// src/screens/paymentMethods/PaymentMethodsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { paymentMethodService } from '../../services/paymentMethodService';
import { PaymentMethod } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';
import { useToast } from '../../providers/ToastProvider';

type PaymentMethodsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TabNavigator'
>;

export default function PaymentMethodsScreen() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<PaymentMethodsScreenNavigationProp>();
    const { showToast } = useToast();

    useEffect(() => {
        loadPaymentMethods();

        const unsubscribe = navigation.addListener('focus', () => {
            loadPaymentMethods();
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const loadPaymentMethods = async () => {
        try {
            setLoading(true);
            const data = await paymentMethodService.getAll();
            setPaymentMethods(data);
        } catch (error) {
            console.error('Erro ao carregar formas de pagamento:', error);
            showToast(
                'Não foi possível carregar as formas de pagamento',
                'error',
            );
        } finally {
            setLoading(false);
        }
    };

    const renderPaymentMethodItem = ({ item }: { item: PaymentMethod }) => (
        <TouchableOpacity className="flex-row items-center p-4 border-b border-neutral-200">
            <View
                className="w-6 h-6 rounded-full mr-3"
                style={{ backgroundColor: item.color }}
            />
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    const navigateToCreatePaymentMethod = () => {
        navigation.navigate('CreatePaymentMethod');
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View className="flex-1 bg-neutral-50">
            {paymentMethods.length === 0 ? (
                <EmptyList message="Nenhuma forma de pagamento encontrada. Clique no botão + para adicionar uma nova." />
            ) : (
                <FlatList
                    data={paymentMethods}
                    renderItem={renderPaymentMethodItem}
                    keyExtractor={(item) => item.id}
                    className="flex-1 bg-white mx-4 mt-4 rounded-lg"
                />
            )}
            <FloatingActionButton onPress={navigateToCreatePaymentMethod} />
        </View>
    );
}

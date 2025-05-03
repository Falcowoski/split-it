// src/screens/paymentMethods/CreatePaymentMethodScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { paymentMethodService } from '../../services/paymentMethodService';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../providers/ToastProvider';

type FormData = {
    name: string;
    color: string;
};

// Cores predefinidas para seleção rápida
const PRESET_COLORS = [
    '#FF5252',
    '#FF4081',
    '#E040FB',
    '#7C4DFF',
    '#536DFE',
    '#448AFF',
    '#40C4FF',
    '#18FFFF',
    '#64FFDA',
    '#69F0AE',
    '#B2FF59',
    '#EEFF41',
    '#FFFF00',
    '#FFD740',
    '#FFAB40',
    '#FF6E40',
    '#bebebe',
];

export default function CreatePaymentMethodScreen() {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const [selectedColor, setSelectedColor] = useState('#FF5252');

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        defaultValues: {
            name: '',
            color: '#FF5252',
        },
    });

    const selectColor = (color: string) => {
        setSelectedColor(color);
        setValue('color', color);
    };

    const onSubmit = async (data: FormData) => {
        try {
            await paymentMethodService.create(data.name, data.color);
            showToast('Forma de pagamento criada com sucesso', 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar forma de pagamento:', error);
            showToast('Não foi possível criar a forma de pagamento', 'error');
        }
    };

    return (
        <View className="flex-1 p-4 bg-neutral-50">
            <Text className="text-xl font-bold mb-6">
                Adicionar Nova Forma de Pagamento
            </Text>

            <Controller
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Nome"
                        placeholder="Digite o nome (ex: Cartão Nubank)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.name?.message}
                    />
                )}
                name="name"
            />

            <Text className="font-medium mb-2 text-neutral-700">Cor</Text>
            <View className="flex-row flex-wrap mb-4">
                {PRESET_COLORS.map((color) => (
                    <TouchableOpacity
                        key={color}
                        className={`w-10 h-10 m-1.5 rounded-full ${selectedColor === color ? 'border-2 border-neutral-800' : ''}`}
                        style={{ backgroundColor: color }}
                        onPress={() => selectColor(color)}
                    />
                ))}
            </View>

            <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

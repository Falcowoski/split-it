// src/screens/users/CreateUserScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { userService } from '../../services/userService';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../providers/ToastProvider';

type FormData = {
    name: string;
};

export default function CreateUserScreen() {
    const navigation = useNavigation();
    const { showToast } = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await userService.create(data.name);
            showToast('Usuário criado com sucesso', 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            showToast('Não foi possível criar o usuário', 'error');
        }
    };

    return (
        <View className="flex-1 p-4 bg-neutral-50">
            <Text className="text-xl font-bold mb-6">
                Adicionar Novo Usuário
            </Text>

            <Controller
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Nome"
                        placeholder="Digite o nome do usuário"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.name?.message}
                    />
                )}
                name="name"
            />

            <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
        </View>
    );
}

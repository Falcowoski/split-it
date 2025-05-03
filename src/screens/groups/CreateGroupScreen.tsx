// src/screens/groups/CreateGroupScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { groupService } from '../../services/groupService';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../providers/ToastProvider';

type FormData = {
    name: string;
};

export default function CreateGroupScreen() {
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
            await groupService.create(data.name);
            showToast('Grupo criado com sucesso', 'success');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
            showToast('Não foi possível criar o grupo', 'error');
        }
    };

    return (
        <View className="flex-1 bg-neutral-50 p-4">
            <Text className="mb-6 text-xl font-bold">Adicionar novo grupo</Text>

            <Controller
                control={control}
                rules={{ required: 'Nome é obrigatório' }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextField
                        label="Nome"
                        placeholder="Digite o nome do grupo"
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

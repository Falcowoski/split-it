// src/screens/users/CreateUserScreen.tsx
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { userService } from '../../services/userService';

type FormData = {
  name: string;
};

export default function CreateUserScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await userService.create(data.name);
      Alert.alert('Sucesso', 'Usuário criado com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      Alert.alert('Erro', 'Não foi possível criar o usuário. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.title}>Adicionar Novo Usuário</Text>
      
      <Controller
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Digite o nome do usuário"
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
  button: {
    marginTop: 16,
  },
});
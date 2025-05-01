// src/screens/groups/CreateGroupScreen.tsx
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { groupService } from '../../services/groupService';

type FormData = {
  name: string;
};

export default function CreateGroupScreen() {
  const navigation = useNavigation();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await groupService.create(data.name);
      Alert.alert('Sucesso', 'Grupo criado com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      Alert.alert('Erro', 'Não foi possível criar o grupo. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.title}>Adicionar Novo Grupo</Text>
      
      <Controller
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Digite o nome do grupo"
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
// src/screens/paymentMethods/CreatePaymentMethodScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import { Button, Input, Text } from '@ui-kitten/components';
import { useForm, Controller } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { paymentMethodService } from '../../services/paymentMethodService';

type FormData = {
  name: string;
  color: string;
};

// Cores predefinidas para seleção rápida
const PRESET_COLORS = [
  '#FF5252', '#FF4081', '#E040FB', '#7C4DFF',
  '#536DFE', '#448AFF', '#40C4FF', '#18FFFF',
  '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41',
  '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40',
];

export default function CreatePaymentMethodScreen() {
  const navigation = useNavigation();
  const [selectedColor, setSelectedColor] = useState('#FF5252');
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
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
      Alert.alert('Sucesso', 'Forma de pagamento criada com sucesso');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao criar forma de pagamento:', error);
      Alert.alert('Erro', 'Não foi possível criar a forma de pagamento. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text category="h5" style={styles.title}>Adicionar Nova Forma de Pagamento</Text>
      
      <Controller
        control={control}
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nome"
            placeholder="Digite o nome (ex: Cartão Nubank)"
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
      
      <Text category="label" style={styles.colorLabel}>Cor</Text>
      <View style={styles.colorGrid}>
        {PRESET_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorItem,
              { backgroundColor: color },
              selectedColor === color ? styles.selectedColor : null,
            ]}
            onPress={() => selectColor(color)}
          />
        ))}
      </View>
      
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
  colorLabel: {
    marginBottom: 8,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorItem: {
    width: 40,
    height: 40,
    margin: 6,
    borderRadius: 20,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#222B45',
  },
  button: {
    marginTop: 16,
  },
});
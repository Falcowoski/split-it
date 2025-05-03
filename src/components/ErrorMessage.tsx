// src/components/ErrorMessage.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ErrorMessageProps = {
    message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
    <View className="bg-danger-100 mb-4 flex-row items-center rounded p-2">
        <Feather name="alert-triangle" size={24} color="#FF4747" />
        <Text className="text-danger-500 ml-2">{message}</Text>
    </View>
);

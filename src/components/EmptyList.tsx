// src/components/EmptyList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type EmptyListProps = {
    message: string;
};

export const EmptyList = ({ message }: EmptyListProps) => (
    <View className="flex-1 justify-center items-center p-5">
        <Feather name="alert-circle" size={40} color="#8F9BB3" />
        <Text className="text-center mt-3 text-neutral-500">{message}</Text>
    </View>
);

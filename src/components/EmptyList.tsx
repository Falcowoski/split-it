// src/components/EmptyList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

type EmptyListProps = {
    message: string;
};

export const EmptyList = ({ message }: EmptyListProps) => (
    <View className="flex-1 items-center justify-center p-5">
        <Feather name="alert-circle" size={40} color="#8F9BB3" />
        <Text className="mt-3 text-center text-neutral-500">{message}</Text>
    </View>
);

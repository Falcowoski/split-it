// src/components/FloatingActionButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type FloatingActionButtonProps = {
    onPress: () => void;
};

export const FloatingActionButton = ({
    onPress,
}: FloatingActionButtonProps) => (
    <TouchableOpacity
        className="absolute w-14 h-14 items-center justify-center right-5 bottom-5 rounded-full shadow-lg"
        style={{ backgroundColor: '#3366FF' }}
        onPress={onPress}
    >
        <Feather name="plus" size={24} color="#FFFFFF" />
    </TouchableOpacity>
);

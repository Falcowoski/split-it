// src/components/LoadingIndicator.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export const LoadingIndicator = () => (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3366FF" />
    </View>
);

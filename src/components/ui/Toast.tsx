// src/components/ui/Toast.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastProps = {
    visible: boolean;
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
};

export const Toast = ({
    visible,
    message,
    type = 'info',
    duration = 3000,
    onClose,
}: ToastProps) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    const getToastStyle = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'info':
            default:
                return 'bg-blue-500';
        }
    };

    const getToastIcon = () => {
        switch (type) {
            case 'success':
                return 'check-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'alert-triangle';
            case 'info':
            default:
                return 'info';
        }
    };

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onClose();
                });
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible, fadeAnim, duration, onClose]);

    if (!visible) return null;

    return (
        <Animated.View
            style={{ opacity: fadeAnim }}
            className="absolute top-10 left-5 right-5 z-50"
        >
            <View
                className={`flex-row items-center p-4 rounded-lg shadow-md ${getToastStyle()}`}
            >
                <Feather name={getToastIcon()} size={24} color="#FFFFFF" />
                <Text className="flex-1 ml-3 text-white font-medium">
                    {message}
                </Text>
                <TouchableOpacity onPress={onClose}>
                    <Feather name="x" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

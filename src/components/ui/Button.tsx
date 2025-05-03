// src/components/ui/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { button } from '../../theme/design';

type ButtonProps = {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
};

export const Button = ({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
}: ButtonProps) => {
    const buttonClasses = [
        button.base,
        button[variant],
        button.sizes[size],
        disabled ? button.disabled : '',
        className,
    ].join(' ');

    return (
        <TouchableOpacity
            className={buttonClasses}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
                <Text className={button.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

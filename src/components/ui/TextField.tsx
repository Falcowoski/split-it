// src/components/ui/TextField.tsx
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { input } from '../../theme/design';

type TextFieldProps = TextInputProps & {
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
};

export const TextField = ({
    label,
    error,
    className = '',
    disabled,
    ...props
}: TextFieldProps) => {
    const inputClasses = [
        input.base,
        error ? input.error : input.normal,
        disabled ? input.disabled : '',
        className,
    ].join(' ');

    return (
        <View className="mb-4 w-full">
            {label && <Text className={input.label}>{label}</Text>}
            <TextInput
                className={inputClasses}
                editable={!disabled}
                {...props}
            />
            {error && <Text className={input.errorText}>{error}</Text>}
        </View>
    );
};

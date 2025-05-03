import React from 'react';
import { View, Text } from 'react-native';

type BadgeProps = {
    label: string;
    color: string;
    small?: boolean;
};

export const Badge = ({ label, color, small = false }: BadgeProps) => {
    // Calcula contraste e determina cor do texto automaticamente
    const textColor = getContrastColor(color);

    return (
        <View
            className={`rounded-full ${small ? 'px-2 py-0.5' : 'px-3 py-1.5'}`}
            style={{ backgroundColor: color }}
        >
            <Text
                className={`font-medium ${small ? 'text-xs' : 'text-sm'} text-center`}
                style={{ color: textColor }}
                numberOfLines={1}
            >
                {label}
            </Text>
        </View>
    );
};

/**
 * Determina se uma cor de fundo precisa de texto claro ou escuro para ter contraste adequado
 * @param backgroundColor - Cor hexadecimal (ex: "#FF5733")
 * @returns Cor de texto para contraste adequado ("#FFFFFF" ou "#000000")
 */
const getContrastColor = (backgroundColor: string): string => {
    // Remove o # se existir
    const hex = backgroundColor.replace('#', '');

    // Verifica se é um formato hexadecimal válido e usa um valor padrão se não for
    if (!/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
        return '#000000'; // Retorna preto como padrão para cores inválidas
    }

    // Padroniza para formato de 6 dígitos
    const hexColor =
        hex.length === 3
            ? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
            : hex;

    // Converte para RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    // Calcula luminância relativa (baseado no padrão WCAG)
    // Fórmula: https://www.w3.org/TR/WCAG20-TECHS/G17.html
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Escolhe branco ou preto baseado na luminância
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

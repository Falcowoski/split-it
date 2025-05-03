// src/components/ui/Card.tsx
import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { card } from '../../theme/design';

type CardProps = {
    children: ReactNode;
    className?: string;
};

export const Card = ({ children, className = '' }: CardProps) => {
    const cardClasses = [card.base, card.shadow, className].join(' ');

    return <View className={cardClasses}>{children}</View>;
};

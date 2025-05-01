// src/components/ErrorMessage.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <View style={styles.container}>
    <Icon name="alert-triangle-outline" width={24} height={24} fill="#FF4747" />
    <Text category="p2" status="danger" style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFE7D9',
    borderRadius: 4,
    marginBottom: 16,
  },
  text: {
    marginLeft: 8,
  },
});
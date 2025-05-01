// src/components/EmptyList.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from '@ui-kitten/components';

type EmptyListProps = {
  message: string;
};

export const EmptyList = ({ message }: EmptyListProps) => (
  <View style={styles.container}>
    <Icon name="alert-circle-outline" width={40} height={40} fill="#8F9BB3" />
    <Text category="s1" style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
  },
});
// src/components/LoadingIndicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Spinner } from '@ui-kitten/components';

export const LoadingIndicator = () => (
  <View style={styles.container}>
    <Spinner size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
// src/components/FloatingActionButton.tsx
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from '@ui-kitten/components';

type FloatingActionButtonProps = {
  onPress: () => void;
};

export const FloatingActionButton = ({ onPress }: FloatingActionButtonProps) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Icon name="plus-outline" width={24} height={24} fill="#FFFFFF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#3366FF',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation';
import { ToastProvider } from './src/providers/ToastProvider';
import './global.css';

export default function App() {
    return (
        <SafeAreaProvider>
            <ToastProvider>
                <StatusBar style="auto" />
                <AppNavigator />
            </ToastProvider>
        </SafeAreaProvider>
    );
}

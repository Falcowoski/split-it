// src/providers/ToastProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastContextType = {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

type ToastProviderProps = {
    children: ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [toastType, setToastType] = useState<ToastType>('info');
    const [toastDuration, setToastDuration] = useState(3000);

    const showToast = (
        message: string,
        type: ToastType = 'info',
        duration: number = 3000,
    ) => {
        setMessage(message);
        setToastType(type);
        setToastDuration(duration);
        setVisible(true);
    };

    const hideToast = () => {
        setVisible(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast
                visible={visible}
                message={message}
                type={toastType}
                duration={toastDuration}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
};

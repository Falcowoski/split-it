import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { input } from '../../theme/design';

type SelectOption = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    selectedValue?: string;
    onValueChange: (value: string) => void;
    error?: string;
};

export const SelectField = ({
    label,
    placeholder = 'Selecione uma opção',
    options,
    selectedValue,
    onValueChange,
    error,
}: SelectFieldProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOption = options.find(
        (option) => option.value === selectedValue,
    );

    return (
        <View className="mb-4 w-full">
            {label && <Text className={input.label}>{label}</Text>}

            <TouchableOpacity
                className={`${input.base} flex-row items-center justify-between ${error ? input.error : input.normal}`}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    className={
                        selectedOption ? 'text-black' : 'text-neutral-400'
                    }
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>
                <Feather name="chevron-down" size={20} color="#8F9BB3" />
            </TouchableOpacity>

            {error && <Text className={input.errorText}>{error}</Text>}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView className="flex-1 bg-blue-50">
                    <View className="mt-auto flex-1">
                        <View className="rounded-t-xl bg-white">
                            <View className="flex-row items-center justify-between border-b border-neutral-200 p-4">
                                <Text className="text-lg font-medium">
                                    Selecione uma opção
                                </Text>
                                <TouchableOpacity
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Feather
                                        name="x"
                                        size={24}
                                        color="#8F9BB3"
                                    />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={options}
                                keyExtractor={(item) => item.value}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className={`border-b border-neutral-100 p-4 ${
                                            item.value === selectedValue
                                                ? 'bg-blue-100'
                                                : ''
                                        }`}
                                        onPress={() => {
                                            onValueChange(item.value);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text
                                            className={
                                                item.value === selectedValue
                                                    ? 'font-medium text-blue-600'
                                                    : 'text-neutral-700'
                                            }
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                style={{ maxHeight: 300 }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

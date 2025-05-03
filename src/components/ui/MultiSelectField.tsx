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

type MultiSelectFieldProps = {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    selectedValues?: string[];
    onValuesChange: (values: string[]) => void;
    error?: string;
};

export const MultiSelectField = ({
    label,
    placeholder = 'Selecione opções',
    options,
    selectedValues = [],
    onValuesChange,
    error,
}: MultiSelectFieldProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedOptions = options.filter((option) =>
        selectedValues.includes(option.value),
    );

    const toggleOption = (value: string) => {
        if (selectedValues.includes(value)) {
            // Remove o valor se já estiver selecionado
            onValuesChange(selectedValues.filter((v) => v !== value));
        } else {
            // Adiciona o valor se não estiver selecionado
            onValuesChange([...selectedValues, value]);
        }
    };

    return (
        <View className="mb-4 w-full">
            {label && <Text className={input.label}>{label}</Text>}

            <TouchableOpacity
                className={`${input.base} flex-row items-center justify-between ${error ? input.error : input.normal}`}
                onPress={() => setModalVisible(true)}
            >
                <Text
                    className={
                        selectedOptions.length > 0
                            ? 'text-black'
                            : 'text-neutral-400'
                    }
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {selectedOptions.length > 0
                        ? `${selectedOptions.length} selecionado(s)`
                        : placeholder}
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
                                    Selecione opções
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
                                            selectedValues.includes(item.value)
                                                ? 'bg-blue-100'
                                                : ''
                                        }`}
                                        onPress={() => toggleOption(item.value)}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text
                                                className={
                                                    selectedValues.includes(
                                                        item.value,
                                                    )
                                                        ? 'font-medium text-blue-600'
                                                        : 'text-neutral-700'
                                                }
                                            >
                                                {item.label}
                                            </Text>
                                            {selectedValues.includes(
                                                item.value,
                                            ) && (
                                                <Feather
                                                    name="check"
                                                    size={20}
                                                    color="#3366FF"
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                )}
                                style={{ maxHeight: 300 }}
                            />

                            <View className="border-t border-neutral-200 p-4">
                                <TouchableOpacity
                                    className="rounded-lg bg-blue-600 py-3"
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text className="text-center font-medium text-white">
                                        Confirmar ({selectedValues.length})
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

// src/screens/tags/TagsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { tagService } from '../../services/tagService';
import { Tag } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';
import { useToast } from '../../providers/ToastProvider';

type TagsScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TabNavigator'
>;

export default function TagsScreen() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<TagsScreenNavigationProp>();
    const { showToast } = useToast();

    useEffect(() => {
        loadTags();

        const unsubscribe = navigation.addListener('focus', () => {
            loadTags();
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigation]);

    const loadTags = async () => {
        try {
            setLoading(true);
            const data = await tagService.getAll();
            setTags(data);
        } catch (error) {
            console.error('Erro ao carregar tags:', error);
            showToast('Não foi possível carregar as tags', 'error');
        } finally {
            setLoading(false);
        }
    };

    const renderTagItem = ({ item }: { item: Tag }) => (
        <TouchableOpacity className="flex-row items-center border-b border-neutral-200 p-4">
            <View
                className="mr-3 h-6 w-6 rounded-full"
                style={{ backgroundColor: item.color }}
            />
            <Text>{item.name}</Text>
        </TouchableOpacity>
    );

    const navigateToCreateTag = () => {
        navigation.navigate('CreateTag');
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <View className="flex-1 bg-neutral-50">
            {tags.length === 0 ? (
                <EmptyList message="Nenhuma tag encontrada. Clique no botão + para adicionar uma nova." />
            ) : (
                <FlatList
                    data={tags}
                    renderItem={renderTagItem}
                    keyExtractor={(item) => item.id}
                    className="mx-4 mt-4 flex-1 rounded-lg bg-white"
                />
            )}
            <FloatingActionButton onPress={navigateToCreateTag} />
        </View>
    );
}

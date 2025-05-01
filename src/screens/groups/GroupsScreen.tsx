// src/screens/groups/GroupsScreen.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Divider, List, ListItem } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { groupService } from '../../services/groupService';
import { Group } from '../../types';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { EmptyList } from '../../components/EmptyList';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { RootStackParamList } from '../../navigation';

type GroupsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TabNavigator'>;

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<GroupsScreenNavigationProp>();

  useEffect(() => {
    loadGroups();
    
    const unsubscribe = navigation.addListener('focus', () => {
      loadGroups();
    });

    return unsubscribe;
  }, [navigation]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Erro ao carregar grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderGroupItem = ({ item }: { item: Group }) => (
    <ListItem
      title={item.name}
      onPress={() => navigation.navigate('GroupDetail', { id: item.id })}
    />
  );

  const navigateToCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <EmptyList message="Nenhum grupo encontrado. Clique no botão + para adicionar um grupo." />
      ) : (
        <List
          data={groups}
          renderItem={renderGroupItem}
          ItemSeparatorComponent={Divider}
          style={styles.list}
        />
      )}
      <FloatingActionButton onPress={navigateToCreateGroup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  list: {
    flex: 1,
  },
});
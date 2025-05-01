// src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomNavigation, BottomNavigationTab, Icon } from '@ui-kitten/components';

// Importar telas
import GroupsScreen from '../screens/groups/GroupsScreen';
import GroupDetailScreen from '../screens/groups/GroupDetailScreen';
import CreateGroupScreen from '../screens/groups/CreateGroupScreen';
import UsersScreen from '../screens/users/UsersScreen';
import CreateUserScreen from '../screens/users/CreateUserScreen';
import PaymentMethodsScreen from '../screens/paymentMethods/PaymentMethodsScreen';
import CreatePaymentMethodScreen from '../screens/paymentMethods/CreatePaymentMethodScreen';
import CreateExpenseScreen from '../screens/expenses/CreateExpenseScreen';

// Definir tipos para navegação
export type RootStackParamList = {
  TabNavigator: undefined;
  GroupDetail: { id: string };
  CreateGroup: undefined;
  CreateUser: undefined;
  CreatePaymentMethod: undefined;
  CreateExpense: { groupId: string };
};

export type TabParamList = {
  Groups: undefined;
  Users: undefined;
  PaymentMethods: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabBar = ({ navigation, state }: any) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={index => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab title='Grupos' icon={(props) => <Icon {...props} name='people-outline'/>}/>
    <BottomNavigationTab title='Usuários' icon={(props) => <Icon {...props} name='person-outline'/>}/>
    <BottomNavigationTab title='Pagamentos' icon={(props) => <Icon {...props} name='credit-card-outline'/>}/>
  </BottomNavigation>
);

const TabNavigator = () => (
  <Tab.Navigator tabBar={props => <BottomTabBar {...props} />}>
    <Tab.Screen name="Groups" component={GroupsScreen} options={{ title: 'Grupos' }} />
    <Tab.Screen name="Users" component={UsersScreen} options={{ title: 'Usuários' }} />
    <Tab.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: 'Formas de Pagamento' }} />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen 
        name="TabNavigator" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="GroupDetail" 
        component={GroupDetailScreen} 
        options={{ title: 'Detalhes do Grupo' }} 
      />
      <Stack.Screen 
        name="CreateGroup" 
        component={CreateGroupScreen} 
        options={{ title: 'Novo Grupo' }} 
      />
      <Stack.Screen 
        name="CreateUser" 
        component={CreateUserScreen} 
        options={{ title: 'Novo Usuário' }} 
      />
      <Stack.Screen 
        name="CreatePaymentMethod" 
        component={CreatePaymentMethodScreen} 
        options={{ title: 'Nova Forma de Pagamento' }} 
      />
      <Stack.Screen 
        name="CreateExpense" 
        component={CreateExpenseScreen} 
        options={{ title: 'Nova Despesa' }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
);
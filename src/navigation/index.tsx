// src/navigation/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

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
    <View className="flex-row border-t border-neutral-200 bg-white">
        {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            let iconName: any;
            let label: string = '';

            if (route.name === 'Groups') {
                iconName = 'users';
                label = 'Grupos';
            } else if (route.name === 'Users') {
                iconName = 'user';
                label = 'Usuários';
            } else if (route.name === 'PaymentMethods') {
                iconName = 'credit-card';
                label = 'Pagamentos';
            }

            return (
                <TouchableOpacity
                    key={index}
                    className={`flex-1 items-center py-3 ${isFocused ? 'opacity-100' : 'opacity-60'}`}
                    onPress={() => navigation.navigate(route.name)}
                >
                    <Feather
                        name={iconName}
                        size={24}
                        // Colors: blue-500 and neutral-500
                        color={isFocused ? '#3b82f6' : '#737373'}
                    />

                    <Text
                        className={`mt-1 text-xs ${isFocused ? 'text-blue-500' : 'text-neutral-500'}`}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            );
        })}
    </View>
);

const TabNavigator = () => (
    <Tab.Navigator tabBar={(props) => <BottomTabBar {...props} />}>
        <Tab.Screen
            name="Groups"
            options={{ title: 'Grupos' }}
            component={GroupsScreen}
        />
        <Tab.Screen
            name="Users"
            options={{ title: 'Usuários' }}
            component={UsersScreen}
        />
        <Tab.Screen
            name="PaymentMethods"
            options={{ title: 'Métodos de pagamento' }}
            component={PaymentMethodsScreen}
        />
    </Tab.Navigator>
);

export const AppNavigator = () => (
    <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'white',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: '#EDF1F7',
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="TabNavigator"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="GroupDetail"
                component={GroupDetailScreen}
                options={{ title: 'Detalhes do grupo' }}
            />
            <Stack.Screen
                name="CreateGroup"
                component={CreateGroupScreen}
                options={{ title: 'Novo grupo' }}
            />
            <Stack.Screen
                name="CreateUser"
                component={CreateUserScreen}
                options={{ title: 'Novo usuário' }}
            />
            <Stack.Screen
                name="CreatePaymentMethod"
                component={CreatePaymentMethodScreen}
                options={{ title: 'Nova forma de pagamento' }}
            />
            <Stack.Screen
                name="CreateExpense"
                component={CreateExpenseScreen}
                options={{ title: 'Nova despesa' }}
            />
        </Stack.Navigator>
    </NavigationContainer>
);

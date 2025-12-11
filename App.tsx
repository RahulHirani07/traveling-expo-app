import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import UploadScreen from './app/upload';
import PostsScreen from './app/posts';

const Tab = createBottomTabNavigator();

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30000, // 30 seconds
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#6200ee',
              tabBarInactiveTintColor: '#666',
              headerShown: false,
            }}
          >
            <Tab.Screen
              name="Upload"
              component={UploadScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="cloud-upload" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Posts"
              component={PostsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="photo-library" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </QueryClientProvider>
  );
}

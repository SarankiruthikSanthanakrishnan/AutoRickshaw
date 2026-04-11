import { Tabs } from 'expo-router';
import { LayoutDashboard, User, User2Icon } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          // Zoho style subtle shadow
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarActiveTintColor: '#0a66c2',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="Login"
        options={{
          title:'Login',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />

      <Tabs.Screen
        name="Add"
        options={{
          title:'Add',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />

        }}
      />

      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

import { Tabs } from 'expo-router';
import { LayoutDashboard, User, PlusCircle } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useTheme } from '../../utils/Theme';
import { useAuth } from '../../utils/AuthContext';

export default function AdminLayout() {
  const { colors } = useTheme();
  const { user } = useAuth();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
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
        tabBarActiveTintColor: colors.text,
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
          href: user ? undefined : null,
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="Login"
        options={{
          title: 'Login',
          href: null,
          tabBarStyle: { display: 'none' }, // Hides tab bar on login screen map
        }}
      />

      <Tabs.Screen
        name="Add"
        options={{
          title: 'Add',
          href: user ? undefined : null,
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
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

import { Tabs } from 'expo-router';
import { Home, ShipWheelIcon } from 'lucide-react-native';
import React from 'react';
import { useTheme } from '../../utils/Theme';

const Tablayout = () => {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        tabBarActiveTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="List"
        options={{
          title: 'List',
          tabBarIcon: ({ color, size }) => (
            <ShipWheelIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="driver/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default Tablayout;

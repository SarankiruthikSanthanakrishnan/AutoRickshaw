import { Tabs } from 'expo-router';
import { Home, ShipWheelIcon } from 'lucide-react-native';
import React from 'react';

const Tablayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
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
        name=""
        options={{
          title: 'SingleData',
          href: null,
        }}
      />
    </Tabs>
  );
};

export default Tablayout;

/**
 * Tab layout — bottom navigation bar with 7 screens.
 * Mirrors the Android app's BottomNavBar.kt.
 */

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

type TabDef = {
  name: string;
  title: string;
  icon: IoniconsName;
  iconOutline: IoniconsName;
};

const tabs: TabDef[] = [
  { name: 'index', title: 'Home', icon: 'home', iconOutline: 'home-outline' },
  { name: 'trailer', title: 'Trailer', icon: 'car', iconOutline: 'car-outline' },
  { name: 'energy', title: 'Energy', icon: 'battery-charging', iconOutline: 'battery-charging-outline' },
  { name: 'water', title: 'Water', icon: 'water', iconOutline: 'water-outline' },
  { name: 'air-quality', title: 'Air', icon: 'cloud', iconOutline: 'cloud-outline' },
  { name: 'map', title: 'Map', icon: 'map', iconOutline: 'map-outline' },
  { name: 'settings', title: 'Settings', icon: 'settings', iconOutline: 'settings-outline' },
];

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.icon : tab.iconOutline}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

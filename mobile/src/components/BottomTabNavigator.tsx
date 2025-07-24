import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../screens/MapScreen';
import ListBandScreen from '../screens/ListBandScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 80, position: 'absolute' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Map') {
            return <Ionicons name="map" size={size} color={color} />;
          } else if (route.name === 'ListBand') {
            return <Ionicons name="musical-notes" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person" size={size} color={color} />;
          }
        },
        tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} options={{ tabBarLabel: 'Carte' }} />
      <Tab.Screen name="ListBand" component={ListBandScreen} options={{ tabBarLabel: 'Groupes' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
} 
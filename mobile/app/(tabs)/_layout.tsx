import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '../../lib/theme-context'

const Tab = createBottomTabNavigator()

export default function TabsLayout() {
  const { colors } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: any

          if (route.name === 'feed') {
            iconName = 'home'
          } else if (route.name === 'search') {
            iconName = 'search'
          } else if (route.name === 'profile') {
            iconName = 'person'
          } else if (route.name === 'notifications') {
            iconName = 'notifications'
          } else if (route.name === 'messages') {
            iconName = 'mail'
          }

          return <MaterialIcons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen name="feed" options={{ title: 'Home' }} />
      <Tab.Screen name="search" options={{ title: 'Search' }} />
      <Tab.Screen name="profile" options={{ title: 'Profile' }} />
      <Tab.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tab.Screen name="messages" options={{ title: 'Messages' }} />
    </Tab.Navigator>
  )
}

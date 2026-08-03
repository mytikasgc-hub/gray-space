import React, { useState } from 'react'
import { Redirect, Tabs } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { CustomTabBar } from '../../components/custom-tab-bar'
import { CreatePostSheet } from '../../components/create-post-sheet'
import { useAuth } from '../../lib/auth-context'

export default function TabsLayout() {
  const { session, isLoading } = useAuth()
  const [showCreatePost, setShowCreatePost] = useState(false)

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center' }}>
        <ActivityIndicator color="#fff" />
      </View>
    )
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <>
      <Tabs
        tabBar={(props) => (
          <CustomTabBar
            {...props}
            onCreatePress={() => setShowCreatePost(true)}
          />
        )}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            href: null,
            title: 'Home',
          }}
        />
        <Tabs.Screen name="feed" options={{ title: 'Home' }} />
        <Tabs.Screen name="search" options={{ title: 'Search' }} />
        <Tabs.Screen
          name="create"
          options={{
            href: null,
            title: 'Create',
          }}
        />
        <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
      </Tabs>

      <CreatePostSheet
        isVisible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />
    </>
  )
}

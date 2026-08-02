import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import { CustomTabBar } from '../../components/custom-tab-bar'
import { CreatePostSheet } from '../../components/create-post-sheet'

export default function TabsLayout() {
  const [showCreatePost, setShowCreatePost] = useState(false)

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

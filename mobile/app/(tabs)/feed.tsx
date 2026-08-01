import React, { useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme, Space } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { SpaceSelector } from '../../components/space-selector'
import { PostCard } from '../../components/post-card'
import { Header } from '../../components/header'
import { CreatePostSheet } from '../../components/create-post-sheet'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function FeedScreen() {
  const { colors, space, setSpace } = useTheme()
  const { session } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    setPage(0)
    fetchPosts(0)
  }, [space])

  const fetchPosts = async (pageNum: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `${API_URL}/api/posts?space=${space}&page=${pageNum}`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()

      if (pageNum === 0) {
        setPosts(data.posts)
      } else {
        setPosts((prev) => [...prev, ...data.posts])
      }

      setHasMore(data.hasMore)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  const handleSpaceChange = (newSpace: Space) => {
    setSpace(newSpace)
  }

  const handleLike = async (postId: string) => {
    if (!session) return

    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })

      if (response.ok) {
        // Like successful
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    loadingContainer: {
      paddingVertical: 16,
      alignItems: 'center',
    },
    floatingButton: {
      position: 'absolute',
      bottom: 90,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header title="GREY SPACE" showSearch showProfile />
      <SpaceSelector selectedSpace={space} onSpaceChange={handleSpaceChange} />

      {isLoading && page === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts in {space} space yet</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              likeCount={item.likes?.[0]?.count || 0}
              onPress={() => {}}
              onLike={() => handleLike(item.id)}
              onComment={() => {}}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && page > 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}

      {/* Floating Create Button */}
      <TouchableOpacity
        style={[
          styles.floatingButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => setShowCreatePost(true)}
      >
        <MaterialIcons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Post Sheet */}
      <CreatePostSheet
        isVisible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          setPage(0)
          fetchPosts(0)
        }}
      />
    </SafeAreaView>
  )
}

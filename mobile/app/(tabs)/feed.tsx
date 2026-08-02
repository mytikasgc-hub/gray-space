import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useTheme, Space } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { SpaceSelector } from '../../components/space-selector'
import { PostCard } from '../../components/post-card'
import { Header } from '../../components/header'
import { MOCK_POSTS } from '../../lib/mock-data'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function FeedScreen() {
  const router = useRouter()
  const { colors, space, setSpace } = useTheme()
  const { session, isGuest } = useAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [usingMock, setUsingMock] = useState(false)

  const loadMock = useCallback(
    (targetSpace: Space) => {
      const filtered = MOCK_POSTS.filter((p) => p.space === targetSpace)
      setPosts(filtered)
      setHasMore(false)
      setUsingMock(true)
      setIsLoading(false)
      setRefreshing(false)
    },
    []
  )

  const fetchPosts = useCallback(
    async (pageNum: number, targetSpace: Space = space) => {
      if (isGuest || !session?.accessToken) {
        loadMock(targetSpace)
        return
      }

      try {
        if (pageNum === 0) setIsLoading(true)
        const response = await fetch(
          `${API_URL}/api/posts?space=${targetSpace}&page=${pageNum}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        )

        if (!response.ok) throw new Error('Failed to fetch posts')

        const data = await response.json()
        const next = data.posts || []

        if (!next.length && pageNum === 0) {
          loadMock(targetSpace)
          return
        }

        setUsingMock(false)
        if (pageNum === 0) {
          setPosts(next)
        } else {
          setPosts((prev) => [...prev, ...next])
        }
        setHasMore(Boolean(data.hasMore))
      } catch (error) {
        console.error('Error fetching posts:', error)
        if (pageNum === 0) loadMock(targetSpace)
      } finally {
        setIsLoading(false)
        setRefreshing(false)
      }
    },
    [isGuest, session?.accessToken, space, loadMock]
  )

  useEffect(() => {
    setPage(0)
    fetchPosts(0, space)
  }, [space, fetchPosts])

  const handleLoadMore = () => {
    if (hasMore && !isLoading && !usingMock) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  const handleLike = async (postId: string) => {
    if (!session || isGuest) return
    try {
      await fetch(`${API_URL}/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="GRAY SPACE" showSearch showProfile />
      <SpaceSelector selectedSpace={space} onSpaceChange={setSpace} />

      {isLoading && page === 0 ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No posts in {space === 'grey' ? 'Gray' : space} space yet.
          </Text>
          <Text style={[styles.emptyHint, { color: colors.textSecondary }]}>
            Tap the orb to create the first one.
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              likeCount={item.likes?.[0]?.count || 0}
              onPress={() => router.push('/post-details')}
              onLike={() => handleLike(item.id)}
              onComment={() => router.push('/post-details')}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true)
                setPage(0)
                fetchPosts(0)
              }}
              tintColor={colors.text}
            />
          }
          ListFooterComponent={
            isLoading && page > 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={colors.text} />
              </View>
            ) : (
              <View style={{ height: 110 }} />
            )
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
})

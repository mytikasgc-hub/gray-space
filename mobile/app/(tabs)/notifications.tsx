import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Header } from '../../components/header'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import {
  MOCK_NOTIFICATIONS,
  MockNotification,
  formatRelativeTime,
} from '../../lib/mock-data'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

function iconForType(type: string): keyof typeof MaterialIcons.glyphMap {
  switch (type) {
    case 'like':
      return 'favorite'
    case 'comment':
      return 'chat-bubble'
    case 'follow':
      return 'person-add'
    case 'message':
      return 'mail'
    case 'verification':
      return 'verified'
    case 'mention':
      return 'alternate-email'
    default:
      return 'notifications'
  }
}

export default function NotificationsScreen() {
  const { colors } = useTheme()
  const { session, isGuest } = useAuth()
  const [items, setItems] = useState<MockNotification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    if (isGuest || !session?.accessToken) {
      setItems(MOCK_NOTIFICATIONS)
      setIsLoading(false)
      setRefreshing(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      const next = data.notifications || []
      setItems(next.length ? next : MOCK_NOTIFICATIONS)
    } catch {
      setItems(MOCK_NOTIFICATIONS)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [isGuest, session?.accessToken])

  useEffect(() => {
    load()
  }, [load])

  const markRead = async (id: string) => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read_at: n.read_at || new Date().toISOString() } : n
      )
    )

    if (isGuest || !session?.accessToken) return

    try {
      await fetch(`${API_URL}/api/notifications`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: [id] }),
      })
    } catch {
      // keep optimistic UI
    }
  }

  const markAllRead = async () => {
    const unread = items.filter((n) => !n.read_at).map((n) => n.id)
    setItems((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    )
    if (isGuest || !session?.accessToken || unread.length === 0) return
    try {
      await fetch(`${API_URL}/api/notifications`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds: unread }),
      })
    } catch {
      // ignore
    }
  }

  const unreadCount = items.filter((n) => !n.read_at).length

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="GRAY SPACE" showSearch showProfile />

      <View style={styles.titleRow}>
        <View>
          <Text style={[styles.heading, { color: colors.text }]}>
            Notifications
          </Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>
            {unreadCount > 0
              ? `${unreadCount} new across your spaces`
              : 'You are all caught up'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={[styles.markAll, { color: colors.text }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true)
                load()
              }}
              tintColor={colors.text}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={{ color: colors.textSecondary }}>
                No notifications yet
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const unread = !item.read_at
            return (
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    backgroundColor: unread ? colors.card : 'transparent',
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => markRead(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.avatarWrap}>
                  {item.actor?.avatar_url ? (
                    <Image
                      source={{ uri: item.actor.avatar_url }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.avatar,
                        styles.avatarFallback,
                        { backgroundColor: colors.border },
                      ]}
                    >
                      <MaterialIcons
                        name={iconForType(item.type)}
                        size={18}
                        color={colors.textSecondary}
                      />
                    </View>
                  )}
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: colors.background, borderColor: colors.border },
                    ]}
                  >
                    <MaterialIcons
                      name={iconForType(item.type)}
                      size={12}
                      color={colors.text}
                    />
                  </View>
                </View>

                <View style={styles.body}>
                  <Text style={[styles.bodyText, { color: colors.text }]}>
                    {item.actor ? (
                      <Text style={styles.actor}>{item.actor.username} </Text>
                    ) : null}
                    {item.content}
                  </Text>
                  {item.post?.content ? (
                    <Text
                      style={[styles.postPreview, { color: colors.textSecondary }]}
                      numberOfLines={1}
                    >
                      {item.post.content}
                    </Text>
                  ) : null}
                  <Text style={[styles.time, { color: colors.textSecondary }]}>
                    {formatRelativeTime(item.created_at)}
                  </Text>
                </View>

                {unread && (
                  <View
                    style={[styles.dot, { backgroundColor: colors.success }]}
                  />
                )}
              </TouchableOpacity>
            )
          }}
          ListFooterComponent={<View style={{ height: 110 }} />}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 13,
    marginTop: 4,
  },
  markAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarWrap: {
    width: 48,
    height: 48,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  body: { flex: 1 },
  bodyText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actor: {
    fontWeight: '700',
  },
  postPreview: {
    fontSize: 12,
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})

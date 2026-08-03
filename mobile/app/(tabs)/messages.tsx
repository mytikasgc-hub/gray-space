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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Header } from '../../components/header'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MockConversation,
  MockMessage,
  formatRelativeTime,
} from '../../lib/mock-data'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function MessagesScreen() {
  const { colors } = useTheme()
  const { session, user, isGuest } = useAuth()
  const insets = useSafeAreaInsets()
  const [conversations, setConversations] = useState<MockConversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [active, setActive] = useState<MockConversation | null>(null)
  const [thread, setThread] = useState<MockMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const myId = user?.id || 'guest'

  const otherUser = (c: MockConversation) =>
    c.user_1_id === myId ? c.user_2 : c.user_1

  const load = useCallback(async () => {
    if (isGuest || !session?.accessToken) {
      setConversations(MOCK_CONVERSATIONS)
      setIsLoading(false)
      setRefreshing(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      })
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      const next = data.conversations || []
      setConversations(next.length ? next : MOCK_CONVERSATIONS)
    } catch {
      setConversations(MOCK_CONVERSATIONS)
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [isGuest, session?.accessToken])

  useEffect(() => {
    load()
  }, [load])

  const openThread = async (conversation: MockConversation) => {
    setActive(conversation)
    setDraft('')

    if (isGuest || !session?.accessToken) {
      setThread(MOCK_MESSAGES[conversation.id] || [])
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/messages?conversationId=${conversation.id}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      )
      if (!response.ok) throw new Error('Failed')
      const data = await response.json()
      const next = data.messages || []
      setThread(next.length ? next : MOCK_MESSAGES[conversation.id] || [])
    } catch {
      setThread(MOCK_MESSAGES[conversation.id] || [])
    }
  }

  const sendMessage = async () => {
    if (!active || !draft.trim()) return
    const content = draft.trim()
    const optimistic: MockMessage = {
      id: `local-${Date.now()}`,
      sender_id: myId,
      content,
      created_at: new Date().toISOString(),
      read_at: null,
    }
    setThread((prev) => [...prev, optimistic])
    setDraft('')
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, last_message: content, last_message_at: optimistic.created_at, unread: 0 }
          : c
      )
    )

    if (isGuest || !session?.accessToken) return

    try {
      setSending(true)
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: active.id,
          content,
        }),
      })
    } catch {
      // keep optimistic
    } finally {
      setSending(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="GRAY SPACE" showSearch showProfile />

      <View style={styles.titleRow}>
        <Text style={[styles.heading, { color: colors.text }]}>Messages</Text>
        <Text style={[styles.sub, { color: colors.textSecondary }]}>
          Direct lines across White, Gray, and Black
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.text} />
        </View>
      ) : (
        <FlatList
          data={conversations}
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
                No conversations yet
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const other = otherUser(item)
            const unread = item.unread || 0
            return (
              <TouchableOpacity
                style={[
                  styles.row,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => openThread(item)}
                activeOpacity={0.85}
              >
                {other.avatar_url ? (
                  <Image source={{ uri: other.avatar_url }} style={styles.avatar} />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
                    ]}
                  >
                    <MaterialIcons name="person" size={20} color={colors.textSecondary} />
                  </View>
                )}
                <View style={styles.body}>
                  <View style={styles.topLine}>
                    <Text style={[styles.name, { color: colors.text }]}>
                      {other.username}
                    </Text>
                    <Text style={[styles.time, { color: colors.textSecondary }]}>
                      {formatRelativeTime(item.last_message_at)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.preview,
                      {
                        color: unread ? colors.text : colors.textSecondary,
                        fontWeight: unread ? '600' : '400',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.last_message || 'Say hello'}
                  </Text>
                </View>
                {unread > 0 && (
                  <View style={[styles.unread, { backgroundColor: colors.text }]}>
                    <Text
                      style={[
                        styles.unreadText,
                        { color: colors.inverseText },
                      ]}
                    >
                      {unread}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          }}
          ListFooterComponent={<View style={{ height: 110 }} />}
        />
      )}

      <Modal
        visible={!!active}
        animationType="slide"
        onRequestClose={() => setActive(null)}
      >
        <KeyboardAvoidingView
          style={[styles.thread, { backgroundColor: colors.background }]}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={[
              styles.threadHeader,
              {
                paddingTop: Math.max(insets.top, 12),
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setActive(null)} hitSlop={12}>
              <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.threadTitle, { color: colors.text }]}>
              {active ? otherUser(active).username : ''}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <FlatList
            data={thread}
            keyExtractor={(m) => m.id}
            contentContainerStyle={styles.threadList}
            renderItem={({ item }) => {
              const mine = item.sender_id === myId
              return (
                <View
                  style={[
                    styles.bubble,
                    mine ? styles.bubbleMine : styles.bubbleTheirs,
                    {
                      backgroundColor: mine ? colors.text : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: mine ? colors.inverseText : colors.text,
                      fontSize: 15,
                      lineHeight: 20,
                    }}
                  >
                    {item.content}
                  </Text>
                </View>
              )
            }}
          />

          <View
            style={[
              styles.composer,
              {
                borderTopColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 10),
              },
            ]}
          >
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Message…"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!draft.trim() || sending}
              style={[
                styles.send,
                {
                  backgroundColor: colors.text,
                  opacity: draft.trim() ? 1 : 0.4,
                },
              ]}
            >
              <MaterialIcons
                name="arrow-upward"
                size={20}
                color={colors.inverseText}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
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
    padding: 14,
    borderRadius: 18,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  body: { flex: 1 },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  time: {
    fontSize: 11,
  },
  preview: {
    fontSize: 13,
  },
  unread: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '700',
  },
  thread: { flex: 1 },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  threadTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  threadList: {
    padding: 16,
    gap: 8,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  bubbleMine: {
    alignSelf: 'flex-end',
  },
  bubbleTheirs: {
    alignSelf: 'flex-start',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 15,
  },
  send: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

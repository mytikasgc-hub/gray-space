import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme, SPACE_COPY } from '../lib/theme-context'
import { formatRelativeTime } from '../lib/mock-data'

interface Post {
  id: string
  content: string
  image_url?: string
  user_id: string
  created_at: string
  profiles: {
    username: string
    avatar_url?: string
    verification_level: string
  }
  likes?: { count: number }[]
  comment_count?: number
  community_reviewers?: number
  community_hours_left?: number
  reviewer_avatars?: string[]
}

interface PostCardProps {
  post: Post
  likeCount?: number
  isLiked?: boolean
  onPress: () => void
  onLike?: () => void
  onComment?: () => void
}

export function PostCard({
  post,
  likeCount = 0,
  isLiked = false,
  onPress,
  onLike,
  onComment,
}: PostCardProps) {
  const { colors, space } = useTheme()
  const [liked, setLiked] = useState(isLiked)
  const [bookmarked, setBookmarked] = useState(false)
  const comments = post.comment_count ?? 0

  const handleLike = () => {
    setLiked(!liked)
    onLike?.()
  }

  const moderationLabel = SPACE_COPY[space].moderation

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.profiles.avatar_url ? (
            <Image
              source={{ uri: post.profiles.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.border }]} />
          )}

          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.username, { color: colors.text }]}>
                {post.profiles.username}
              </Text>
              {space === 'white' &&
                post.profiles.verification_level !== 'unverified' && (
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color={colors.success}
                  />
                )}
            </View>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatRelativeTime(post.created_at)}
            </Text>
          </View>
        </View>

        <TouchableOpacity hitSlop={12}>
          <MaterialIcons name="more-horiz" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.content, { color: colors.text }]}>
        {post.content}
      </Text>

      {post.image_url ? (
        <Image
          source={{ uri: post.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={handleLike} hitSlop={8}>
          <MaterialIcons
            name={liked ? 'favorite' : 'favorite-border'}
            size={22}
            color={liked ? colors.danger : colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onComment} hitSlop={8}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} hitSlop={8}>
          <MaterialIcons
            name="repeat"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => setBookmarked(!bookmarked)}
          hitSlop={8}
        >
          <MaterialIcons
            name={bookmarked ? 'bookmark' : 'bookmark-border'}
            size={22}
            color={bookmarked ? colors.text : colors.textSecondary}
          />
        </TouchableOpacity>

        {(likeCount > 0 || comments > 0) && (
          <Text style={[styles.counts, { color: colors.textSecondary }]}>
            {likeCount > 0 ? `${likeCount}` : ''}
            {likeCount > 0 && comments > 0 ? ' · ' : ''}
            {comments > 0 ? `${comments}` : ''}
          </Text>
        )}
      </View>

      {/* Moderation status — matches concept art */}
      <View
        style={[
          styles.moderation,
          { backgroundColor: colors.badgeBg },
        ]}
      >
        {space === 'white' && (
          <View style={styles.modRow}>
            <Text style={styles.modEmoji}>✅</Text>
            <Text style={[styles.modText, { color: colors.badge }]}>
              {moderationLabel}
            </Text>
          </View>
        )}

        {space === 'grey' && (
          <View style={styles.modRow}>
            <View style={styles.avatarStack}>
              {(post.reviewer_avatars || []).slice(0, 3).map((uri, i) => (
                <Image
                  key={uri + i}
                  source={{ uri }}
                  style={[
                    styles.stackAvatar,
                    { marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i },
                  ]}
                />
              ))}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modText, { color: colors.badge }]}>
                {moderationLabel}
                {post.community_hours_left
                  ? ` · ${post.community_hours_left}h left`
                  : ''}
              </Text>
              {post.community_reviewers ? (
                <Text style={[styles.modSub, { color: colors.textSecondary }]}>
                  {post.community_reviewers} reviewing
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {space === 'black' && (
          <View style={styles.modRow}>
            <Text style={styles.modEmoji}>🚫</Text>
            <Text style={[styles.modText, { color: colors.badge }]}>
              {moderationLabel}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 20,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: '#222',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingVertical: 4,
    marginBottom: 10,
  },
  action: {
    paddingVertical: 2,
  },
  counts: {
    marginLeft: 'auto',
    fontSize: 12,
    fontWeight: '500',
  },
  moderation: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modEmoji: {
    fontSize: 14,
  },
  modText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  modSub: {
    fontSize: 11,
    marginTop: 2,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  stackAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
})

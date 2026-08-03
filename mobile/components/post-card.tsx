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
import { formatRelativeTime, formatCount } from '../lib/mock-data'

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
  repost_count?: number
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
  const [likeTotal, setLikeTotal] = useState(likeCount)
  const [bookmarked, setBookmarked] = useState(false)
  const comments = post.comment_count ?? 0
  const reposts = post.repost_count ?? Math.max(1, Math.round(comments * 0.6))

  const handleLike = () => {
    setLiked(!liked)
    setLikeTotal((n) => (liked ? n - 1 : n + 1))
    onLike?.()
  }

  const isVerifiedAvatar =
    space === 'white' && post.profiles.verification_level !== 'unverified'

  const moderationIcon =
    space === 'white' ? 'check-circle' : space === 'black' ? 'warning' : null

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
      activeOpacity={0.94}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrap}>
            {post.profiles.avatar_url ? (
              <Image
                source={{ uri: post.profiles.avatar_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, { backgroundColor: colors.border }]} />
            )}
            {isVerifiedAvatar && (
              <View
                style={[
                  styles.avatarBadge,
                  { backgroundColor: colors.verifiedBadge, borderColor: colors.card },
                ]}
              >
                <MaterialIcons name="check" size={10} color="#FFFFFF" />
              </View>
            )}
          </View>

          <View style={styles.userDetails}>
            <Text style={[styles.username, { color: colors.text }]}>
              {post.profiles.username}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatRelativeTime(post.created_at)}
            </Text>
          </View>
        </View>

        <TouchableOpacity hitSlop={12}>
          <MaterialIcons name="more-horiz" size={20} color={colors.textSecondary} />
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
            size={20}
            color={liked ? colors.danger : colors.textSecondary}
          />
          <Text
            style={[
              styles.actionCount,
              { color: liked ? colors.danger : colors.textSecondary },
            ]}
          >
            {formatCount(likeTotal)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={onComment} hitSlop={8}>
          <MaterialIcons name="chat-bubble-outline" size={19} color={colors.textSecondary} />
          <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
            {formatCount(comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} hitSlop={8}>
          <MaterialIcons name="repeat" size={20} color={colors.textSecondary} />
          <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
            {formatCount(reposts)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bookmarkAction}
          onPress={() => setBookmarked(!bookmarked)}
          hitSlop={8}
        >
          <MaterialIcons
            name={bookmarked ? 'bookmark' : 'bookmark-border'}
            size={20}
            color={bookmarked ? colors.text : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Moderation status — matches concept art */}
      <View
        style={[
          styles.moderation,
          { backgroundColor: colors.moderationBg },
        ]}
      >
        {space === 'grey' ? (
          <>
            <View style={styles.modTopRow}>
              <Text style={[styles.modTitle, { color: colors.moderationColor }]}>
                {SPACE_COPY.grey.moderationTitle}
              </Text>
              <View style={styles.avatarStack}>
                {(post.reviewer_avatars || []).slice(0, 3).map((uri, i) => (
                  <Image
                    key={uri + i}
                    source={{ uri }}
                    style={[
                      styles.stackAvatar,
                      { marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i, borderColor: colors.moderationBg },
                    ]}
                  />
                ))}
              </View>
              <MaterialIcons name="chevron-right" size={18} color={colors.textSecondary} />
            </View>
            <Text style={[styles.modSub, { color: colors.textSecondary }]}>
              {post.community_hours_left ? `${post.community_hours_left}h left · ` : ''}
              {post.community_reviewers ?? 0} {SPACE_COPY.grey.moderationSubtitle}
            </Text>
          </>
        ) : (
          <View style={styles.modRow}>
            <View
              style={[
                styles.modIconWrap,
                { backgroundColor: colors.moderationIconBg },
              ]}
            >
              <MaterialIcons
                name={moderationIcon as any}
                size={14}
                color={colors.moderationColor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.modTitle, { color: colors.moderationColor }]}>
                {SPACE_COPY[space].moderationTitle}
              </Text>
              <Text style={[styles.modSub, { color: colors.textSecondary, marginTop: 2 }]}>
                {SPACE_COPY[space].moderationSubtitle}
              </Text>
            </View>
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
  avatarWrap: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  userDetails: {
    flex: 1,
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
    gap: 22,
    paddingVertical: 4,
    marginBottom: 10,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  actionCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookmarkAction: {
    marginLeft: 'auto',
    paddingVertical: 2,
  },
  moderation: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  modTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  modIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modTitle: {
    fontSize: 13,
    fontWeight: '700',
    flexShrink: 1,
  },
  modSub: {
    fontSize: 11.5,
    lineHeight: 15,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 4,
  },
  stackAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
  },
})

import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from '../lib/theme-context'
import { useAuth } from '../lib/auth-context'

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
  likes?: any[]
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
  const { user } = useAuth()
  const [liked, setLiked] = useState(isLiked)

  const handleLike = () => {
    setLiked(!liked)
    onLike?.()
  }

  const getBadgeColor = () => {
    if (space === 'white' && post.profiles.verification_level === 'verified') {
      return colors.success
    }
    if (space === 'grey') {
      return colors.badge
    }
    if (space === 'black') {
      return colors.badge
    }
    return colors.textSecondary
  }

  const getVerificationIcon = () => {
    if (post.profiles.verification_level === 'expert') return 'verified'
    if (post.profiles.verification_level === 'verified') return 'check-circle'
    return 'help-outline'
  }

  const getModerationBadge = () => {
    if (space === 'white') {
      return {
        icon: 'verified',
        label: 'AI Moderated',
        color: colors.success,
        bgColor: '#D1FAE5',
      }
    }
    if (space === 'grey') {
      return {
        icon: 'groups',
        label: 'Community check in progress',
        color: colors.badge,
        bgColor: '#FEF3C7',
      }
    }
    return {
      icon: 'block',
      label: 'Zero Moderation',
      color: colors.badge,
      bgColor: '#FEE2E2',
    }
  }

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      marginHorizontal: 12,
      marginVertical: 8,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: space === 'white' ? 0.05 : 0,
      shadowRadius: 8,
      elevation: space === 'white' ? 2 : 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.border,
    },
    userDetails: {
      flex: 1,
    },
    username: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: colors.background,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: '500',
      color: getBadgeColor(),
    },
    content: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.text,
      marginBottom: 12,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    action: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    actionText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  })

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {post.profiles.avatar_url && (
            <Image
              source={{ uri: post.profiles.avatar_url }}
              style={styles.avatar}
            />
          )}
          {!post.profiles.avatar_url && <View style={styles.avatar} />}

          <View style={styles.userDetails}>
            <Text style={styles.username}>{post.profiles.username}</Text>
            <Text style={styles.timestamp}>
              {new Date(post.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {space === 'white' && (
          <View style={styles.badge}>
            <MaterialIcons
              name={getVerificationIcon() as any}
              size={14}
              color={getBadgeColor()}
            />
            <Text style={styles.badgeText}>
              {post.profiles.verification_level}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.content} numberOfLines={4}>
        {post.content}
      </Text>

      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Moderation Badge */}
      <View
        style={{
          backgroundColor: getModerationBadge().bgColor,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 8,
          marginBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <MaterialIcons
          name={getModerationBadge().icon as any}
          size={14}
          color={getModerationBadge().color}
        />
        <Text
          style={{
            fontSize: 11,
            fontWeight: '500',
            color: getModerationBadge().color,
          }}
        >
          {getModerationBadge().label}
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.action}
          onPress={handleLike}
          hitSlop={10}
        >
          <MaterialIcons
            name={liked ? 'favorite' : 'favorite-border'}
            size={18}
            color={liked ? colors.warning : colors.textSecondary}
          />
          <Text style={styles.actionText}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={onComment}
          hitSlop={10}
        >
          <MaterialIcons
            name="comment-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} hitSlop={10}>
          <MaterialIcons
            name="share-outlined"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

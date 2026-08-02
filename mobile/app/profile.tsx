import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, SPACE_COPY } from '../lib/theme-context'
import { useAuth } from '../lib/auth-context'
import { MOCK_POSTS } from '../lib/mock-data'
import { BrandLogo } from '../components/brand-logo'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors, space } = useTheme()
  const { user, session, isGuest, signOut } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProfile()
  }, [user?.id, isGuest])

  const loadProfile = async () => {
    if (!user?.id) return

    if (isGuest) {
      setProfile({
        ...user,
        trust_score: 12,
        accuracy_percentage: 0,
        total_posts: MOCK_POSTS.length,
        posts_by_space: {
          white: MOCK_POSTS.filter((p) => p.space === 'white').length,
          grey: MOCK_POSTS.filter((p) => p.space === 'grey').length,
          black: MOCK_POSTS.filter((p) => p.space === 'black').length,
        },
      })
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })
      if (!response.ok) throw new Error('Failed')
      setProfile(await response.json())
    } catch {
      setProfile(user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Leave Gray Space?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <ActivityIndicator color={colors.text} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top, 12),
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <BrandLogo size={22} />
          <Text style={[styles.topTitle, { color: colors.text }]}>Profile</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.border }]} />
          )}
          <Text style={[styles.username, { color: colors.text }]}>
            {profile?.username || 'you'}
          </Text>
          {profile?.bio ? (
            <Text style={[styles.bio, { color: colors.textSecondary }]}>
              {profile.bio}
            </Text>
          ) : null}

          <View
            style={[
              styles.badge,
              { backgroundColor: colors.badgeBg },
            ]}
          >
            <MaterialIcons
              name={
                profile?.verification_level === 'verified'
                  ? 'verified'
                  : 'shield'
              }
              size={14}
              color={colors.badge}
            />
            <Text style={[styles.badgeText, { color: colors.badge }]}>
              {profile?.verification_level === 'verified'
                ? 'Verified · White Space only'
                : 'Unverified · verify in White Space'}
            </Text>
          </View>

          {isGuest && (
            <Text style={[styles.guestNote, { color: colors.textSecondary }]}>
              Exploring shell mode · current space {SPACE_COPY[space].label}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.stats,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?.trust_score || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Trust
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {Math.round(profile?.accuracy_percentage || 0)}%
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Accuracy
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {profile?.total_posts || 0}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Posts
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, { borderColor: colors.border }]}
          onPress={handleSignOut}
        >
          <MaterialIcons name="logout" size={20} color={colors.danger} />
          <Text style={[styles.signOutText, { color: colors.danger }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 14,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
  },
  bio: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  guestNote: {
    marginTop: 10,
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    borderRadius: 18,
    paddingVertical: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  stat: { alignItems: 'center' },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
})

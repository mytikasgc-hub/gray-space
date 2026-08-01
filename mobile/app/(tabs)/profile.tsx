import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'
import { PostCard } from '../../components/post-card'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

interface UserProfile {
  id: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  verification_level: string
  trust_score: number
  reputation_score: number
  accuracy_percentage: number
  posts_by_space?: {
    white: number
    grey: number
    black: number
  }
  total_posts?: number
}

export default function ProfileScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user, session, signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user?.id])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_URL}/api/users/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut()
          router.replace('/(auth)/login')
        },
      },
    ])
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    username: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      backgroundColor: colors.card,
      marginBottom: 12,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: '500',
      color: colors.badge,
      textTransform: 'capitalize',
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      marginHorizontal: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    sectionHeader: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 16,
      marginTop: 16,
      marginBottom: 8,
    },
    postsContainer: {
      paddingHorizontal: 0,
    },
    signOutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 16,
      backgroundColor: colors.warning,
      borderRadius: 8,
      justifyContent: 'center',
    },
    signOutText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  })

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {profile?.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar} />
              )}

              <Text style={styles.username}>{profile?.username}</Text>
              <Text style={styles.email}>{profile?.email}</Text>

              <View style={styles.badge}>
                <MaterialIcons
                  name="verified"
                  size={14}
                  color={colors.badge}
                />
                <Text style={styles.badgeText}>
                  {profile?.verification_level}
                </Text>
              </View>
            </View>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {profile?.trust_score || 0}
                </Text>
                <Text style={styles.statLabel}>Trust Score</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {Math.round(profile?.accuracy_percentage || 0)}%
                </Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {profile?.total_posts || 0}
                </Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
            </View>

            {profile?.bio && (
              <Text
                style={{
                  marginHorizontal: 16,
                  marginTop: 16,
                  fontSize: 14,
                  color: colors.text,
                  lineHeight: 20,
                }}
              >
                {profile.bio}
              </Text>
            )}

            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <MaterialIcons name="logout" size={20} color="#FFFFFF" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </>
        }
        renderItem={() => null}
        keyExtractor={() => 'header'}
      />
    </SafeAreaView>
  )
}

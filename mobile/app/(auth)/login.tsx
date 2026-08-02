import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../lib/auth-context'
import { useTheme, Space, SPACE_COPY } from '../../lib/theme-context'
import { performAppleSignIn } from '../../lib/apple-auth'
import { BrandLogo } from '../../components/brand-logo'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

const SPACES: Space[] = ['white', 'grey', 'black']

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { signIn, signInAsGuest } = useAuth()
  const { space, setSpace } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [guestLoading, setGuestLoading] = useState(false)

  const handleAppleSignIn = async () => {
    try {
      setIsLoading(true)
      const { accessToken, refreshToken, user } = await performAppleSignIn(
        API_URL
      )
      await signIn(accessToken, refreshToken, user)
      router.replace('/(tabs)/feed')
    } catch (error: any) {
      console.error('Sign in error:', error)
      if (error.message !== 'Sign in was cancelled') {
        Alert.alert(
          'Sign In Failed',
          error.message || 'An error occurred during sign in'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGuest = async () => {
    try {
      setGuestLoading(true)
      await signInAsGuest()
      router.replace('/(tabs)/feed')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not open shell')
    } finally {
      setGuestLoading(false)
    }
  }

  const sphereColor = (s: Space) => {
    if (s === 'white') return '#FFFFFF'
    if (s === 'grey') return '#9CA3AF'
    return '#111111'
  }

  return (
    <View style={[styles.root, { backgroundColor: '#0B0B0C' }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 24) + 24,
            paddingBottom: Math.max(insets.bottom, 24) + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroLogo}>
          <BrandLogo size={112} />
        </View>
        <Text style={styles.brand}>GRAY SPACE</Text>
        <Text style={styles.tagline}>Three spaces. Your choice.</Text>

        <Text style={styles.choose}>CHOOSE YOUR SPACE.</Text>

        <View style={styles.spaceList}>
          {SPACES.map((s) => {
            const active = space === s
            const copy = SPACE_COPY[s]
            return (
              <TouchableOpacity
                key={s}
                style={[
                  styles.spaceRow,
                  active && styles.spaceRowActive,
                ]}
                onPress={() => setSpace(s)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.spaceDot,
                    {
                      backgroundColor: sphereColor(s),
                      borderColor:
                        s === 'white' ? '#CCC' : 'rgba(255,255,255,0.2)',
                    },
                  ]}
                />
                <View style={styles.spaceCopy}>
                  <Text style={styles.spaceTitle}>{copy.title}</Text>
                  <Text style={styles.spaceSub}>{copy.subtitle}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{SPACE_COPY[space].title}</Text>
          {space === 'white' && (
            <Text style={styles.detailBody}>
              Fully moderated by AI. Text is read and corrected for mistakes.
              This is the only place you can be verified.
            </Text>
          )}
          {space === 'grey' && (
            <Text style={styles.detailBody}>
              Half moderation. Community notes can take time — balanced freedom
              with shared responsibility.
            </Text>
          )}
          {space === 'black' && (
            <Text style={styles.detailBody}>
              Zero moderation. Conspiracy, raw takes, no limits — everything is
              user responsibility.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleSignIn}
          disabled={isLoading || guestLoading}
          activeOpacity={0.9}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.appleText}> Sign in with Apple</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={handleGuest}
          disabled={isLoading || guestLoading}
          activeOpacity={0.85}
        >
          {guestLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.guestText}>Explore the shell</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Shell mode uses sample posts, notifications, and messages so you can
          walk the product today.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  heroLogo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
  },
  tagline: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 28,
  },
  choose: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 14,
  },
  spaceList: {
    gap: 10,
    marginBottom: 18,
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  spaceRowActive: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  spaceDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
  },
  spaceCopy: {
    flex: 1,
  },
  spaceTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  spaceSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  chevron: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 22,
    fontWeight: '300',
  },
  detailCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  detailBody: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  appleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appleText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    marginBottom: 16,
  },
  guestText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footnote: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
  },
})

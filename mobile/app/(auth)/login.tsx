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
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../lib/auth-context'
import { Space, SPACE_COPY, SPACE_DOT_COLOR } from '../../lib/theme-context'
import { performAppleSignIn } from '../../lib/apple-auth'
import { BrandLogo } from '../../components/brand-logo'
import { SpaceCycleDiagram } from '../../components/space-cycle-diagram'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

const SPACES: Space[] = ['white', 'grey', 'black']

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { signIn, signInAsGuest } = useAuth()
  const [selectedSpace, setSelectedSpace] = useState<Space>('white')
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

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 20,
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <BrandLogo size={84} />
          <Text style={styles.brand}>GRAY SPACE</Text>
          <Text style={styles.tagline}>Three Spaces. Your Choice.</Text>
        </View>

        {/* Compact legend — matches concept art top row */}
        <View style={styles.legendRow}>
          {SPACES.map((s) => (
            <View key={s} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor: SPACE_DOT_COLOR[s],
                    borderColor:
                      s === 'black' ? '#3F3F46' : 'rgba(255,255,255,0.35)',
                  },
                ]}
              />
              <Text style={styles.legendLabel}>{SPACE_COPY[s].label}</Text>
              <Text style={styles.legendDesc}>{SPACE_COPY[s].legend}</Text>
            </View>
          ))}
        </View>

        {/* Step 1 — simple, single picker (no duplicate lists) */}
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>1</Text>
          </View>
          <Text style={styles.stepTitle}>Pick a space to start in</Text>
        </View>

        <View style={styles.spaceList}>
          {SPACES.map((s) => {
            const active = selectedSpace === s
            const copy = SPACE_COPY[s]
            return (
              <TouchableOpacity
                key={s}
                style={[styles.spaceRow, active && styles.spaceRowActive]}
                onPress={() => setSelectedSpace(s)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.spaceDot,
                    {
                      backgroundColor: SPACE_DOT_COLOR[s],
                      borderColor:
                        s === 'black' ? '#3F3F46' : 'rgba(255,255,255,0.3)',
                    },
                  ]}
                />
                <View style={styles.spaceCopy}>
                  <Text style={styles.spaceTitle}>{copy.title}</Text>
                  <Text style={styles.spaceSub}>{copy.subtitle}</Text>
                </View>
                <View
                  style={[
                    styles.checkCircle,
                    active && styles.checkCircleActive,
                  ]}
                >
                  {active && (
                    <MaterialIcons name="check" size={14} color="#000000" />
                  )}
                </View>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.switchNote}>
          <SpaceCycleDiagram size={40} />
          <Text style={styles.switchNoteText}>
            You can switch spaces anytime after signing in — nothing here is
            permanent.
          </Text>
        </View>

        {/* Step 2 — sign in */}
        <View style={styles.stepHeader}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>2</Text>
          </View>
          <Text style={styles.stepTitle}>Sign in to continue</Text>
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
            <>
              <FontAwesome name="apple" size={18} color="#000" />
              <Text style={styles.appleText}>Continue with Apple</Text>
            </>
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
            <Text style={styles.guestText}>Try it as a guest</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footnote}>
          Guest mode shows sample posts, notifications, and messages so you can
          explore before signing in.
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  content: {
    paddingHorizontal: 22,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3,
    textAlign: 'center',
    marginTop: 14,
  },
  tagline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 28,
  },
  legendItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    marginBottom: 6,
  },
  legendLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 3,
  },
  legendDesc: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10.5,
    lineHeight: 14,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  spaceList: {
    gap: 10,
    marginBottom: 16,
  },
  spaceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  spaceRowActive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.35)',
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
    letterSpacing: 0.4,
  },
  spaceSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  switchNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 28,
  },
  switchNoteText: {
    flex: 1,
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    lineHeight: 17,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    minHeight: 52,
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
    borderColor: 'rgba(255,255,255,0.25)',
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

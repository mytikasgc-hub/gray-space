import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../lib/auth-context'
import { useTheme } from '../../lib/theme-context'
import { performAppleSignIn } from '../../lib/apple-auth'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 40,
      textAlign: 'center',
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 12,
      minHeight: 48,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      maxWidth: 300,
    },
    buttonText: {
      color: colors.background === '#FFFFFF' ? '#000000' : '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Grey Spaces</Text>
        <Text style={styles.subtitle}>Three Spaces. Your Choice.</Text>

        <Text style={styles.description}>
          Join a community where every opinion finds its place. From verified
          facts to open discussions.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleAppleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator
              color={
                styles.buttonText.color === '#000000'
                  ? '#000000'
                  : '#FFFFFF'
              }
            />
          ) : (
            <Text style={styles.buttonText}>Sign In with Apple</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

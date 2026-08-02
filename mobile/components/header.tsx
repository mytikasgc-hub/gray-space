import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../lib/theme-context'
import { useAuth } from '../lib/auth-context'
import { BrandLogo } from './brand-logo'

interface HeaderProps {
  showSearch?: boolean
  showProfile?: boolean
  title?: string
  onSearchPress?: () => void
}

export function Header({
  showSearch = true,
  showProfile = true,
  title = 'GRAY SPACE',
  onSearchPress,
}: HeaderProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const { user } = useAuth()

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 8),
          backgroundColor: colors.headerBg,
        },
      ]}
    >
      <View style={styles.content}>
        {showProfile ? (
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.side}
            hitSlop={8}
          >
            {user?.avatar_url || user?.user_metadata?.avatar_url ? (
              <Image
                source={{
                  uri: user?.avatar_url || user?.user_metadata?.avatar_url,
                }}
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
                <MaterialIcons name="person" size={20} color={colors.textSecondary} />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.side} />
        )}

        <View style={styles.brand}>
          <BrandLogo size={22} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        {showSearch ? (
          <TouchableOpacity
            style={styles.side}
            onPress={onSearchPress || (() => router.push('/(tabs)/search'))}
            hitSlop={8}
          >
            <MaterialIcons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View style={styles.side} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  side: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
  },
})

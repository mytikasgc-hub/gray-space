import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useTheme } from '../lib/theme-context'
import { useAuth } from '../lib/auth-context'

interface HeaderProps {
  showSearch?: boolean
  showProfile?: boolean
  title?: string
  onSearchPress?: () => void
  onProfilePress?: () => void
}

export function Header({
  showSearch = true,
  showProfile = true,
  title = 'GREY SPACE',
  onSearchPress,
  onProfilePress,
}: HeaderProps) {
  const router = useRouter()
  const { colors, space } = useTheme()
  const { user } = useAuth()

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: space === 'white' ? 1 : 0,
      borderBottomColor: colors.border,
    },
    content: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
    },
    left: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flex: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.border,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    right: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    searchButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: colors.border,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.left}>
          {showProfile && (
            <TouchableOpacity
              onPress={onProfilePress}
              style={styles.profileButton}
            >
              {user?.user_metadata?.avatar_url ? (
                <Image
                  source={{ uri: user.user_metadata.avatar_url }}
                  style={styles.profileButton}
                />
              ) : (
                <View style={styles.profileButton} />
              )}
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        <View style={styles.right}>
          {showSearch && (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={onSearchPress}
            >
              <MaterialIcons name="search" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

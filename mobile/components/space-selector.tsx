import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme, Space } from '../lib/theme-context'

interface SpaceSelectorProps {
  selectedSpace: Space
  onSpaceChange: (space: Space) => void
}

export function SpaceSelector({
  selectedSpace,
  onSpaceChange,
}: SpaceSelectorProps) {
  const { colors } = useTheme()

  const spaces: Array<{ key: Space; label: string }> = [
    { key: 'white', label: 'WHITE' },
    { key: 'grey', label: 'GREY' },
    { key: 'black', label: 'BLACK' },
  ]

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tabActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tabText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.background === '#FFFFFF' ? '#000000' : '#FFFFFF',
    },
  })

  return (
    <View style={styles.container}>
      {spaces.map((space) => (
        <TouchableOpacity
          key={space.key}
          style={[
            styles.tab,
            selectedSpace === space.key && styles.tabActive,
          ]}
          onPress={() => onSpaceChange(space.key)}
        >
          <Text
            style={[
              styles.tabText,
              selectedSpace === space.key && styles.tabTextActive,
            ]}
          >
            {space.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

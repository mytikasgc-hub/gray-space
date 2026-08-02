import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme, Space, SPACE_COPY } from '../lib/theme-context'

interface SpaceSelectorProps {
  selectedSpace: Space
  onSpaceChange: (space: Space) => void
}

const SPACES: Space[] = ['white', 'grey', 'black']

export function SpaceSelector({
  selectedSpace,
  onSpaceChange,
}: SpaceSelectorProps) {
  const { colors } = useTheme()

  return (
    <View style={styles.wrap}>
      <View style={[styles.container, { backgroundColor: colors.segmentBg }]}>
        {SPACES.map((space) => {
          const active = selectedSpace === space
          return (
            <TouchableOpacity
              key={space}
              style={[
                styles.tab,
                active && {
                  backgroundColor: colors.segmentActive,
                  shadowColor: '#000',
                  shadowOpacity: 0.08,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                },
              ]}
              onPress={() => onSpaceChange(space)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: active
                      ? colors.segmentActiveText
                      : colors.segmentText,
                    fontWeight: active ? '700' : '600',
                  },
                ]}
              >
                {SPACE_COPY[space].label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 22,
    padding: 4,
    gap: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 18,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    letterSpacing: 1.2,
  },
})

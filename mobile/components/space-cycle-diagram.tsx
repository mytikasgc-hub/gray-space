import React from 'react'
import { View, StyleSheet } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Space, SPACE_DOT_COLOR } from '../lib/theme-context'

const ORDER: Space[] = ['white', 'grey', 'black']

/** Small triangular cycle graphic: White → Gray → Black → White, matching the concept art. */
export function SpaceCycleDiagram({ size = 84 }: { size?: number }) {
  const dot = size * 0.26
  const positions = [
    { top: 0, left: size / 2 - dot / 2 }, // white — top
    { top: size - dot, left: 0 }, // grey — bottom left
    { top: size - dot, left: size - dot }, // black — bottom right
  ]

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      {ORDER.map((space, i) => (
        <View
          key={space}
          style={[
            styles.dot,
            {
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              backgroundColor: SPACE_DOT_COLOR[space],
              top: positions[i].top,
              left: positions[i].left,
              borderColor: space === 'black' ? '#3F3F46' : 'rgba(255,255,255,0.4)',
            },
          ]}
        />
      ))}
      <View style={[styles.centerIcon, { top: size / 2 - 9, left: size / 2 - 9 }]}>
        <MaterialIcons name="autorenew" size={18} color="rgba(255,255,255,0.5)" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderStyle: 'dashed',
  },
  dot: {
    position: 'absolute',
    borderWidth: 2,
  },
  centerIcon: {
    position: 'absolute',
  },
})

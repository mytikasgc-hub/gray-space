import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../lib/theme-context'

type Props = BottomTabBarProps & {
  onCreatePress: () => void
}

const ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  feed: 'home',
  search: 'search',
  notifications: 'notifications-none',
  messages: 'mail-outline',
}

export function CustomTabBar({ state, descriptors, navigation, onCreatePress }: Props) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()

  const visibleRoutes = state.routes.filter(
    (r) => r.name !== 'create' && r.name !== 'profile'
  )

  return (
    <View
      style={[
        styles.wrap,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.tabBar,
            borderColor: colors.tabBarBorder,
          },
        ]}
      >
        {visibleRoutes.map((route, index) => {
          // Insert orb after search (2nd visible item)
          const isSearch = route.name === 'search'
          const { options } = descriptors[route.key]
          const isFocused =
            state.index === state.routes.findIndex((r) => r.key === route.key)

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const iconName = ICONS[route.name] || 'circle'
          const color = isFocused ? colors.tabActive : colors.tabInactive

          return (
            <React.Fragment key={route.key}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tab}
                activeOpacity={0.7}
              >
                <MaterialIcons name={iconName} size={26} color={color} />
              </TouchableOpacity>

              {isSearch && (
                <TouchableOpacity
                  key="create-orb"
                  onPress={onCreatePress}
                  style={styles.orbHit}
                  activeOpacity={0.85}
                  accessibilityLabel="Create post"
                >
                  <View
                    style={[
                      styles.orb,
                      {
                        backgroundColor: colors.orb,
                        shadowColor: colors.orbGlow,
                      },
                    ]}
                  >
                    <View style={styles.orbInner} />
                    <View style={styles.orbHighlight} />
                  </View>
                </TouchableOpacity>
              )}
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 420,
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
  tab: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbHit: {
    width: 64,
    height: 64,
    marginTop: -22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    overflow: 'hidden',
  },
  orbInner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  orbHighlight: {
    position: 'absolute',
    top: 6,
    left: 10,
    width: 18,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.55)',
    transform: [{ rotate: '-20deg' }],
  },
})

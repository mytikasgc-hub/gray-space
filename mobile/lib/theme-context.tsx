import React, { createContext, useContext, useState } from 'react'

export type Space = 'white' | 'grey' | 'black'

export interface ThemeColors {
  primary: string
  background: string
  text: string
  textSecondary: string
  border: string
  card: string
  cardBorder: string
  tabBar: string
  tabInactive: string
  tabActive: string
  badge: string
  badgeBg: string
  success: string
  warning: string
  danger: string
  orb: string
  orbGlow: string
  headerBg: string
  segmentBg: string
  segmentActive: string
  segmentActiveText: string
  segmentText: string
}

const SPACE_THEMES: Record<Space, ThemeColors> = {
  white: {
    primary: '#111111',
    background: '#FFFFFF',
    text: '#111111',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    card: '#FFFFFF',
    cardBorder: '#E8E8E8',
    tabBar: 'rgba(255,255,255,0.92)',
    tabInactive: '#9CA3AF',
    tabActive: '#111111',
    badge: '#059669',
    badgeBg: '#ECFDF5',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    orb: '#E8E8E8',
    orbGlow: 'rgba(0,0,0,0.12)',
    headerBg: '#FFFFFF',
    segmentBg: '#F3F4F6',
    segmentActive: '#FFFFFF',
    segmentActiveText: '#111111',
    segmentText: '#6B7280',
  },
  grey: {
    primary: '#F5F5F5',
    background: '#6B7280',
    text: '#F9FAFB',
    textSecondary: 'rgba(255,255,255,0.72)',
    border: 'rgba(255,255,255,0.18)',
    card: 'rgba(255,255,255,0.16)',
    cardBorder: 'rgba(255,255,255,0.22)',
    tabBar: 'rgba(40,40,45,0.55)',
    tabInactive: 'rgba(255,255,255,0.55)',
    tabActive: '#FFFFFF',
    badge: '#FBBF24',
    badgeBg: 'rgba(251,191,36,0.18)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    orb: 'rgba(255,255,255,0.55)',
    orbGlow: 'rgba(255,255,255,0.25)',
    headerBg: 'transparent',
    segmentBg: 'rgba(0,0,0,0.28)',
    segmentActive: 'rgba(255,255,255,0.85)',
    segmentActiveText: '#111111',
    segmentText: 'rgba(255,255,255,0.7)',
  },
  black: {
    primary: '#FFFFFF',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#A1A1AA',
    border: '#27272A',
    card: '#0A0A0A',
    cardBorder: '#27272A',
    tabBar: 'rgba(20,20,20,0.92)',
    tabInactive: '#71717A',
    tabActive: '#FFFFFF',
    badge: '#EF4444',
    badgeBg: 'rgba(239,68,68,0.12)',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#EF4444',
    orb: '#3F3F46',
    orbGlow: 'rgba(255,255,255,0.15)',
    headerBg: '#000000',
    segmentBg: '#18181B',
    segmentActive: '#27272A',
    segmentActiveText: '#FFFFFF',
    segmentText: '#71717A',
  },
}

export const SPACE_COPY: Record<
  Space,
  { label: string; title: string; subtitle: string; moderation: string }
> = {
  white: {
    label: 'WHITE',
    title: 'WHITE SPACE',
    subtitle: 'AI moderated for a safe and positive experience.',
    moderation:
      'AI Moderated. This post follows our community guidelines.',
  },
  grey: {
    label: 'GRAY',
    title: 'GRAY SPACE',
    subtitle: 'Community checked for balanced freedom.',
    moderation: 'Community check in progress',
  },
  black: {
    label: 'BLACK',
    title: 'BLACK SPACE',
    subtitle: 'Zero moderation. Total freedom.',
    moderation:
      'Zero Moderation. Everything here is user responsibility. Say what you want.',
  },
}

interface ThemeContextType {
  space: Space
  colors: ThemeColors
  setSpace: (space: Space) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [space, setSpace] = useState<Space>('white')

  return (
    <ThemeContext.Provider
      value={{
        space,
        colors: SPACE_THEMES[space],
        setSpace,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

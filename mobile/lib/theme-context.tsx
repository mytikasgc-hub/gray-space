import React, { createContext, useContext, useState } from 'react'

export type Space = 'white' | 'grey' | 'black'

export interface ThemeColors {
  primary: string
  background: string
  text: string
  /** Contrasting color to use for content placed on top of a `text`-colored fill (e.g. solid buttons/bubbles). */
  inverseText: string
  textSecondary: string
  border: string
  card: string
  cardBorder: string
  tabBar: string
  tabBarBorder: string
  tabInactive: string
  tabActive: string
  orb: string
  orbGlow: string
  headerBg: string
  segmentBg: string
  segmentActive: string
  segmentActiveText: string
  segmentText: string
  moderationColor: string
  moderationBg: string
  moderationIconBg: string
  success: string
  warning: string
  danger: string
  verifiedBadge: string
}

const SPACE_THEMES: Record<Space, ThemeColors> = {
  white: {
    primary: '#111111',
    background: '#FFFFFF',
    text: '#111111',
    inverseText: '#FFFFFF',
    textSecondary: '#6B7280',
    border: '#ECECEE',
    card: '#FFFFFF',
    cardBorder: '#EFEFF1',
    tabBar: 'rgba(255,255,255,0.85)',
    tabBarBorder: 'rgba(0,0,0,0.06)',
    tabInactive: '#B4B7BE',
    tabActive: '#111111',
    orb: '#EDEDEF',
    orbGlow: 'rgba(0,0,0,0.15)',
    headerBg: '#FFFFFF',
    segmentBg: '#F1F2F4',
    segmentActive: '#111111',
    segmentActiveText: '#FFFFFF',
    segmentText: '#4B5563',
    moderationColor: '#16A34A',
    moderationBg: '#F0FBF3',
    moderationIconBg: '#DCF6E3',
    success: '#16A34A',
    warning: '#D97706',
    danger: '#DC2626',
    verifiedBadge: '#22C55E',
  },
  grey: {
    primary: '#111111',
    background: '#C6CAD1',
    text: '#16181D',
    inverseText: '#FFFFFF',
    textSecondary: '#565D68',
    border: 'rgba(0,0,0,0.08)',
    card: '#FFFFFF',
    cardBorder: 'rgba(0,0,0,0.05)',
    tabBar: 'rgba(28,28,32,0.55)',
    tabBarBorder: 'rgba(255,255,255,0.12)',
    tabInactive: 'rgba(255,255,255,0.55)',
    tabActive: '#FFFFFF',
    orb: '#FFFFFF',
    orbGlow: 'rgba(0,0,0,0.3)',
    headerBg: 'transparent',
    segmentBg: 'rgba(20,20,24,0.28)',
    segmentActive: '#FFFFFF',
    segmentActiveText: '#16181D',
    segmentText: 'rgba(255,255,255,0.75)',
    moderationColor: '#16181D',
    moderationBg: '#F4F5F6',
    moderationIconBg: '#E7E9EB',
    success: '#059669',
    warning: '#B45309',
    danger: '#DC2626',
    verifiedBadge: '#22C55E',
  },
  black: {
    primary: '#FFFFFF',
    background: '#000000',
    text: '#FFFFFF',
    inverseText: '#000000',
    textSecondary: '#8E8E93',
    border: '#1C1C1E',
    card: '#0C0C0D',
    cardBorder: '#1C1C1E',
    tabBar: 'rgba(22,22,24,0.85)',
    tabBarBorder: 'rgba(255,255,255,0.08)',
    tabInactive: '#6B6B70',
    tabActive: '#FFFFFF',
    orb: '#2C2C2E',
    orbGlow: 'rgba(255,255,255,0.18)',
    headerBg: '#000000',
    segmentBg: '#161618',
    segmentActive: '#2C2C2E',
    segmentActiveText: '#FFFFFF',
    segmentText: '#8E8E93',
    moderationColor: '#EF4444',
    moderationBg: '#1C0F10',
    moderationIconBg: '#3A1417',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#EF4444',
    verifiedBadge: '#EF4444',
  },
}

interface SpaceCopy {
  label: string
  title: string
  legend: string
  subtitle: string
  moderationTitle: string
  moderationSubtitle: string
}

export const SPACE_COPY: Record<Space, SpaceCopy> = {
  white: {
    label: 'WHITE',
    title: 'WHITE SPACE',
    legend: 'Fully moderated by AI. Safe, clean, and focused on positivity.',
    subtitle: 'AI moderated for a safe and positive experience.',
    moderationTitle: 'AI Moderated',
    moderationSubtitle: 'This post follows our community guidelines.',
  },
  grey: {
    label: 'GRAY',
    title: 'GRAY SPACE',
    legend: 'Community checks. Balanced freedom with shared responsibility.',
    subtitle: 'Community checked for balanced freedom.',
    moderationTitle: 'Community check in progress',
    moderationSubtitle: 'people reviewing',
  },
  black: {
    label: 'BLACK',
    title: 'BLACK SPACE',
    legend: 'Zero moderation. Say what you want. Total freedom.',
    subtitle: 'Zero moderation. Total freedom.',
    moderationTitle: 'Zero Moderation',
    moderationSubtitle: 'Everything here is user responsibility. Say what you want.',
  },
}

export const SPACE_DOT_COLOR: Record<Space, string> = {
  white: '#FFFFFF',
  grey: '#9CA3AF',
  black: '#111111',
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

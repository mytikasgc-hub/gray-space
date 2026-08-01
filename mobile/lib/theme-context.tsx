import React, { createContext, useContext, useState } from 'react'

export type Space = 'white' | 'grey' | 'black'

interface ThemeColors {
  primary: string
  background: string
  text: string
  textSecondary: string
  border: string
  card: string
  tabInactive: string
  badge: string
  success: string
  warning: string
}

const SPACE_THEMES: Record<Space, ThemeColors> = {
  white: {
    // Professional white space - AI Moderated
    primary: '#10B981',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    card: '#F8FAFB',
    tabInactive: '#D1D5DB',
    badge: '#10B981',
    success: '#10B981',
    warning: '#EF4444',
  },
  grey: {
    // Balanced grey space - Community Checked
    primary: '#9CA3AF',
    background: '#9CA3AF',
    text: '#1F2937',
    textSecondary: '#4B5563',
    border: '#9CA3AF',
    card: '#D1D5DB',
    tabInactive: '#9CA3AF',
    badge: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
  },
  black: {
    // Minimal black space - Zero Moderation
    primary: '#60A5FA',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#D1D5DB',
    border: '#374151',
    card: '#1F2937',
    tabInactive: '#6B7280',
    badge: '#EF4444',
    success: '#10B981',
    warning: '#EF4444',
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

  const value: ThemeContextType = {
    space,
    colors: SPACE_THEMES[space],
    setSpace,
  }

  return (
    <ThemeContext.Provider value={value}>
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

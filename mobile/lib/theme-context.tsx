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
    primary: '#000000',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    card: '#F9FAFB',
    tabInactive: '#9CA3AF',
    badge: '#10B981',
    success: '#10B981',
    warning: '#F59E0B',
  },
  grey: {
    primary: '#6B7280',
    background: '#F3F4F6',
    text: '#374151',
    textSecondary: '#6B7280',
    border: '#D1D5DB',
    card: '#FFFFFF',
    tabInactive: '#9CA3AF',
    badge: '#FBBF24',
    success: '#10B981',
    warning: '#F59E0B',
  },
  black: {
    primary: '#FFFFFF',
    background: '#1F2937',
    text: '#F3F4F6',
    textSecondary: '#D1D5DB',
    border: '#374151',
    card: '#111827',
    tabInactive: '#6B7280',
    badge: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
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

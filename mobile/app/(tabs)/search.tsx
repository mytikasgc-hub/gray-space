import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { useTheme } from '../../lib/theme-context'

export default function SearchScreen() {
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Search</Text>
      </View>
    </SafeAreaView>
  )
}

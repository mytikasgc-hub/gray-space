import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useAuth } from '../lib/auth-context'
import { BrandLogo } from '../components/brand-logo'

export default function Index() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
          gap: 20,
        }}
      >
        <BrandLogo size={88} />
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    )
  }

  if (session) {
    return <Redirect href="/(tabs)/feed" />
  }

  return <Redirect href="/(auth)/login" />
}

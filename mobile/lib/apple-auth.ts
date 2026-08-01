import * as AppleAuthentication from 'expo-apple-authentication'

export async function performAppleSignIn(apiUrl: string) {
  try {
    // Request Apple authentication credential
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    if (!credential.identityToken) {
      throw new Error('No identity token received from Apple')
    }

    // Exchange identity token for Supabase session via backend
    const response = await fetch(`${apiUrl}/api/auth/apple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identityToken: credential.identityToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Authentication failed')
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: data.user,
    }
  } catch (error: any) {
    if (error.code === 'ERR_SKIPPED') {
      throw new Error('Sign in was cancelled')
    }
    throw error
  }
}

export async function refreshSession(
  refreshToken: string,
  apiUrl: string
) {
  try {
    const response = await fetch(`${apiUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to refresh session')
    }

    const data = await response.json()

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }
  } catch (error) {
    throw error
  }
}

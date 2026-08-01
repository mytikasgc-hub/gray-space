import { supabase } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { identityToken } = await request.json()

  if (!identityToken) {
    return NextResponse.json(
      { error: 'Missing identity token' },
      { status: 400 }
    )
  }

  try {
    // Exchange identity token for Supabase session
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: identityToken,
    })

    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 400 }
      )
    }

    // Fetch user profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user?.id)
      .single()

    return NextResponse.json({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        ...profileData,
      },
    })
  } catch (error: any) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

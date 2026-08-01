import { supabase } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (profileError) {
    return NextResponse.json(
      { error: 'Profile not found' },
      { status: 404 }
    )
  }

  // Get user's posts count by space
  const { data: posts } = await supabase
    .from('posts')
    .select('space')
    .eq('user_id', id)
    .eq('status', 'active')

  const spaceCounts = {
    white: posts?.filter(p => p.space === 'white').length || 0,
    grey: posts?.filter(p => p.space === 'grey').length || 0,
    black: posts?.filter(p => p.space === 'black').length || 0,
  }

  return NextResponse.json({
    ...profile,
    posts_by_space: spaceCounts,
    total_posts: posts?.length || 0,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (user.id !== id) {
    return NextResponse.json(
      { error: 'Cannot update another user profile' },
      { status: 403 }
    )
  }

  const body = await request.json()
  const { username, bio, avatar_url } = body

  const { data, error } = await supabase
    .from('profiles')
    .update({ username, bio, avatar_url })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data[0])
}

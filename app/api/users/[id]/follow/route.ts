import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetUserId = params.id

    if (user.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single()

    if (existing) {
      // Unfollow
      const { error: deleteError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)

      if (deleteError) throw deleteError

      return NextResponse.json({ following: false })
    } else {
      // Follow
      const { error: insertError } = await supabase
        .from('follows')
        .insert({
          follower_id: user.id,
          following_id: targetUserId,
        })

      if (insertError) throw insertError

      // Create notification
      await supabase.from('notifications').insert({
        user_id: targetUserId,
        actor_id: user.id,
        type: 'follow',
        content: `${user.email} started following you`,
      })

      return NextResponse.json({ following: true })
    }
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json(
      { error: 'Failed to update follow status' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const targetUserId = params.id

    // Get follower count
    const { count: followerCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_id', targetUserId)

    // Get following count
    const { count: followingCount } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('follower_id', targetUserId)

    // Check if current user follows this user
    let isFollowing = false
    if (user && user.id !== targetUserId) {
      const { data } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single()

      isFollowing = !!data
    }

    return NextResponse.json({
      followerCount: followerCount || 0,
      followingCount: followingCount || 0,
      isFollowing,
    })
  } catch (error) {
    console.error('Get follow status error:', error)
    return NextResponse.json(
      { error: 'Failed to get follow status' },
      { status: 500 }
    )
  }
}

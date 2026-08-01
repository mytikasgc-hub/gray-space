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

    const blockedUserId = params.id

    if (user.id === blockedUserId) {
      return NextResponse.json(
        { error: 'Cannot block yourself' },
        { status: 400 }
      )
    }

    // Check if already blocked
    const { data: existing } = await supabase
      .from('blocked_users')
      .select('id')
      .eq('blocker_id', user.id)
      .eq('blocked_id', blockedUserId)
      .single()

    if (existing) {
      // Unblock
      const { error: deleteError } = await supabase
        .from('blocked_users')
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', blockedUserId)

      if (deleteError) throw deleteError

      return NextResponse.json({ blocked: false })
    } else {
      // Block
      const { error: insertError } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: user.id,
          blocked_id: blockedUserId,
        })

      if (insertError) throw insertError

      return NextResponse.json({ blocked: true })
    }
  } catch (error) {
    console.error('Block error:', error)
    return NextResponse.json(
      { error: 'Failed to update block status' },
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

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await supabase
      .from('blocked_users')
      .select('id')
      .eq('blocker_id', user.id)
      .eq('blocked_id', params.id)
      .single()

    return NextResponse.json({ isBlocked: !!data })
  } catch (error) {
    console.error('Get block status error:', error)
    return NextResponse.json(
      { error: 'Failed to get block status' },
      { status: 500 }
    )
  }
}

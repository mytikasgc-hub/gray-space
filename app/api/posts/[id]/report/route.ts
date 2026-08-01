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

    const { reason, description } = await request.json()

    if (!reason) {
      return NextResponse.json(
        { error: 'Reason is required' },
        { status: 400 }
      )
    }

    // Create report
    const { error: reportError } = await supabase.from('reports').insert({
      reporter_id: user.id,
      post_id: params.id,
      reason,
      description,
    })

    if (reportError) throw reportError

    return NextResponse.json({ success: true, message: 'Report submitted' })
  } catch (error) {
    console.error('Report error:', error)
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    )
  }
}

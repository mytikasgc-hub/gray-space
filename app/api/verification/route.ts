import { supabase } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') || 'pending'
  const page = parseInt(searchParams.get('page') || '0')
  const limit = 20
  const offset = page * limit

  const { data, error, count } = await supabase
    .from('verification_requests')
    .select('*, posts(*), profiles(*)', { count: 'exact' })
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    verifications: data,
    total: count,
    hasMore: (page + 1) * limit < (count || 0),
  })
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { post_id, evidence, sources, confidence_level } = body

  if (!post_id || !evidence) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      post_id,
      user_id: user.id,
      evidence,
      sources: JSON.stringify(sources),
      confidence_level,
      status: 'pending',
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json(data[0], { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const page = parseInt(searchParams.get('page') || '0')
    const limit = 20

    if (!conversationId) {
      // Get all conversations
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(
          `
          id,
          user_1_id,
          user_2_id,
          last_message_at,
          user_1:user_1_id(id, username, avatar_url),
          user_2:user_2_id(id, username, avatar_url)
        `
        )
        .or(`user_1_id.eq.${user.id},user_2_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false })

      if (error) throw error

      return NextResponse.json({ conversations: conversations || [] })
    }

    // Get messages in conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select(
        `
        id,
        sender_id,
        content,
        image_url,
        read_at,
        created_at,
        sender:sender_id(id, username, avatar_url)
      `
      )
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(page * limit, (page + 1) * limit - 1)

    if (error) throw error

    return NextResponse.json({
      messages: messages || [],
      hasMore: (messages?.length || 0) === limit,
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient(request)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, content, imageUrl } = await request.json()

    if (!conversationId || !content?.trim()) {
      return NextResponse.json(
        { error: 'Conversation ID and content required' },
        { status: 400 }
      )
    }

    // Create message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: content.trim(),
        ...(imageUrl && { image_url: imageUrl }),
      })
      .select()
      .single()

    if (messageError) throw messageError

    // Update conversation last_message_at
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversationId)

    return NextResponse.json(message)
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

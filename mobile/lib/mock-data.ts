import { Space } from './theme-context'

export interface MockProfile {
  id: string
  username: string
  avatar_url?: string
  verification_level: 'unverified' | 'verified' | 'expert'
}

export interface MockPost {
  id: string
  content: string
  image_url?: string
  user_id: string
  space: Space
  created_at: string
  profiles: MockProfile
  likes?: { count: number }[]
  comment_count?: number
  community_reviewers?: number
  community_hours_left?: number
  reviewer_avatars?: string[]
}

export interface MockNotification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention' | 'verification'
  content: string
  read_at: string | null
  created_at: string
  actor: MockProfile | null
  post?: { id: string; content: string } | null
}

export interface MockConversation {
  id: string
  user_1_id: string
  user_2_id: string
  last_message_at: string
  last_message?: string
  unread?: number
  user_1: MockProfile
  user_2: MockProfile
}

export interface MockMessage {
  id: string
  sender_id: string
  content: string
  created_at: string
  read_at: string | null
}

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString()

export const MOCK_POSTS: MockPost[] = [
  {
    id: 'p-white-1',
    content: 'Sunshine and good thoughts for everyone ☀️',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    user_id: 'u1',
    space: 'white',
    created_at: hoursAgo(2),
    profiles: {
      id: 'u1',
      username: 'good.vibes',
      avatar_url: 'https://i.pravatar.cc/150?u=good.vibes',
      verification_level: 'verified',
    },
    likes: [{ count: 128 }],
    comment_count: 14,
  },
  {
    id: 'p-white-2',
    content: 'Morning routine: hydrate, stretch, and one kind message.',
    image_url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800',
    user_id: 'u2',
    space: 'white',
    created_at: hoursAgo(5),
    profiles: {
      id: 'u2',
      username: 'calm.desk',
      avatar_url: 'https://i.pravatar.cc/150?u=calm.desk',
      verification_level: 'verified',
    },
    likes: [{ count: 64 }],
    comment_count: 6,
  },
  {
    id: 'p-grey-1',
    content: 'Is remote work actually better for deep focus — or just quieter?',
    image_url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
    user_id: 'u3',
    space: 'grey',
    created_at: hoursAgo(3),
    profiles: {
      id: 'u3',
      username: 'alex.roam',
      avatar_url: 'https://i.pravatar.cc/150?u=alex.roam',
      verification_level: 'unverified',
    },
    likes: [{ count: 42 }],
    comment_count: 31,
    community_reviewers: 12,
    community_hours_left: 3,
    reviewer_avatars: [
      'https://i.pravatar.cc/150?u=r1',
      'https://i.pravatar.cc/150?u=r2',
      'https://i.pravatar.cc/150?u=r3',
    ],
  },
  {
    id: 'p-grey-2',
    content: 'Community note needed: this claim about water filters seems off.',
    user_id: 'u4',
    space: 'grey',
    created_at: hoursAgo(8),
    profiles: {
      id: 'u4',
      username: 'note.taker',
      avatar_url: 'https://i.pravatar.cc/150?u=note.taker',
      verification_level: 'unverified',
    },
    likes: [{ count: 19 }],
    comment_count: 22,
    community_reviewers: 7,
    community_hours_left: 5,
    reviewer_avatars: [
      'https://i.pravatar.cc/150?u=r4',
      'https://i.pravatar.cc/150?u=r5',
    ],
  },
  {
    id: 'p-black-1',
    content: 'They never wanted you to connect these dots.',
    image_url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800',
    user_id: 'u5',
    space: 'black',
    created_at: hoursAgo(1),
    profiles: {
      id: 'u5',
      username: 'real.raw.reality',
      avatar_url: 'https://i.pravatar.cc/150?u=real.raw',
      verification_level: 'unverified',
    },
    likes: [{ count: 301 }],
    comment_count: 88,
  },
  {
    id: 'p-black-2',
    content: 'No filters. No editors. Just the signal.',
    user_id: 'u6',
    space: 'black',
    created_at: hoursAgo(4),
    profiles: {
      id: 'u6',
      username: 'anonymous',
      verification_level: 'unverified',
    },
    likes: [{ count: 77 }],
    comment_count: 40,
  },
]

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    type: 'like',
    content: 'liked your post',
    read_at: null,
    created_at: hoursAgo(0.5),
    actor: {
      id: 'u3',
      username: 'alex.roam',
      avatar_url: 'https://i.pravatar.cc/150?u=alex.roam',
      verification_level: 'unverified',
    },
    post: { id: 'p-white-1', content: 'Sunshine and good thoughts...' },
  },
  {
    id: 'n2',
    type: 'comment',
    content: 'commented: “This is exactly what I needed today.”',
    read_at: null,
    created_at: hoursAgo(1),
    actor: {
      id: 'u2',
      username: 'calm.desk',
      avatar_url: 'https://i.pravatar.cc/150?u=calm.desk',
      verification_level: 'verified',
    },
    post: { id: 'p-white-1', content: 'Sunshine and good thoughts...' },
  },
  {
    id: 'n3',
    type: 'follow',
    content: 'started following you',
    read_at: null,
    created_at: hoursAgo(3),
    actor: {
      id: 'u4',
      username: 'note.taker',
      avatar_url: 'https://i.pravatar.cc/150?u=note.taker',
      verification_level: 'unverified',
    },
  },
  {
    id: 'n4',
    type: 'verification',
    content: 'Your White Space verification was approved',
    read_at: hoursAgo(6),
    created_at: hoursAgo(6),
    actor: null,
  },
  {
    id: 'n5',
    type: 'mention',
    content: 'mentioned you in Gray Space',
    read_at: hoursAgo(10),
    created_at: hoursAgo(10),
    actor: {
      id: 'u3',
      username: 'alex.roam',
      avatar_url: 'https://i.pravatar.cc/150?u=alex.roam',
      verification_level: 'unverified',
    },
  },
  {
    id: 'n6',
    type: 'message',
    content: 'sent you a message',
    read_at: hoursAgo(12),
    created_at: hoursAgo(12),
    actor: {
      id: 'u5',
      username: 'real.raw.reality',
      avatar_url: 'https://i.pravatar.cc/150?u=real.raw',
      verification_level: 'unverified',
    },
  },
]

export const MOCK_CONVERSATIONS: MockConversation[] = [
  {
    id: 'c1',
    user_1_id: 'guest',
    user_2_id: 'u3',
    last_message_at: hoursAgo(0.3),
    last_message: 'Want to community-note that post together?',
    unread: 2,
    user_1: {
      id: 'guest',
      username: 'you',
      verification_level: 'unverified',
    },
    user_2: {
      id: 'u3',
      username: 'alex.roam',
      avatar_url: 'https://i.pravatar.cc/150?u=alex.roam',
      verification_level: 'unverified',
    },
  },
  {
    id: 'c2',
    user_1_id: 'guest',
    user_2_id: 'u2',
    last_message_at: hoursAgo(2),
    last_message: 'Your White Space post looked great.',
    unread: 0,
    user_1: {
      id: 'guest',
      username: 'you',
      verification_level: 'unverified',
    },
    user_2: {
      id: 'u2',
      username: 'calm.desk',
      avatar_url: 'https://i.pravatar.cc/150?u=calm.desk',
      verification_level: 'verified',
    },
  },
  {
    id: 'c3',
    user_1_id: 'guest',
    user_2_id: 'u5',
    last_message_at: hoursAgo(20),
    last_message: 'Black Space has no rules. Remember that.',
    unread: 0,
    user_1: {
      id: 'guest',
      username: 'you',
      verification_level: 'unverified',
    },
    user_2: {
      id: 'u5',
      username: 'real.raw.reality',
      avatar_url: 'https://i.pravatar.cc/150?u=real.raw',
      verification_level: 'unverified',
    },
  },
]

export const MOCK_MESSAGES: Record<string, MockMessage[]> = {
  c1: [
    {
      id: 'm1',
      sender_id: 'u3',
      content: 'Hey — saw your Gray Space take.',
      created_at: hoursAgo(2),
      read_at: hoursAgo(1.5),
    },
    {
      id: 'm2',
      sender_id: 'guest',
      content: 'Yeah, still waiting on community notes.',
      created_at: hoursAgo(1.2),
      read_at: hoursAgo(1),
    },
    {
      id: 'm3',
      sender_id: 'u3',
      content: 'Want to community-note that post together?',
      created_at: hoursAgo(0.3),
      read_at: null,
    },
  ],
  c2: [
    {
      id: 'm4',
      sender_id: 'u2',
      content: 'Your White Space post looked great.',
      created_at: hoursAgo(2),
      read_at: hoursAgo(1),
    },
  ],
  c3: [
    {
      id: 'm5',
      sender_id: 'u5',
      content: 'Black Space has no rules. Remember that.',
      created_at: hoursAgo(20),
      read_at: hoursAgo(19),
    },
  ],
}

export function formatCount(n: number): string {
  if (n < 1000) return `${n}`
  if (n < 1000000) {
    const k = n / 1000
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`
  }
  const m = n / 1000000
  return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
}

export function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

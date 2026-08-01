# Grey Spaces - Architecture Document

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     iOS User                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                ┌────────▼─────────┐
                │  React Native    │
                │  Expo App        │
                │  (mobile/)       │
                └────────┬─────────┘
                         │
                ┌────────▼──────────────────┐
                │   AsyncStorage (Cache)    │
                │   Session Persistence     │
                └────────┬──────────────────┘
                         │ HTTP/REST
        ┌────────────────▼──────────────────┐
        │   Next.js 16 Backend (app/)       │
        │   - API Routes                    │
        │   - Supabase Auth                 │
        │   - RLS Policy Enforcement        │
        └────────────────┬──────────────────┘
                         │
        ┌────────────────▼──────────────────┐
        │   Supabase PostgreSQL            │
        │   - 15+ Tables                   │
        │   - Row-Level Security           │
        │   - Triggers & Indexes           │
        └─────────────────────────────────┘
```

## Authentication Flow

```
1. User Opens App
   ↓
2. RootLayout checks AsyncStorage for session
   ├─ Session exists → Navigate to (tabs)
   └─ No session → Navigate to (auth)/login
   ↓
3. User taps "Sign in with Apple"
   ↓
4. expo-apple-authentication shows native dialog
   ↓
5. User approves → Get identityToken
   ↓
6. POST /api/auth/apple { identityToken }
   ├─ Backend validates with Apple
   ├─ Create/find Supabase user
   ├─ Generate JWT tokens
   └─ Return { accessToken, refreshToken, user }
   ↓
7. Store in AsyncStorage + AuthContext
   ↓
8. Navigate to (tabs)/feed with auth guard active
```

## Post Creation & Publishing Flow

```
User taps + button (FeedScreen)
   ↓
CreatePostSheet opens (bottom modal)
   ├─ Select space (White/Grey/Black tabs)
   ├─ Write content (TextInput)
   ├─ Optional: Tap camera icon
   │  ├─ Camera/Gallery selector
   │  ├─ Image picked with expo-image-picker
   │  ├─ Preview in sheet
   │  └─ Can remove/retake
   └─ Tap Submit button
   ↓
POST /api/posts
├─ Backend validates RLS (auth.uid() = user_id)
├─ Check user verification level
│  ├─ White: Requires verified status
│  ├─ Grey: Requires profile
│  └─ Black: Anyone can post
├─ Insert into posts table with space
├─ If image: Upload to Supabase Storage
├─ Create notification for followers
└─ Return { post }
   ↓
FeedScreen refetches posts with page=0
   ↓
New post appears at top of feed
```

## Feed Pagination & Space Filtering

```
FeedScreen mounts → useEffect
   ↓
1. Determine current space (from ThemeContext)
2. Fetch initial posts: GET /api/posts?space=white&page=0
   ├─ Backend queries: SELECT * FROM posts WHERE space='white' AND status='active' ORDER BY created_at DESC LIMIT 20
   ├─ Apply RLS (checks blocked_users)
   └─ Return paginated results
3. Render FlatList with posts array
   ↓
User scrolls to bottom (onEndReached trigger)
   ↓
4. page++; fetch next batch GET /api/posts?space=white&page=1
5. Append to existing posts array
6. Show loading indicator while fetching
   ↓
Repeat until hasMore=false
```

## Theme System - Space Switching

```
ThemeContext (global state)
├─ space: 'white' | 'grey' | 'black'
├─ colors: { background, text, primary, badge, ... }
├─ setSpace(newSpace) → Updates all colors
└─ Broadcast to all components via context

Component Usage:
1. Import useTheme
2. const { colors, space, setSpace } = useTheme()
3. Apply colors to StyleSheet
4. Space-specific logic (e.g., moderation badges)
   ├─ White: Green checkmark "AI Moderated"
   ├─ Grey: Amber avatar stack "Community check in progress"
   └─ Black: Red warning "Zero Moderation"

When space changes:
1. SpaceSelector calls setSpace('grey')
2. ThemeContext updates space & colors
3. All components re-render with new colors
4. FeedScreen refetches posts for new space (page=0)
```

## API Route Pattern

All routes follow this pattern:

```typescript
// /app/api/posts/route.ts
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  try {
    // 1. Get auth session from header
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    // 2. Create Supabase client with token
    const supabase = createServerClient(..., {
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    
    // 3. Get auth user (RLS enforced)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    
    // 4. Fetch data (RLS policies apply automatically)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('space', space)
      .order('created_at', { ascending: false })
      .limit(20)
    
    // 5. Return response
    return Response.json({ posts: data || [], error })
    
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
```

## RLS Policy Pattern

```sql
-- Example: Users can only see non-blocked posts

-- Create policy for post visibility
CREATE POLICY "posts_visible_unless_blocked" ON public.posts
FOR SELECT
USING (
  -- User is owner
  auth.uid() = user_id
  OR
  -- User hasn't blocked the author and author hasn't blocked user
  NOT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = auth.uid() AND blocked_id = posts.user_id)
    OR (blocker_id = posts.user_id AND blocked_id = auth.uid())
  )
);

-- Users can only create posts for themselves
CREATE POLICY "posts_insert_own" ON public.posts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can only update/delete their own posts
CREATE POLICY "posts_update_own" ON public.posts
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "posts_delete_own" ON public.posts
FOR DELETE
USING (auth.uid() = user_id);
```

## Component Hierarchy

```
RootLayout (_layout.tsx)
├─ GestureHandlerRootView
├─ SafeAreaProvider
├─ AuthProvider (Context)
│  └─ ThemeProvider (Context)
│     └─ RootLayoutNav (Auth Guard)
│        ├─ (auth) Stack (if !session)
│        │  └─ login screen (Apple Sign-In)
│        └─ (tabs) Stack (if session)
│           ├─ feed
│           │  ├─ Header
│           │  ├─ SpaceSelector
│           │  ├─ FlatList
│           │  │  └─ PostCard (x20)
│           │  ├─ FloatingButton (+)
│           │  └─ CreatePostSheet (modal)
│           │
│           ├─ search
│           ├─ profile
│           │  ├─ Avatar
│           │  ├─ Stats (Trust Score, Accuracy)
│           │  ├─ SignOut Button
│           │  └─ PostsList (user's posts)
│           │
│           ├─ notifications
│           │  └─ NotificationList
│           │
│           └─ messages
│              └─ ConversationList
│                 └─ MessageThread (modal)
```

## State Management Pattern

### Global State (Context)
```typescript
// AuthContext
├─ session: { accessToken, refreshToken }
├─ user: { id, email, username, ... }
├─ isLoading: boolean
└─ signIn/signOut methods

// ThemeContext
├─ space: 'white' | 'grey' | 'black'
├─ colors: ThemeColors (object with all colors)
├─ setSpace: (space) => void
└─ Propagates to all components
```

### Local Component State
```typescript
// Screen-level state
const [posts, setPosts] = useState<Post[]>([])
const [isLoading, setIsLoading] = useState(boolean)
const [page, setPage] = useState(number)
const [hasMore, setHasMore] = useState(boolean)
```

### Server-Side Cache (AsyncStorage)
```typescript
// Token persistence
await AsyncStorage.setItem('access_token', token)
await AsyncStorage.setItem('refresh_token', refreshToken)
await AsyncStorage.setItem('user', JSON.stringify(user))

// On app launch, restore from storage
const token = await AsyncStorage.getItem('access_token')
if (token) setSession({ accessToken: token, refreshToken })
```

## Data Flow Example: Liking a Post

```
User taps ❤️ on PostCard
   ↓
PostCard.onLike() called
   ↓
FeedScreen.handleLike(postId)
   ├─ Optimistically update UI (like count++)
   ├─ POST /api/posts/[id]/likes
   │  ├─ Backend: Upsert into likes table
   │  ├─ Check: User hasn't blocked post author (RLS)
   │  ├─ If new like: Create notification
   │  └─ Return { success: true, likeCount }
   └─ On success: UI updated confirmed
   
On error:
   ├─ Revert optimistic update
   └─ Show error toast
```

## Security Considerations

### Row-Level Security (RLS)
- All tables have RLS enabled
- `auth.uid()` automatically enforced in policies
- User can only access their own data + public data
- Blocked users can't see each other's content

### Authentication
- Apple Sign-In handled by Supabase (OAuth 2.0)
- JWT tokens stored in AsyncStorage (not HttpOnly on mobile)
- Refresh token used to get new access token when expired
- XSS protection: No inline scripts, all from React components

### API Validation
- Parameterized queries (via Supabase client)
- Server-side input validation on all routes
- Rate limiting via middleware
- CORS configured for mobile app domain

### Data Privacy
- User passwords hashed with bcrypt via Supabase Auth
- Sensitive data (phone, email) not exposed via API
- RLS prevents data leakage across users
- Blocked users info hidden from blocked user

## Performance Optimization

### Mobile
- Pagination: 20 posts per page
- Image lazy loading via expo-image
- Component memoization: React.memo for PostCard
- FlatList optimization: keyExtractor, removeClippedSubviews

### Backend
- Database indexes on: user_id, space, created_at, status
- Query optimization: Only select needed columns
- Caching: Set Cache-Control headers for GET requests
- Connection pooling: Supabase managed

### Network
- Gzip compression enabled
- Image optimization: Compress before upload
- API rate limiting: 100 requests/minute per user
- Batch operations: Use bulk insert for notifications

## Error Handling

### Mobile
```typescript
try {
  const response = await fetch(url, { headers })
  if (!response.ok) throw new Error(response.statusText)
  const data = await response.json()
} catch (error) {
  console.error('Error:', error)
  Alert.alert('Error', 'Failed to load posts')
}
```

### Backend
```typescript
// Validation errors: 400
if (!content) return Response.json({ error: 'Content required' }, { status: 400 })

// Auth errors: 401
if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

// Permission errors: 403
if (user.id !== post.user_id) return Response.json({ error: 'Forbidden' }, { status: 403 })

// Server errors: 500
catch (error) {
  console.error(error)
  return Response.json({ error: 'Internal server error' }, { status: 500 })
}
```

---

This architecture ensures scalability, security, and maintainability across the three-space social platform.

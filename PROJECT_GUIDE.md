# Grey Spaces - Comprehensive Project Guide

## Project Overview

**Grey Spaces** is a three-layer social media platform built with React Native (Expo) for iOS 17+ and Next.js 16 for the backend. The platform enables users to share content across three distinct moderation levels: White (AI-moderated, fact-checked), Grey (community-verified, balanced), and Black (zero moderation, total freedom).

**Repository:** https://github.com/mytikasgc-hub/gray-space.git
**Status:** Phase 1-2 Complete (Core Infrastructure & Social Features)

---

## Technology Stack

### Frontend
- **Framework:** React Native with Expo
- **Routing:** Expo Router (file-based)
- **Navigation:** React Navigation (bottom tabs + stack)
- **State Management:** React Context API
- **Storage:** AsyncStorage (session persistence)
- **Camera:** expo-camera + expo-image-picker
- **Icons:** @expo/vector-icons (MaterialIcons)

### Backend
- **Framework:** Next.js 16 (App Router)
- **Runtime:** Node.js
- **Authentication:** Apple Sign-In via Supabase
- **Database:** Supabase PostgreSQL
- **Security:** Row-Level Security (RLS) policies
- **API Style:** RESTful with server-side validation

### Database
- **Platform:** Supabase PostgreSQL
- **ORM:** Raw SQL with RLS policies (no ORM required)
- **Auth:** Supabase Auth with Apple OAuth provider

---

## Architecture Overview

### Directory Structure

```
/vercel/share/v0-project/
├── app/                                # Next.js Backend
│   ├── api/
│   │   ├── auth/
│   │   │   ├── apple/route.ts          # Apple Sign-In handler
│   │   │   ├── refresh/route.ts        # Token refresh
│   │   │   └── [...]auth]/route.ts     # Auth callbacks
│   │   ├── posts/
│   │   │   ├── route.ts                # List & create posts
│   │   │   ├── [id]/
│   │   │   │   ├── comments/route.ts   # Comments CRUD
│   │   │   │   ├── likes/route.ts      # Like/unlike
│   │   │   │   └── report/route.ts     # Report posts
│   │   ├── users/
│   │   │   ├── [id]/
│   │   │   │   ├── route.ts            # User profile
│   │   │   │   ├── follow/route.ts     # Follow/unfollow
│   │   │   │   └── block/route.ts      # Block/unblock
│   │   ├── profile/route.ts            # Edit profile
│   │   ├── verification/route.ts       # Verification center
│   │   ├── notifications/route.ts      # Get notifications
│   │   └── messages/route.ts           # DM conversations
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing/redirect
│   ├── globals.css                     # Global styles
│   └── next.config.mjs                 # Next.js config
│
├── mobile/                             # React Native App
│   ├── app/
│   │   ├── _layout.tsx                 # Root with auth guard
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   └── login.tsx               # Apple Sign-In screen
│   │   ├── (tabs)/                     # Tab navigator
│   │   │   ├── _layout.tsx             # Bottom tab config
│   │   │   ├── feed.tsx                # Main feed
│   │   │   ├── search.tsx              # Search screen
│   │   │   ├── profile.tsx             # User profile
│   │   │   ├── notifications.tsx       # Notifications
│   │   │   └── messages.tsx            # DM screen
│   │   └── post-details.tsx            # Post detail view
│   │
│   ├── lib/
│   │   ├── auth-context.tsx            # Auth state & session
│   │   ├── theme-context.tsx           # Space theming (W/G/B)
│   │   ├── apple-auth.ts               # Apple Sign-In helper
│   │   └── supabase-client.ts          # Supabase JS client
│   │
│   ├── components/
│   │   ├── header.tsx                  # Top navigation
│   │   ├── space-selector.tsx          # Space tabs (W/G/B)
│   │   ├── post-card.tsx               # Post display card
│   │   └── create-post-sheet.tsx       # Post creation modal
│   │
│   └── README.md                       # Mobile setup guide
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                   # Supabase client setup
│   │   └── server.ts                   # Server-side client
│   └── utils.ts                        # Shared utilities
│
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── app.json                            # Expo config
└── PROJECT_GUIDE.md                    # This file
```

---

## Database Schema

### Core Tables

#### `auth.users` (Supabase managed)
- id (UUID, primary key)
- email (unique)
- encrypted_password
- email_confirmed_at
- raw_user_meta_data (JSON)

#### `profiles`
- id (UUID, FK → auth.users)
- username (unique)
- verification_level (unverified|verified|expert)
- trust_score (integer, default 0)
- reputation_score (integer, default 0)
- accuracy_percentage (float, default 0)
- avatar_url (text)
- bio (text)
- created_at (timestamp)

#### `posts`
- id (UUID, primary key)
- user_id (FK → auth.users)
- content (text)
- space (enum: white|grey|black)
- status (enum: active|moved|archived)
- image_url (text)
- created_at, updated_at (timestamp)

#### `comments`
- id (UUID, primary key)
- post_id (FK → posts)
- user_id (FK → auth.users)
- content (text)
- created_at (timestamp)

#### `likes`
- id (UUID, primary key)
- post_id (FK → posts)
- user_id (FK → auth.users)
- created_at (timestamp)
- UNIQUE(post_id, user_id)

#### `verification_requests`
- id (UUID, primary key)
- post_id (FK → posts)
- user_id (FK → auth.users)
- status (enum: pending|approved|rejected)
- evidence (text)
- sources (text)
- confidence_level (enum: low|medium|high)
- created_at (timestamp)

#### `follows`
- id (UUID, primary key)
- follower_id (FK → auth.users)
- following_id (FK → auth.users)
- created_at (timestamp)
- UNIQUE(follower_id, following_id)

#### `blocked_users`
- id (UUID, primary key)
- blocker_id (FK → auth.users)
- blocked_id (FK → auth.users)
- created_at (timestamp)
- UNIQUE(blocker_id, blocked_id)

#### `conversations`
- id (UUID, primary key)
- user_1_id (FK → auth.users)
- user_2_id (FK → auth.users)
- last_message_at (timestamp)
- created_at (timestamp)
- UNIQUE(user_1_id, user_2_id)

#### `messages`
- id (UUID, primary key)
- conversation_id (FK → conversations)
- sender_id (FK → auth.users)
- content (text)
- image_url (text)
- read_at (timestamp)
- created_at (timestamp)

#### `notifications`
- id (UUID, primary key)
- user_id (FK → auth.users)
- actor_id (FK → auth.users, nullable)
- type (enum: like|comment|follow|message|mention|verification)
- post_id (FK → posts, nullable)
- comment_id (FK → comments, nullable)
- content (text)
- read_at (timestamp)
- created_at (timestamp)

#### `reports`
- id (UUID, primary key)
- reporter_id (FK → auth.users)
- post_id (FK → posts, nullable)
- user_id (FK → auth.users, nullable)
- reason (text)
- description (text)
- status (enum: pending|reviewed|action_taken|dismissed)
- created_at (timestamp)

### Row-Level Security (RLS) Policies

All tables have RLS enabled with the following policy patterns:

- **Users' Own Data:** `auth.uid() = user_id` (e.g., profiles, conversations)
- **Public Data:** `TRUE` for reads (e.g., posts, profiles visibility)
- **System Inserts:** Allow RLS bypass for notifications, messages via server routes
- **Blocked Content:** Filter via application layer (check blocked_users before showing posts/profiles)

---

## Three Space Themes

### White Space - "AI Moderated"
- **Purpose:** Fact-checked, verified content
- **Moderation:** Fully moderated by AI + community
- **Colors:** 
  - Background: `#FFFFFF`
  - Primary: `#10B981` (green)
  - Badge: Green checkmark "AI Moderated"
  - Card: `#F8FAFB` with light shadow
- **Badge Display:** Green "AI Moderated" indicator on posts
- **Verification:** Requires proof and AI approval before posting

### Grey Space - "Community Checked"
- **Purpose:** Balanced debate and community verification
- **Moderation:** Community voting determines truth
- **Colors:**
  - Background: `#9CA3AF` (medium grey)
  - Primary: `#8B5CF6` (purple)
  - Badge: Amber "Community check in progress"
  - Card: `#D1D5DB`
- **Badge Display:** Avatar stack showing community reviewers
- **Verification:** Shows community vote count and reviewers

### Black Space - "Zero Moderation"
- **Purpose:** Total freedom to share ideas without restriction
- **Moderation:** None - user responsibility only
- **Colors:**
  - Background: `#000000`
  - Primary: `#60A5FA` (blue)
  - Badge: Red "Zero Moderation" warning
  - Card: `#1F2937`
- **Badge Display:** Red warning "Zero Moderation" on posts
- **Verification:** No checks; unverified content warning

---

## API Routes Reference

All routes require `Authorization: Bearer {accessToken}` header except for public endpoints.

### Authentication
- `POST /api/auth/apple` - Exchange Apple ID token for session
  - Body: `{ identityToken: string }`
  - Returns: `{ access_token, refresh_token, user }`

- `POST /api/auth/refresh` - Refresh expired access token
  - Body: `{ refreshToken: string }`
  - Returns: `{ access_token, refresh_token }`

### Posts
- `GET /api/posts?space=white|grey|black&page=0` - Get paginated posts
  - Returns: `{ posts: [], hasMore: boolean }`

- `POST /api/posts` - Create new post
  - Body: `{ content: string, space: string, image_url?: string }`
  - Returns: `{ post }`

- `GET /api/posts/[id]` - Get single post with comments

- `PUT /api/posts/[id]` - Update post (owner only)

- `DELETE /api/posts/[id]` - Delete post (owner only)

- `POST /api/posts/[id]/likes` - Like/unlike post (toggle)

- `GET /api/posts/[id]/comments` - Get post comments

- `POST /api/posts/[id]/comments` - Add comment
  - Body: `{ content: string }`

- `POST /api/posts/[id]/report` - Report post
  - Body: `{ reason: string, description?: string }`

### Users
- `GET /api/users/[id]` - Get user profile
  - Returns: `{ profile, followCount, followerCount, isFollowing }`

- `POST /api/users/[id]/follow` - Toggle follow (auth user follows target)

- `POST /api/users/[id]/block` - Toggle block (auth user blocks target)

- `GET /api/users/[id]/posts` - Get user's posts

### Profile
- `GET /api/profile` - Get current user's profile (requires auth)

- `PUT /api/profile` - Update current user's profile
  - Body: `{ username?, bio?, avatar_url? }`

- `POST /api/profile/password` - Change password
  - Body: `{ currentPassword: string, newPassword: string }`

### Verification
- `GET /api/verification` - Get pending verifications

- `POST /api/verification` - Submit verification/evidence
  - Body: `{ postId: string, evidence: string, sources?: string[], confidenceLevel: 'low'|'medium'|'high' }`

### Notifications
- `GET /api/notifications` - Get user notifications (paginated)
  - Query: `?limit=20&offset=0`

- `PUT /api/notifications/[id]/read` - Mark notification as read

- `DELETE /api/notifications/[id]` - Delete notification

### Messages
- `GET /api/messages` - Get conversations list

- `GET /api/messages/[conversationId]` - Get conversation messages

- `POST /api/messages` - Send message
  - Body: `{ recipientId: string, content: string, image_url?: string }`

---

## Setup Instructions

### Prerequisites
- Node.js 18+ & pnpm
- Expo CLI: `npm install -g expo-cli`
- Xcode 14+ (for iOS development)
- Supabase account with project created
- GitHub account and git installed

### Backend Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/mytikasgc-hub/gray-space.git
   cd gray-space
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment variables** (already configured in Vercel):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - See `.env.local` template

4. **Run development server:**
   ```bash
   pnpm dev
   ```
   Backend available at `http://localhost:3000`

5. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

### Mobile App Setup

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment setup:**
   Create `.env.local` with:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Run development:**
   ```bash
   expo start
   ```
   - Press `i` to open iOS simulator
   - Or scan QR code with iPhone Expo app

5. **Build for iOS:**
   ```bash
   eas build --platform ios --profile preview
   ```

6. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

---

## Feature Checklist

### Phase 1: Complete ✅
- [x] Database schema with RLS policies
- [x] Apple Sign-In authentication
- [x] Session persistence (AsyncStorage)
- [x] Tab navigation (5 screens)
- [x] Theme system (White/Grey/Black)
- [x] Post creation with camera
- [x] Feed with space selector
- [x] Post cards with moderation badges

### Phase 2: Complete ✅
- [x] Follow/unfollow system
- [x] Block/unblock users
- [x] Report posts
- [x] Direct messaging infrastructure
- [x] Notifications system
- [x] Profile editing
- [x] Comments on posts
- [x] Like/unlike posts

### Phase 3: In Progress 🔄
- [ ] Search functionality
- [ ] Hashtags and mentions
- [ ] Post move between spaces
- [ ] Reputation scoring algorithm
- [ ] Verification workflows

### Phase 4: Planned 📋
- [ ] Push notifications
- [ ] Real-time updates (Supabase Realtime)
- [ ] Analytics dashboard
- [ ] Admin moderation panel
- [ ] Content filtering

---

## Development Guidelines

### Code Style
- Use TypeScript for all code (strict mode)
- Functional components with hooks
- Use Context API for global state
- Avoid prop drilling; use context when needed
- Components in `/components`, screens in `/app`

### Naming Conventions
- Components: PascalCase (e.g., `PostCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE
- Files: lowercase with hyphens (e.g., `post-card.tsx`)

### API Response Format
```typescript
// Success
{ status: 200, data: {...} }

// Error
{ status: 400|401|500, error: "Error message" }
```

### Database Queries
- Always use parameterized queries to prevent SQL injection
- Include `auth.uid()` in RLS checks
- Use indexes on frequently filtered columns
- Batch inserts for bulk operations

### Mobile Performance
- Lazy load images with `expo-image`
- Memoize expensive components with `React.memo`
- Use FlatList with proper key extraction
- Pagination for large lists (20 items per page)
- Cache API responses with SWR

### Testing
- Unit tests for utilities (Jest)
- Integration tests for APIs (Vitest)
- E2E tests for critical flows (Detox)
- Run: `pnpm test`

---

## Deployment

### Backend (Vercel)
1. Connected to GitHub repository
2. Auto-deploys on push to main
3. Environment variables configured in Vercel dashboard
4. Preview deployments for PRs

### Mobile App (App Store)
1. Build with Expo: `eas build --platform ios`
2. Submit with EAS: `eas submit --platform ios`
3. Configure in Apple Developer Console
4. Setup TestFlight for beta testing

---

## Common Commands

```bash
# Backend
pnpm dev              # Run dev server
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript check

# Mobile
cd mobile
expo start            # Start dev server
expo start --web      # Run in web (testing only)
eas build --platform ios
eas submit --platform ios

# Git
git clone https://github.com/mytikasgc-hub/gray-space.git
git checkout -b feature/your-feature
git push origin feature/your-feature
# Create PR on GitHub
```

---

## Troubleshooting

### "Cannot find module" errors
- Run `pnpm install` to ensure dependencies are installed
- Clear cache: `rm -rf node_modules && pnpm install`

### Authentication not working
- Verify Supabase URL and keys in environment variables
- Check Apple Sign-In is enabled in Supabase Auth settings
- Ensure redirect URL is correctly configured

### Posts not loading
- Check network tab in browser dev tools
- Verify RLS policies allow SELECT on posts table
- Ensure `auth.uid()` is set correctly

### Image upload failing
- Verify Supabase Storage bucket exists and is public
- Check file size is under 10MB
- Ensure image format is JPEG/PNG

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Follow code style guidelines
4. Test thoroughly before submitting PR
5. Write clear commit messages
6. Submit PR with description of changes

---

## Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Native Docs:** https://reactnative.dev/
- **Expo Docs:** https://docs.expo.dev/
- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs/

---

## Contact & Support

**Project Lead:** Grey Spaces Team
**GitHub:** https://github.com/mytikasgc-hub/gray-space
**Issues:** Report bugs via GitHub Issues

Last Updated: August 2026
Version: 1.0.0-beta

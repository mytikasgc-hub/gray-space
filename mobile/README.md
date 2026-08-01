# Grey Spaces - iOS Mobile App

A React Native + Expo app for the Grey Spaces social platform with three distinct moderation levels.

## Project Structure

```
mobile/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   └── login.tsx        # Apple Sign-In screen
│   ├── (tabs)/              # Main tab navigation
│   │   ├── feed.tsx         # Feed with space selector
│   │   ├── search.tsx       # Search screen
│   │   ├── profile.tsx      # User profile
│   │   ├── notifications.tsx # Notifications
│   │   └── messages.tsx     # Messages/Inbox
│   └── _layout.tsx          # Root layout with providers
├── lib/
│   ├── auth-context.tsx     # Authentication state management
│   └── theme-context.tsx    # Theme/space colors management
└── README.md
```

## Running the App Locally

### Prerequisites

- Node.js 18+ and pnpm
- iOS device or simulator
- Xcode (for iOS development)

### Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start the Expo development server from project root:
```bash
pnpm dev
```

3. In another terminal, start the Expo CLI:
```bash
cd mobile
npx expo start
```

4. Press `i` to open in iOS simulator or scan QR code with iOS camera

### Environment Variables

The mobile app uses these env vars from the backend:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `EXPO_PUBLIC_API_URL` - Backend API URL (defaults to `http://localhost:3000`)

## Architecture

### Backend (Next.js)
- `/app/api/auth/*` - Authentication endpoints
- `/app/api/posts/*` - Posts CRUD operations
- `/lib/supabase/*` - Supabase client setup

### Frontend (React Native)
- **Auth Context** - Manages user session and token storage
- **Theme Context** - Provides colors for White/Grey/Black spaces
- **Tab Navigation** - 5-tab bottom navigation structure
- **Screens** - Each tab has its own screen component

## Screens to Implement

1. **Feed** - Posts with space selector (White/Grey/Black tabs)
2. **Search** - Search posts and users
3. **Profile** - User profile with stats and posts
4. **Notifications** - Activity notifications
5. **Messages** - Direct messages/inbox

## Features in Development

- [ ] Post creation with space selection
- [ ] Comments and replies
- [ ] Likes/voting system
- [ ] Verification workflow
- [ ] User reputation system
- [ ] Content movement between spaces
- [ ] Image uploads
- [ ] Real-time updates

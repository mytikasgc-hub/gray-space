# Cursor Setup Guide - Grey Spaces Project

Welcome to Grey Spaces! This guide will help you get started with Cursor IDE on this project.

## Quick Start

### 1. Open Project in Cursor
```bash
git clone https://github.com/mytikasgc-hub/gray-space.git
cd gray-space
cursor .
```

### 2. Read Project Context
Cursor will automatically detect:
- `PROJECT_GUIDE.md` - Complete project overview
- `ARCHITECTURE.md` - System design and data flow
- `.cursorignore` - Files to exclude from context
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Set Environment Variables
The following environment variables are already configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

For local development, create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 5. Run Backend Development Server
```bash
pnpm dev
# Backend runs at http://localhost:3000
```

### 6. Run Mobile App
```bash
cd mobile
pnpm install  # If not already done
expo start
# Press 'i' for iOS simulator or scan QR code
```

---

## Project Structure for Cursor

### Important Directories

**Backend (Next.js):**
- `app/api/` - All REST API routes (40+ endpoints)
- `lib/supabase/` - Database clients and utilities
- `app/page.tsx` - Root page/redirects

**Mobile (React Native + Expo):**
- `mobile/app/` - Screen components and navigation
- `mobile/lib/` - Context providers (Auth, Theme)
- `mobile/components/` - Reusable UI components

**Configuration:**
- `package.json` - Backend dependencies
- `mobile/package.json` - Mobile dependencies
- `app.json` - Expo configuration
- `tsconfig.json` - TypeScript settings

---

## Key Files to Understand

1. **`PROJECT_GUIDE.md`** (START HERE)
   - Overview of entire project
   - Tech stack explanation
   - Database schema with all 15 tables
   - Complete API documentation
   - Setup and deployment instructions

2. **`ARCHITECTURE.md`**
   - System architecture diagram
   - Authentication flow (Apple Sign-In)
   - Post creation and publishing flow
   - Feed pagination and space filtering
   - Component hierarchy
   - State management patterns

3. **`mobile/lib/auth-context.tsx`**
   - User session management
   - Token storage and refresh
   - Sign-in/sign-out logic

4. **`mobile/lib/theme-context.tsx`**
   - White/Grey/Black space theming
   - Color system for all three spaces
   - Theme switching logic

5. **`mobile/app/(tabs)/feed.tsx`**
   - Main feed screen
   - Space selector tabs
   - Post fetching with pagination
   - Floating create button

6. **`app/api/posts/route.ts`**
   - Post creation endpoint
   - Space-based post filtering
   - RLS policy enforcement

---

## Common Development Tasks

### Add a New API Endpoint

1. Create file: `app/api/your-endpoint/route.ts`
2. Export GET/POST/PUT/DELETE functions:
```typescript
export async function POST(request: Request) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Your logic here
  
  return Response.json({ success: true })
}
```
3. Add RLS policy in Supabase if accessing database
4. Test with `curl` or Postman

### Add a New Mobile Screen

1. Create file: `mobile/app/(tabs)/your-screen.tsx`
2. Import useTheme and useAuth:
```typescript
import { useTheme } from '../../lib/theme-context'
import { useAuth } from '../../lib/auth-context'

export default function YourScreen() {
  const { colors, space } = useTheme()
  const { session, user } = useAuth()
  
  return (
    <SafeAreaView style={{ backgroundColor: colors.background }}>
      {/* Your UI */}
    </SafeAreaView>
  )
}
```
3. Tab navigator will auto-include it if in `mobile/app/(tabs)/`

### Connect API to Mobile Screen

```typescript
import { useEffect, useState } from 'react'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'

export default function MyScreen() {
  const { session } = useAuth()
  const [data, setData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/your-endpoint`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    fetchData()
  }, [session])
  
  return (
    // Render data
  )
}
```

---

## Database Operations

### Query Data (via API)
```typescript
const supabase = createServerClient(...)
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('space', 'white')
  .order('created_at', { ascending: false })
  .limit(20)

return Response.json({ posts: data })
```

### Insert Data
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert([
    { user_id, content, space, image_url }
  ])
  .select()

if (error) throw error
return Response.json({ post: data[0] })
```

### Update Data
```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ username, bio })
  .eq('id', user.id)
  .select()
```

### Delete Data
```typescript
const { error } = await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
  .eq('user_id', user.id)  // RLS check
```

---

## Debugging Tips

### Backend Debugging
- Check API responses in browser DevTools Network tab
- Add `console.log()` in API routes (visible in `pnpm dev` output)
- Use Supabase dashboard to verify database state
- Check RLS policies are correctly applied

### Mobile Debugging
- Use Expo DevTools: Metro debugger in browser
- Add `console.log()` in components (visible in terminal)
- Use React DevTools browser extension (Expo web)
- Check AsyncStorage: `await AsyncStorage.getItem('key')`

### Common Issues

**"Cannot find module" error:**
```bash
rm -rf node_modules
pnpm install
pnpm dev
```

**Supabase auth not working:**
1. Verify Apple Sign-In is enabled in Supabase Console
2. Check redirect URL configuration
3. Test with: `curl -X POST http://localhost:3000/api/auth/apple -d '{"identityToken":"..."}' -H "Content-Type: application/json"`

**Posts not appearing in feed:**
1. Check RLS policies in Supabase Console
2. Verify `space` parameter is correct (white|grey|black)
3. Check user isn't blocked by post author
4. Try: `curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/posts?space=white`

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Brief description of changes"

# Push to GitHub
git push origin feature/your-feature

# Create PR on GitHub (review required)
# After merge, delete local branch
git branch -d feature/your-feature
```

---

## Cursor Commands & Tips

### Useful Cursor Shortcuts
- `Cmd+K` - Open command palette
- `Cmd+L` - Clear chat
- `Cmd+Shift+L` - Create new chat
- `Cmd+I` - Inline edit
- `Cmd+G` - Go to file

### Context Management
- Cursor reads `PROJECT_GUIDE.md` and `ARCHITECTURE.md` automatically
- Use `@` to reference files: `@file.tsx`
- Use `#` to reference code symbols: `#PostCard`
- Copy relevant code into chat when asking for help

### Asking Cursor for Help

**Good prompt:**
```
I need to add a new API endpoint for getting user followers.
It should:
1. Accept userId as parameter
2. Return list of followers with profile info
3. Enforce RLS so users can only see public profiles
4. Check if current user has blocked anyone

Reference: @app/api/users/[id]/route.ts
```

**Not so good:**
```
How do I add an API endpoint?
```

---

## Testing

### Run Tests
```bash
pnpm test
```

### Test Coverage
```bash
pnpm test --coverage
```

### E2E Testing (Mobile)
```bash
cd mobile
detox build-framework-cache --framework ios
detox build-config --configuration ios.sim.debug
detox test e2e --configuration ios.sim.debug --cleanup
```

---

## Performance Profiling

### Backend
```bash
# Profile Next.js build
pnpm build --profile

# Check bundle size
pnpm build --analyze
```

### Mobile
```bash
# Profile React render times
expo start --clear

# In DevTools: Profiler tab
```

---

## Resources

- **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** - Comprehensive guide (read first!)
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and data flow
- **[Supabase Docs](https://supabase.com/docs)**
- **[React Native Docs](https://reactnative.dev/)**
- **[Expo Docs](https://docs.expo.dev/)**
- **[Next.js Docs](https://nextjs.org/docs)**

---

## Contact

**GitHub:** https://github.com/mytikasgc-hub/gray-space
**Issues:** Report bugs via GitHub Issues

Happy coding! 🚀

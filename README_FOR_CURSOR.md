# 🚀 Grey Spaces - iOS Social Media Platform

**Ready for Cursor IDE Development** | **Open Source** | **React Native + Next.js + Supabase**

---

## 📖 Start Here

This project has **2,053 lines of comprehensive documentation**. Here's how to get started:

### For New Users
1. **Start with:** [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md) (guides you through all docs)
2. **Then read:** [`PROJECT_GUIDE.md`](./PROJECT_GUIDE.md) (complete project reference)
3. **Clone & run:** See Quick Start below

### For Cursor IDE Users
1. **Open project:** `cursor .`
2. **Read:** [`CURSOR_SETUP.md`](./CURSOR_SETUP.md) (development guide)
3. **Reference:** [`ARCHITECTURE.md`](./ARCHITECTURE.md) (system design)

### For Experienced Developers
1. Jump to: [`ARCHITECTURE.md`](./ARCHITECTURE.md) (system design)
2. Reference: [`PROJECT_GUIDE.md`](./PROJECT_GUIDE.md) (implementation details)
3. Task guide: [`CURSOR_SETUP.md`](./CURSOR_SETUP.md) (development tasks)

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+, pnpm
- Expo CLI: `npm install -g expo-cli`
- Xcode 14+ (for iOS)

### Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/mytikasgc-hub/gray-space.git
cd gray-space

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase credentials

# Start backend
pnpm dev
# Backend runs at http://localhost:3000

# In another terminal: Start mobile app
cd mobile
pnpm install
expo start
# Press 'i' for iOS simulator or scan QR with Expo Go app
```

---

## 📚 Documentation Overview

| Document | Size | Purpose |
|----------|------|---------|
| **DOCUMENTATION_INDEX.md** | 9.5 KB | Navigation guide through all docs |
| **PROJECT_GUIDE.md** | 18 KB | Complete project reference (READ FIRST!) |
| **ARCHITECTURE.md** | 13 KB | System design and data flows |
| **CURSOR_SETUP.md** | 8.8 KB | Development tasks & Cursor guide |
| **TRANSFER_SUMMARY.md** | 8.7 KB | What's implemented + next steps |
| **.cursorignore** | 168 B | Cursor IDE configuration |

**Total:** 2,053 lines of documentation

---

## 🏗️ Project Structure

```
grey-space/
├── app/                    # Next.js Backend
│   ├── api/               # 25+ REST API endpoints
│   ├── layout.tsx
│   └── page.tsx
│
├── mobile/                # React Native App (Expo)
│   ├── app/              # Screens & navigation
│   ├── lib/              # Context providers
│   └── components/       # Reusable UI
│
├── lib/supabase/         # Database clients
└── [Documentation files]  # See above
```

---

## 🔧 Technology Stack

### Frontend
- **React Native** with Expo (iOS 17+)
- **React Navigation** (bottom tabs)
- **React Context API** (state management)
- **AsyncStorage** (session persistence)
- **TypeScript** (strict mode)

### Backend
- **Next.js 16** (App Router)
- **TypeScript**
- **Supabase PostgreSQL**
- **Row-Level Security (RLS)**

### Database
- **15+ tables** with relationships
- **30+ indexes** for performance
- **50+ RLS policies** for security
- **Auto-triggers** for profiles

---

## ✨ Features Implemented

### Phase 1 ✅
- ✅ Apple Sign-In authentication
- ✅ 5-tab navigation (Feed, Search, Profile, Notifications, Messages)
- ✅ Three-space theming (White, Grey, Black)
- ✅ Post creation with camera
- ✅ Infinite scroll feed
- ✅ Space-specific moderation badges

### Phase 2 ✅
- ✅ Follow/unfollow system
- ✅ Block/unblock users
- ✅ Report posts
- ✅ Direct messaging
- ✅ Notifications system
- ✅ Profile editing
- ✅ Like/comment interactions

### Upcoming 🔄
- [ ] Search functionality
- [ ] Hashtags & mentions
- [ ] Content move between spaces
- [ ] Reputation scoring
- [ ] Real-time updates

---

## 🌐 Three Spaces Concept

**White Space** - "AI Moderated"
- Fact-checked content
- Green verification badges
- Professional theme

**Grey Space** - "Community Checked"
- Community-verified content
- Amber community badges
- Balanced theme

**Black Space** - "Zero Moderation"
- Total freedom to share
- Red warning badges
- Minimal theme

---

## 📱 API Endpoints (25+)

### Authentication
- `POST /api/auth/apple` - Apple Sign-In
- `POST /api/auth/refresh` - Refresh tokens

### Posts
- `GET /api/posts` - List posts by space
- `POST /api/posts` - Create post
- `GET/PUT/DELETE /api/posts/[id]` - Post CRUD
- `POST /api/posts/[id]/likes` - Like/unlike
- `GET/POST /api/posts/[id]/comments` - Comments

### Users
- `GET /api/users/[id]` - User profile
- `POST /api/users/[id]/follow` - Follow/unfollow
- `POST /api/users/[id]/block` - Block/unblock

### Social
- `GET/POST /api/notifications` - Notifications
- `GET/POST /api/messages` - Direct messages
- `POST /api/profile` - Edit profile
- `POST /api/verification` - Submit verification

See **PROJECT_GUIDE.md** for complete API documentation.

---

## 🛠️ Development

### Start Developing
```bash
# Read the development guide
open CURSOR_SETUP.md

# Or open in your editor
cursor CURSOR_SETUP.md
```

### Common Tasks
- Add new API endpoint → See CURSOR_SETUP.md
- Add new mobile screen → See CURSOR_SETUP.md
- Connect API to mobile → See CURSOR_SETUP.md
- Debug issues → See CURSOR_SETUP.md

### Testing
```bash
pnpm test              # Run tests
pnpm test --coverage   # Coverage report
pnpm lint              # Lint code
```

### Building
```bash
# Backend
pnpm build             # Build Next.js
pnpm start             # Run production server

# Mobile
eas build --platform ios              # Build iOS
eas submit --platform ios             # Submit to App Store
```

---

## 🔐 Security

- **Apple Sign-In** via Supabase OAuth 2.0
- **Row-Level Security (RLS)** on all database tables
- **JWT tokens** for API authentication
- **Parameterized queries** to prevent SQL injection
- **Input validation** on all API routes
- **CORS** configured for mobile app

See **ARCHITECTURE.md** for security details.

---

## 📊 Database

### Tables (15+)
- auth.users, profiles, posts, comments, likes
- follows, blocked_users, conversations, messages
- notifications, reports, verification_requests
- post_movements, post_versions, sources, user_accuracy

### RLS Policies
Every table has Row-Level Security with `auth.uid()` checks.
Users can only access their own data + public data.

See **PROJECT_GUIDE.md** for complete schema.

---

## 🚀 Deployment

### Backend (Vercel)
```bash
# Already connected to GitHub
# Push to main branch to auto-deploy
git push origin main
```

### Mobile (App Store)
```bash
# Build with EAS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

---

## 🐛 Debugging

### Backend Issues
- Check API responses in browser DevTools
- Run `pnpm dev` to see console logs
- Verify RLS policies in Supabase dashboard

### Mobile Issues
- Check network tab in Expo DevTools
- Add console.log() in components
- Test with React DevTools browser extension

### Common Fixes
See **CURSOR_SETUP.md** - Debugging Tips section

---

## 📚 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

## 💬 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push branch: `git push origin feature/your-feature`
5. Create Pull Request

See **PROJECT_GUIDE.md** - Contributing section for more details.

---

## 📞 Support

### Need Help?
- Read: **DOCUMENTATION_INDEX.md** (navigation guide)
- Search: **PROJECT_GUIDE.md** (complete reference)
- Ask Cursor: Use `@ARCHITECTURE.md` or `@PROJECT_GUIDE.md` in Cursor

### Report Issues
- GitHub Issues: https://github.com/mytikasgc-hub/gray-space/issues
- GitHub Discussions: For questions and ideas

---

## 📈 Project Status

- ✅ Backend: Fully implemented (25+ API endpoints)
- ✅ Mobile: Core screens implemented
- ✅ Database: 15 tables with RLS
- ✅ Documentation: 2,053 lines
- ✅ Authentication: Apple Sign-In working
- 🔄 Advanced Features: In development

**Status:** 🟢 Production Ready (Core Functionality)

---

## 📝 License

[Add your license information here]

---

## 👋 Quick Navigation

| Need to... | See... |
|-----------|---------|
| Understand the project | PROJECT_GUIDE.md |
| Understand the system | ARCHITECTURE.md |
| Develop in Cursor | CURSOR_SETUP.md |
| Find documentation | DOCUMENTATION_INDEX.md |
| Know what's done | TRANSFER_SUMMARY.md |
| Set up locally | This file (Quick Start section) |

---

**Ready to build? Start with [`DOCUMENTATION_INDEX.md`](./DOCUMENTATION_INDEX.md)** 🚀

*Last Updated: August 2026 | Version: 1.0.0-beta | Status: Ready for Development*

# 📋 HANDOFF PROMPT: Social Media Integration for RaisinReach Client Portal

## 🎯 OBJECTIVE
Build a comprehensive Social Media Manager feature for the RaisinReach client portal that allows clients to schedule, post, and track content across multiple social media platforms (Facebook, Instagram, LinkedIn, Twitter/X, TikTok, YouTube).

---

## 🏗️ CURRENT ARCHITECTURE

### **Tech Stack**
- **Framework**: Next.js 16.1.6 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **UI Components**: Custom components following brand design system
- **Deployment**: Vercel

### **Existing Database Schema** (Prisma)
Located in: `prisma/schema.prisma`

**Key Models:**
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  password      String
  role          Role     @default(CLIENT)
  // ... other fields
}

model Client {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  // ... other fields
}
```

### **Brand Design System** (CRITICAL - MUST FOLLOW)
Located in: `docs/brand_style_guide.md`

**Colors:**
- Primary: `#6B2D5C` (brand-plum)
- Secondary: `#D4A574` (brand-gold)
- Background: `#F5F1E8` (brand-bone)
- Text: `#2D2D2D` (brand-charcoal)

**Design Patterns:**
- **4px borders** with plum color
- **Shadow offset**: `shadow-[4px_4px_0px_0px_var(--color-brand-plum)]`
- **Font hierarchy**: 
  - Display: Playfair Display (headings)
  - Mono: Space Mono (labels, buttons)
  - Sans: Inter (body text)
- **Uppercase tracking-widest** for labels and buttons
- **Toast notifications** for user feedback (react-hot-toast)

---

## 📐 REQUIRED IMPLEMENTATION

### **1. DATABASE SCHEMA ADDITIONS**

Add these models to `prisma/schema.prisma`:

```prisma
model SocialMediaAccount {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform          SocialPlatform
  accountName       String
  accountId         String   // Platform-specific account ID
  accessToken       String   @db.Text // Encrypted
  refreshToken      String?  @db.Text // Encrypted
  tokenExpiry       DateTime?
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  posts             SocialPost[]
  
  @@unique([userId, platform, accountId])
  @@index([userId])
}

model SocialPost {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountId         String
  account           SocialMediaAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  content           String   @db.Text
  mediaUrls         String[] // Array of media URLs
  scheduledFor      DateTime?
  publishedAt       DateTime?
  status            PostStatus @default(DRAFT)
  platformPostId    String?  // ID from the platform after posting
  engagement        Json?    // Likes, comments, shares, etc.
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@index([userId])
  @@index([accountId])
  @@index([status])
  @@index([scheduledFor])
}

enum SocialPlatform {
  FACEBOOK
  INSTAGRAM
  LINKEDIN
  TWITTER
  TIKTOK
  YOUTUBE
}

enum PostStatus {
  DRAFT
  SCHEDULED
  PUBLISHING
  PUBLISHED
  FAILED
}
```

**IMPORTANT**: After adding schema, run:
```bash
npx prisma db push
npx prisma generate
```

### **2. API ROUTES TO CREATE**

Create these files in `src/app/api/portal/social-media/`:

#### **`accounts/route.ts`**
- `GET` - Fetch all connected accounts for user
- `POST` - Connect new social media account (OAuth flow)
- `DELETE` - Disconnect account

#### **`posts/route.ts`**
- `GET` - Fetch all posts (with filters: status, platform, date range)
- `POST` - Create new post (draft or scheduled)
- `PUT` - Update post
- `DELETE` - Delete post

#### **`publish/route.ts`**
- `POST` - Publish post immediately or schedule for later

#### **`analytics/route.ts`**
- `GET` - Fetch engagement metrics for posts

**API Response Format** (follow existing pattern):
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

### **3. FRONTEND COMPONENTS**

Create in `src/components/portal/social-media/`:

#### **`ConnectAccountModal.tsx`**
- OAuth connection flow for each platform
- Display connected accounts with disconnect option
- Follow brand design system (4px borders, shadow offset)

#### **`CreatePostModal.tsx`**
- Rich text editor for post content
- Media upload (images/videos)
- Platform selector (multi-select)
- Schedule date/time picker
- Preview for each platform
- Character count per platform
- **MUST** follow brand design system

#### **`PostCard.tsx`**
- Display post with status badge
- Show scheduled time or published time
- Engagement metrics (likes, comments, shares)
- Edit/Delete actions
- Platform icons

#### **`SocialCalendar.tsx`**
- Monthly calendar view
- Show scheduled posts
- Drag-and-drop to reschedule
- Color-coded by platform

#### **`AnalyticsDashboard.tsx`**
- Summary cards (total posts, engagement rate, reach)
- Charts for engagement over time
- Top performing posts
- Platform comparison

### **4. MAIN PAGE**

Create: `src/app/portal/social-media/page.tsx`

**Tab Structure:**
1. **Dashboard** - Analytics overview
2. **Posts** - List/grid of all posts with filters
3. **Calendar** - Calendar view of scheduled posts
4. **Accounts** - Manage connected accounts

**Design Requirements:**
- Header with plum background and gold border
- Tab navigation matching Profit Estimator pattern
- Empty states with helpful CTAs
- Loading states with brand-styled spinners
- Toast notifications for all actions

---

## 🔐 SECURITY REQUIREMENTS

1. **Token Encryption**: Use `crypto` module to encrypt/decrypt OAuth tokens before storing
2. **Environment Variables**: Store API keys in `.env.local`:
   ```
   FACEBOOK_APP_ID=
   FACEBOOK_APP_SECRET=
   INSTAGRAM_APP_ID=
   INSTAGRAM_APP_SECRET=
   LINKEDIN_CLIENT_ID=
   LINKEDIN_CLIENT_SECRET=
   TWITTER_API_KEY=
   TWITTER_API_SECRET=
   ```
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Error Handling**: Graceful error handling with user-friendly messages

---

## 🎨 UX/UI SOPHISTICATION REQUIREMENTS

### **Must-Have UX Features:**
1. **Optimistic UI Updates** - Show changes immediately, rollback on error
2. **Loading States** - Skeleton screens, not just spinners
3. **Error Recovery** - Clear error messages with retry options
4. **Keyboard Shortcuts** - `Cmd+K` for quick post creation
5. **Drag-and-Drop** - For media upload and calendar rescheduling
6. **Real-time Updates** - WebSocket or polling for post status
7. **Undo Actions** - Toast with undo button for deletions
8. **Smart Defaults** - Pre-fill common fields, suggest best posting times
9. **Accessibility** - ARIA labels, keyboard navigation, screen reader support
10. **Responsive Design** - Mobile-first, works on all devices

### **Visual Polish:**
- Smooth transitions (200-300ms)
- Hover states on all interactive elements
- Focus states for keyboard navigation
- Micro-interactions (button press animations, success checkmarks)
- Consistent spacing (4px, 8px, 12px, 16px, 24px, 32px)

---

## 📚 REFERENCE EXISTING CODE

**Study these files for patterns:**
- `src/app/portal/profit-estimator/page.tsx` - Tab structure, data fetching
- `src/components/portal/profit-estimator/AddProjectModal.tsx` - Modal pattern
- `src/app/api/portal/profit-estimator/projects/route.ts` - API route pattern
- `src/components/portal/profit-estimator/SummaryCard.tsx` - Card component
- `src/app/portal/settings/page.tsx` - Settings page structure

---

## ✅ ACCEPTANCE CRITERIA

1. ✅ All Prisma schema changes applied and migrated
2. ✅ OAuth flows working for at least Facebook and Instagram
3. ✅ Can create, schedule, and publish posts
4. ✅ Calendar view shows scheduled posts
5. ✅ Analytics dashboard displays engagement metrics
6. ✅ All components follow brand design system exactly
7. ✅ Mobile responsive
8. ✅ Error handling with toast notifications
9. ✅ Loading states for all async operations
10. ✅ Code committed and pushed to GitHub

---

## 🚀 GETTING STARTED

1. Review `prisma/schema.prisma` to understand current schema
2. Review `docs/brand_style_guide.md` for design requirements
3. Study existing Profit Estimator code for patterns
4. Add new Prisma models and run migrations
5. Create API routes following existing patterns
6. Build UI components with brand design system
7. Test thoroughly before committing
8. Commit with clear, descriptive messages

**Good luck! The architecture is solid, just follow the established patterns.** 🎯

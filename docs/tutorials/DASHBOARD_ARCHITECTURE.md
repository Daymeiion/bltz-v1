# Dashboard Architecture

## 🏗️ Application Structure

```
with-supabase-app/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx                    # Server component (RBAC check)
│   │   ├── dashboard-client.tsx        # Client component (Sidebar + UI)
│   │   └── layout.tsx                  # Dashboard layout
│   ├── auth/                           # Authentication pages
│   └── ...
├── lib/
│   ├── rbac.ts                         # Role-Based Access Control utilities
│   └── supabase/
│       ├── server.ts                   # Server-side Supabase client
│       └── client.ts                   # Client-side Supabase client
├── components/
│   └── ui/
│       └── sidebar.tsx                 # Aceternity Sidebar component
├── types/
│   └── database.ts                     # TypeScript database types
└── scripts/
    └── setup-rbac.sql                  # Database setup script
```

## 🔄 Request Flow

```
User navigates to /dashboard
         ↓
app/dashboard/page.tsx (Server Component)
         ↓
┌────────────────────────────────────┐
│ 1. Get user from Supabase Auth     │
│ 2. Fetch profile from database     │
│ 3. Check if user has 'player' role │
└────────────────────────────────────┘
         ↓
    ┌───────┐
    │ Role? │
    └───┬───┘
        │
   ┌────┴────┐
   │         │
Player    Non-Player
   │         │
   ↓         ↓
Render   Redirect to
Client    /?error=...
```

## 🗄️ Database Architecture

```
┌─────────────────────┐
│   auth.users        │  (Supabase Auth)
│  ┌──────────────┐   │
│  │ id (UUID)    │───┼───┐
│  │ email        │   │   │
│  │ ...          │   │   │
│  └──────────────┘   │   │
└─────────────────────┘   │
                          │ Foreign Key
                          ↓
┌─────────────────────────────────────┐
│   public.profiles                   │
│  ┌──────────────────────────────┐   │
│  │ id (UUID) PRIMARY KEY        │←──┘
│  │ email                        │
│  │ full_name                    │
│  │ avatar_url                   │
│  │ role (player/fan/admin/...)  │ ← RBAC Key
│  │ bio                          │
│  │ location                     │
│  │ website                      │
│  │ twitter_handle               │
│  │ instagram_handle             │
│  │ created_at                   │
│  │ updated_at                   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

## 🔐 Security Layers

```
┌──────────────────────────────────────────┐
│          Client Browser                  │
│  ┌────────────────────────────────────┐  │
│  │  dashboard-client.tsx              │  │
│  │  (UI only, no security)            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
              ↓ Request
┌──────────────────────────────────────────┐
│        Next.js Server (Layer 1)          │
│  ┌────────────────────────────────────┐  │
│  │  page.tsx - Server Component       │  │
│  │  • isAuthenticated() check         │  │
│  │  • isPlayer() check                │  │
│  │  • Redirect if unauthorized        │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
              ↓ Query
┌──────────────────────────────────────────┐
│       Supabase (Layer 2)                 │
│  ┌────────────────────────────────────┐  │
│  │  Row Level Security (RLS)          │  │
│  │  • Users can only read own profile │  │
│  │  • Users can only update own data  │  │
│  │  • Database-level enforcement      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## 📊 Component Hierarchy

```
DashboardPage (Server)
  └─ getCurrentUserProfile()
  └─ isPlayer()
  └─ DashboardClient (Client)
      ├─ Sidebar
      │   └─ SidebarBody
      │       ├─ Logo / LogoIcon
      │       ├─ SidebarLink (x9)
      │       │   ├─ Dashboard
      │       │   ├─ Profile
      │       │   ├─ My Videos
      │       │   ├─ Statistics
      │       │   ├─ Schedule
      │       │   ├─ Achievements
      │       │   ├─ Team
      │       │   ├─ Settings
      │       │   └─ Back to Home
      │       └─ User Profile Link
      └─ Dashboard (Main Content)
          ├─ Skeleton Loaders
          ├─ Welcome Section
          └─ Stats Cards
              ├─ Total Videos
              ├─ Profile Views
              └─ Followers
```

## 🔄 RBAC Function Flow

```javascript
// User tries to access dashboard
/dashboard
    ↓
getCurrentUserProfile()
    ↓
┌───────────────────────────────┐
│ 1. Get auth user from         │
│    Supabase Auth              │
│    ↓                          │
│ 2. Query profiles table       │
│    WHERE id = user.id         │
│    ↓                          │
│ 3. Return UserProfile object  │
│    with role information      │
└───────────────────────────────┘
    ↓
isPlayer()
    ↓
┌───────────────────────────────┐
│ Check if profile.role === 'player' │
└───────────────────────────────┘
    ↓
┌─────────┐
│ Result? │
└─────────┘
    ↓
┌───┴────┐
│        │
true   false
│        │
↓        ↓
Render  Redirect
Page    Away
```

## 🎨 UI Component Structure

```
┌───────────────────────────────────────────────────────────┐
│ Dashboard Container (Full Screen)                         │
│ ┌─────────────┬───────────────────────────────────────┐   │
│ │  Sidebar    │  Main Content Area                    │   │
│ │             │                                       │   │
│ │  ┌────────┐ │  ┌──────────────────────────────┐    │   │
│ │  │  Logo  │ │  │  Skeleton Loaders (4 boxes)  │    │   │
│ │  └────────┘ │  └──────────────────────────────┘    │   │
│ │             │                                       │   │
│ │  Nav Links  │  ┌──────────────────────────────┐    │   │
│ │  • Home     │  │  Skeleton (2 tall boxes)     │    │   │
│ │  • Profile  │  └──────────────────────────────┘    │   │
│ │  • Videos   │                                       │   │
│ │  • Stats    │  ┌──────────────────────────────┐    │   │
│ │  • Schedule │  │  Welcome Section             │    │   │
│ │  • Achieve  │  │  "Welcome back, Player!"     │    │   │
│ │  • Team     │  │                              │    │   │
│ │  • Settings │  │  ┌────┬────┬────┐           │    │   │
│ │  • Home     │  │  │Vid │View│Foll│  Stats    │    │   │
│ │             │  │  └────┴────┴────┘           │    │   │
│ │  ┌────────┐ │  └──────────────────────────────┘    │   │
│ │  │ User   │ │                                       │   │
│ │  │ Avatar │ │                                       │   │
│ │  └────────┘ │                                       │   │
│ └─────────────┴───────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

## 🔀 State Management

```javascript
// Dashboard Client Component State
useState: {
  open: boolean  // Sidebar open/closed state
}

// No global state needed
// Profile data passed via props from Server Component
// Server Component handles auth/role checks
// Client Component handles UI only
```

## 🚀 Data Flow

```
1. Initial Page Load
   ├─ Server fetches user + profile
   ├─ Server validates role
   └─ Server renders with data

2. User Interaction (Sidebar)
   ├─ Client handles hover (expand/collapse)
   ├─ Client handles clicks (navigation)
   └─ Next.js handles routing

3. Navigation to Dashboard Sub-page
   ├─ Next.js navigates to new route
   ├─ New page does own RBAC check
   └─ Renders if authorized
```

## 🛡️ Security Considerations

### Server-Side Protection
✅ All role checks in Server Components
✅ Redirects before rendering sensitive UI
✅ Profile data fetched server-side

### Database Protection
✅ Row Level Security enabled
✅ Users can only access own data
✅ Policies enforce read/write rules

### Client-Side
⚠️ No sensitive data in client state
⚠️ UI-only components
⚠️ Navigation links don't imply authorization

## 🎯 Extension Points

Want to add new features? Here's where to extend:

### New Dashboard Page
```
app/dashboard/new-page/page.tsx
  └─ Copy structure from app/dashboard/page.tsx
  └─ Add RBAC checks
  └─ Create custom content component
```

### New Sidebar Link
```
dashboard-client.tsx → links array
  └─ Add new link object with label, href, icon
```

### New User Role
```
1. lib/rbac.ts → Update UserRole type
2. scripts/setup-rbac.sql → Add role to comments/docs
3. Create new has[Role]() function if needed
```

### New Profile Field
```
1. Database: ALTER TABLE profiles ADD COLUMN new_field TYPE
2. types/database.ts → Update Profile interface
3. lib/rbac.ts → Update UserProfile interface
```

## 📈 Performance Notes

- **Server Components**: Fast initial load, no client-side hydration for auth
- **Client Components**: Only interactive UI parts (sidebar toggle)
- **Database Queries**: Indexed on role and email for fast lookups
- **RLS**: Minimal overhead, enforced at database level

---

This architecture provides a secure, scalable foundation for your player dashboard! 🎉


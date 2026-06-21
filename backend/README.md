# Mela Backend - Supabase Setup Guide

## Overview

This project uses **Supabase** as the backend, providing:

- **Authentication** (email/password + Google OAuth)
- **Postgres Database** with Row Level Security (RLS)
- **Storage** for event posters and documents
- **Edge Functions** (if needed in the future)

## Project Structure

```
backend/
├── supabase-schema.sql    # Full database schema + RLS policies (run in Supabase SQL Editor)
└── README.md              # This file
```

## Prerequisites

1. A [Supabase](https://supabase.com) account
2. A Supabase project created

## Initial Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **New Project**
3. Set a name, database password, and region
4. Wait for the project to initialize

### 2. Configure Authentication

1. Go to **Authentication > Providers**
2. Enable **Email** provider
   - Turn off "Confirm email" for development
3. Enable **Google** provider
   - Add your Google OAuth credentials (Client ID + Secret)
4. Under **URL Configuration**, add your frontend URL to the redirect URLs

### 3. Create Storage Bucket

1. Go to **Storage**
2. Click **New Bucket**
3. Name: `event-posters`
4. Set it as **Public**
5. Click **Create**

### 4. Run Database Schema

1. Go to **SQL Editor**
2. Paste the contents of `backend/supabase-schema.sql`
3. Click **Run**

This creates all 8 tables:
- `users` - User profiles with roles
- `events` - Approved events
- `submissions` - Pending event submissions
- `saved_events` - User bookmarked events
- `organizer_applications` - Organizer verification requests
- `comments` - Event comments
- `likes` - Event likes
- `registrations` - Event registrations

Plus RLS policies, indexes, triggers, and the `approve_event` RPC function.

### 5. Connect Frontend

1. Go to **Settings > API**
2. Copy the **Project URL** and **anon/public key**
3. Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Install dependencies and run:

```bash
cd frontend
npm install
npm run dev
```

## Database Schema

See `supabase-schema.sql` for the complete schema including:
- Table definitions with column types
- Row Level Security (RLS) policies
- Indexes for query performance
- The `approve_event` RPC function
- Auto-updating `updated_at` triggers

### Key Tables

| Table | Description |
|-------|-------------|
| `users` | User profiles linked to Supabase Auth. Fields: role (student/moderator/admin), moderator_for, university |
| `events` | Approved events visible to all users |
| `submissions` | Pending submissions awaiting moderator review |
| `saved_events` | User bookmarked events |
| `organizer_applications` | Applications to become an organizer |
| `comments` | Comments on events |
| `likes` | Event likes (unique per user+event) |
| `registrations` | Event registrations (unique per user+event) |

## Security (Row Level Security)

All tables have RLS enabled. Key policies:

- **Users**: Public read, self-update, admin can manage roles
- **Events**: Public read, moderators/admins can write
- **Submissions**: Owner + moderators can read, owner can update while pending
- **Saved Events**: Users can only manage their own
- **Comments**: Public read, authenticated users can post, authors/admins can delete
- **Likes**: Public read, users can like/unlike their own
- **Registrations**: Users manage own, organizers see their event registrations

## Creating Moderators

The first admin must be set manually:

1. Sign up through the app
2. Go to Supabase Dashboard > Table Editor > `users`
3. Find your user and set:
   - `role` = `admin`
   - `moderator_for` = `{}` (empty array for admin)

After that, admins can promote users to moderators through the Admin Dashboard UI.

## Seeding Data

To seed sample events:

```bash
cd seed
npm install
# Set environment variables or update seed.mjs with credentials
VITE_SUPABASE_URL=https://your-project.supabase.co VITE_SUPABASE_ANON_KEY=your-key node seed.mjs
```

## Monitoring

- **Supabase Dashboard > Logs** - View auth, database, and storage logs
- **Supabase Dashboard > Table Editor** - Browse and edit data directly
- **Supabase Dashboard > API** - View API documentation and test endpoints

## Costs & Limits

### Free Tier
- Database: 500MB storage
- Storage: 1GB file storage
- Bandwidth: 2GB/month
- Edge Functions: 500K invocations/month
- Auth: 50K monthly active users

### Pro Plan ($25/month)
- 8GB database
- 100GB storage
- 250GB bandwidth
- No project pausing

## Troubleshooting

### RLS Policy Errors
If you get "permission denied" errors:
1. Check that RLS policies are applied (Table Editor > Policies tab)
2. Verify the user is authenticated
3. Check user role in the `users` table

### Storage Upload Errors
If poster uploads fail:
1. Verify the `event-posters` bucket exists and is public
2. Check file size (max 5MB) and type (jpeg, png, webp)

### Auth Issues
If Google OAuth fails:
1. Verify redirect URL matches your frontend URL
2. Check Google OAuth credentials in Authentication settings

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)


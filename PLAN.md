# MELA — Project Plan

## Overview

MELA is a centralized university event discovery platform connecting students across 8+ Pakistani universities. It replaces fragmented event communication (WhatsApp groups, posters, social media) with a single web hub.

**Target Users:** Students, faculty advisors, university moderators, and administrators.

---

## Phase 1: Core Platform ✅ (Complete)

### Frontend
- [x] React SPA with Vite and React Router 6
- [x] 23 route-level pages across public, authenticated, and role-based access
- [x] UI kit with 14 reusable components (Button, Card, Modal, Toast, etc.)
- [x] Brutalist design system (custom CSS, black/yellow/pink palette)
- [x] Responsive layout with Navbar, Footer, and mobile drawer

### Backend (Supabase)
- [x] PostgreSQL schema with 8 tables (users, events, submissions, etc.)
- [x] Row-Level Security (RLS) policies per role
- [x] `approve_event` RPC function (transactional submission→event promotion)
- [x] Auth triggers (auto-create profile on signup)
- [x] Registration limit enforcement trigger

### Auth & Data Layer
- [x] Email/password authentication via Supabase Auth
- [x] 9 service modules (auth, event, submission, moderator, user, application, comment, like, registration)
- [x] Context-based auth state management (AuthContext)
- [x] Protected routes with role checking

### Event Management
- [x] Event submission with poster upload (max 5MB, JPEG/PNG/WebP)
- [x] Moderator review workflow (approve/reject with reason)
- [x] Event feed with filtering (category, university, upcoming), search, pagination
- [x] Registration, likes, comments, saved events

### User Management
- [x] Profile editing (name, university, interests)
- [x] 4 roles: student, advisor, moderator, admin
- [x] Admin dashboard for user/role management
- [x] Organizer application workflow with document uploads

### Deployment
- [x] Vercel configuration
- [x] Responsive design
- [x] 404 page with navigation options

---

## Phase 2: Enhancements (In Progress / Planned)

### AI & Discovery
- [ ] AI-powered personalized event recommendations (based on interests/attendance history)
- [ ] Smart event categorization using NLP
- [ ] Scraped events ingestion pipeline (`scraped_events` table exists)
- [ ] Event similarity / "you might also like" module

### Communication
- [ ] Email notifications for registration confirmation, reminders
- [ ] In-app notification system (bell icon, notification panel)
- [ ] Push notifications (reminders for saved/upcoming events)

### Organizer Features
- [ ] Event analytics dashboard (views, registrations, engagement)
- [ ] Attendee management (export registrant list)
- [ ] Event series/recurring events support

### Moderation
- [ ] Bulk moderation actions
- [ ] Moderation history log
- [ ] Reported events/comments system

### Infrastructure
- [ ] TypeScript migration
- [ ] Unit & integration tests (Vitest + Testing Library)
- [ ] CI/CD pipeline (GitHub Actions → Vercel)
- [ ] Error monitoring (Sentry or similar)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Vercel                          │
│  ┌───────────────────────────────────────────┐   │
│  │          React SPA (Vite)                  │   │
│  │  Pages → Services → Supabase Client        │   │
│  └───────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────┐
│                   Supabase                        │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Auth     │  │PostgreSQL│  │ Storage         │ │
│  │ (GoTrue)  │  │ 8 tables │  │ event-posters   │ │
│  │          │  │ + RLS     │  │ bucket          │ │
│  │          │  │ + RPC     │  │                │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Data Flow: Event Submission

```
User → SubmitEvent → submissionService.submitEvent()
  → INSERT submissions (status=pending) + upload poster to Storage
  → ModeratorDashboard fetches pending submissions via moderatorService
  → approve_event RPC (SECURITY DEFINER)
    → INSERT into events + DELETE from submissions
  → EventFeed displays approved events
```

---

## Database Schema Overview

| Table | Purpose | RLS |
|-------|---------|-----|
| `users` | User profiles linked to auth.users | Own profile + admin |
| `events` | Approved published events | Public read, moderator/admin write |
| `submissions` | Pending/rejected event submissions | Owner read, moderator write |
| `saved_events` | User wishlists | Own records |
| `organizer_applications` | Organizer role applications | Admin management |
| `comments` | Event comments | Public read, owner delete |
| `likes` | Event likes | Own records |
| `registrations` | Event registrations | Own records |

---

## Development Commands

```bash
npm run dev          # Start frontend dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run seed         # Seed Supabase with sample data
```

## Deployment

The project deploys on Vercel with `rootDirectory` set to `frontend/`. Supabase instance is configured separately with the schema from `backend/supabase-schema.sql`.

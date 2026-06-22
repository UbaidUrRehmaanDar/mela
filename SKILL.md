---
name: mela
description: Centralized University Event Discovery Platform — React + Supabase
---

# MELA: Event Discovery Platform

MELA is a centralized hub for university event discovery, connecting students across 8+ Pakistani universities. It uses React (Vite) for the frontend and Supabase (PostgreSQL + Auth + Storage) as the backend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, React Router 6 |
| Styling | Custom CSS (brutalist design system) |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Deployment | Vercel (frontend) |

## Project Structure

```
mela/
├── frontend/               # React SPA (Vite)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── ui/         # UI kit (14 components)
│   │   ├── pages/          # 23 route-level pages
│   │   ├── services/       # Data layer (9 modules)
│   │   ├── context/        # AuthContext provider
│   │   ├── config/         # Supabase client
│   │   └── utils/          # Constants, helpers, university data
│   └── index.html
├── backend/                # Supabase schema & docs
│   └── supabase-schema.sql # 8 tables + RLS + RPC + triggers
├── seed/                   # Seed data scripts
│   ├── seed.mjs
│   ├── seed.sql
│   └── scraped_events.sql
└── vercel.json             # Deploy config
```

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | LandingPage | Public |
| `/events` | EventFeed | Public |
| `/events/:id` | EventDetails | Public |
| `/login` | Login | Public |
| `/universities` | UniversityList | Public |
| `/universities/:name` | UniversityDetail | Public |
| `/about`, `/help`, `/privacy`, `/terms`, `/contact` | Static pages | Public |
| `/reset-password` | PasswordReset | Public |
| `/submit` | SubmitEvent | Auth |
| `/profile` | Profile | Auth |
| `/saved-events` | SavedEvents | Auth |
| `/my-registrations` | MyRegistrations | Auth |
| `/my-events` | MyEvents | Auth |
| `/apply-organizer` | ApplyOrganizer | Auth |
| `/advisor` | AdvisorDashboard | advisor |
| `/admin` | ModeratorDashboard | moderator, admin |
| `/admin/users` | AdminDashboard | admin |

## User Roles

- **Student** — Browse, register, save, like, comment on events
- **Organizer** (advisor role) — Submit events, manage own events
- **Moderator** — Review & approve/reject submissions for their universities
- **Admin** — Manage users, roles, organizer applications

## Event Workflow

```
Submit (SubmitEvent)
  → submissions (status=pending)
    → Moderator approves (approve_event RPC)
      → events (published, visible on feed)
    → Moderator rejects (with reason)
      → submissions (status=rejected)
```

## Development

```bash
# Install dependencies
npm install && npm install --prefix frontend

# Run dev server
npm run dev

# Build
npm run build

# Seed database
npm run seed
```

## Key Conventions

- Supabase client is initialized once in `config/supabase.js`
- All service functions return `{ success, data }` or `{ success, error }`
- RLS policies enforce access control; the app never uses service_role key
- Event posters upload to Supabase Storage bucket `event-posters`
- Brutalist design: heavy borders, black + yellow + pink palette, custom CSS in `index.css`
- No TypeScript — entire codebase is JavaScript (JSX)
- Component tree: Providers > BrowserRouter > ErrorBoundary > Navbar + Layout + Routes

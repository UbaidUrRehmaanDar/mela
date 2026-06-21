# MELA

**Centralized University Event Discovery Platform**

MELA connects students with academic, professional, cultural, and extracurricular events across multiple universities. It solves the problem of fragmented event communication by providing a single hub for discovering, registering for, and engaging with opportunities.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router 6, Tailwind CSS |
| Backend | Supabase (Auth, PostgreSQL, Storage, RLS) |
| Animation | Framer Motion |
| Icons | Lucide React |

## Architecture

```mermaid
graph TB
    subgraph Client["Browser — React SPA"]
        P[Pages<br/>23 Route Components]
        S[Services<br/>9 API Modules]
        C[Context & Components<br/>AuthContext · ProtectedRoute · UI Kit]
        P --> S --> C
    end

    subgraph Backend["Supabase — Serverless Backend"]
        A[Auth<br/>Email/Password · JWT · Sessions]
        ST[Storage<br/>Event Posters · Documents]
        DB[(PostgreSQL<br/>8 Tables · RLS · RPC · Triggers)]
    end

    subgraph Tables["Database Tables"]
        T1[users]
        T2[events]
        T3[submissions]
        T4[saved_events]
        T5[organizer_applications]
        T6[comments]
        T7[likes]
        T8[registrations]
    end

    Client -->|HTTPS| A
    Client -->|HTTPS| ST
    Client -->|HTTPS| DB
    DB --> T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8
```

## User Roles

- **Student** — Browse, register, save, like, comment on events
- **Moderator** — Manage events for assigned universities
- **Advisor** — Oversee events, approve submissions
- **Admin** — Manage users, approve organizers, full control

## Event Workflow

```
Student submits event → Pending (submissions table)
  → Moderator/Admin reviews
    → Approved → Published (events table)
    → Rejected → Reason provided
```

## Getting Started

```bash
# Install dependencies
npm run install:all

# Set up Supabase
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env

# Run schema in Supabase SQL Editor
# backend/supabase-schema.sql

# Start dev server
npm run dev

# Seed sample data
npm run seed
```

## Database

8 tables with Row Level Security (RLS) enforcing role-based access:
`users`, `events`, `submissions`, `saved_events`, `organizer_applications`, `comments`, `likes`, `registrations`

## Project Structure

```
Mela/
├── frontend/         # React SPA
│   └── src/
│       ├── pages/          # Route components
│       ├── services/       # Supabase data layer
│       ├── components/     # Layout + UI kit
│       ├── context/        # AuthContext
│       ├── config/         # Supabase client
│       └── utils/          # Constants, helpers
├── backend/          # Supabase schema (SQL)
├── seed/             # Dev data scripts
└── package.json      # Root orchestrator
```

See [PROJECT.md](./PROJECT.md) for full project specifications.

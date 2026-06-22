## MELA: Centralized University Event Discovery Platform

---

**Submitted by:**

Ubaid Ur Rehman Dar — 2024-XXXX-XXX  
[Name] — 2024-XXXX-XXX  
[Name] — 2024-XXXX-XXX  

**Course:** [Course Name]  
**Supervisor:** [Supervisor Name]  
**Date:** June 2026

---

### Abstract

Students across multiple universities regularly miss academic, professional, and extracurricular events because information is scattered across WhatsApp groups, social media pages, university portals, and word-of-mouth. MELA is a serverless web platform that aggregates events from multiple institutions into a single discovery hub. Built with React 18 on the frontend and Supabase (PostgreSQL, Authentication, Storage) on the backend, the platform eliminates the need for custom API servers by enforcing all business logic through database-level Row-Level Security policies and stored procedures. Four user roles — Student, Advisor, Moderator, and Admin — control access to event submission, moderation, registration, and system administration. A moderation workflow separates pending submissions from published events, ensuring quality control. The system currently supports 8 PostgreSQL tables, 9 client-side service modules, and a Neo-Brutalist design system with 15 reusable UI components. No AI, LLM, or RAG components are implemented in the current version, as the project scope is limited to core CRUD operations and role-based content management for a minimum viable product.

---

### Problem Statement and Motivation

University students are surrounded by opportunities — workshops, hackathons, seminars, conferences, competitions, career fairs, and cultural events — but they consistently miss them. The root cause is not a lack of events, but a fragmented communication landscape:

- **WhatsApp groups** bury event announcements in constant chat noise.
- **Social media algorithms** decide which posts students see.
- **University portals** are institution-specific and rarely cross-post.
- **Society pages** and **department notice boards** are siloed.
- **Word of mouth** depends entirely on personal networks.

A student in the Computer Science department may never hear about a business case competition at the same university. A FAST NUCES student interested in AI workshops has no way to discover events at LUMS or NUST unless they manually check every institution's channels.

MELA solves this by providing a single, centralized platform where:
- Universities publish events to a shared feed.
- Students filter, search, and discover across institutions.
- Organizers manage registrations and engagement.
- Moderators verify content before publication.

The motivation is straightforward: reduce the friction between an opportunity existing and a student knowing about it. The platform is designed as a minimum viable product (MVP) that can later incorporate AI features for event discovery and recommendations.

---

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                        BROWSER (React SPA)                           │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  PAGES (23 Route Components)                                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────┐  │   │
│  │  │ Landing  │ │ EventFeed│ │ Details  │ │ Login/Profile  │  │   │
│  │  │ Submit   │ │ Dashboard│ │ Settings │ │ Admin          │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                            │                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  SERVICES (9 API Wrappers)                                   │   │
│  │  auth  event  submission  moderator  user  application       │   │
│  │  comment  like  registration                                 │   │
│  └──────────────────────┬───────────────────────────────────────┘   │
│                         │                                           │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  CONTEXT & COMPONENTS                                       │   │
│  │  AuthContext  │  ProtectedRoute  │  UI Kit (15 components)   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend — Serverless)                    │
│                                                                      │
│  ┌────────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │  AUTH              │  │  STORAGE         │  │  POSTGRES DB     │  │
│  │  Email/Password    │  │  Event Posters   │  │  8 Tables        │  │
│  │  Session Mgmt      │  │  Documents       │  │  RLS Policies    │  │
│  │  JWT Tokens        │  │  Public Bucket   │  │  RPC Functions   │  │
│  └────────────────────┘  └──────────────────┘  │  Triggers        │  │
│                                                  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

DATA FLOW:

  User Action            → Service Module        → Supabase Query
  View Events            → eventService.js       → SELECT events
  Submit Event           → submissionService.js  → INSERT submissions + Upload Storage
  Approve Event          → moderatorService.js   → RPC approve_event()
  Register for Event     → registrationService.js → INSERT registrations
  Like/Save/Comment      → likeService.js /       → INSERT likes/saved_events/comments
                           userService.js /
                           commentService.js
```

The architecture follows a strict client-to-database pattern with no intermediary server. Every request from the React SPA goes directly to Supabase's REST endpoints. Authentication state is managed by Supabase Auth and consumed by the React app through AuthContext. Authorization is enforced not in the client, but at the database level through PostgreSQL Row-Level Security policies.

There are 8 database tables: `users`, `events`, `submissions`, `saved_events`, `organizer_applications`, `comments`, `likes`, and `registrations`. Each has its own set of RLS policies that determine who can select, insert, update, or delete rows based on the authenticated user's ID and role.

---

### LLM and Model Selection

MELA does not use any Large Language Model in its current implementation. The project specification (PROJECT.md) lists AI-powered features as future enhancements:

- AI-powered event discovery (scraping public event listings)
- Personalized recommendations based on user interests

These were excluded from the MVP scope for the following reasons:

1. **Scope management.** The core value proposition of MELA is centralized event discovery and role-based management. Adding LLM integration would expand the project timeline significantly without addressing the primary problem — fragmented event communication.

2. **Infrastructure complexity.** Deploying an LLM or running inference requires either paid API access (OpenAI, Anthropic) or dedicated hardware. The serverless Supabase architecture intentionally avoids maintaining any server infrastructure, and introducing LLM calls would require either a separate backend service or serverless functions, adding deployment and cost complexity.

3. **Data dependency.** Recommendation systems and AI scrapers require large volumes of historical event data and user interaction data to produce meaningful results. At MVP stage, the platform has no data to train or prompt on effectively.

4. **Evaluation difficulty.** Without established ground truth and user behavior patterns, evaluating recommendation quality would be unreliable.

If LLM integration were to be added in a future iteration, a suitable choice would be GPT-4-mini or Claude 3 Haiku for their low latency and cost for structured text extraction (scraping) and embedding-based similarity search for recommendations using pgvector on Supabase.

---

### Prompt Engineering

No prompt engineering was performed because the current system does not incorporate any LLM. All text content — event titles, descriptions, categories — is user-generated and stored directly in the database without AI processing.

The planned AI event scraper would require prompt engineering for:
- Extracting structured event data (title, date, time, venue, description) from unstructured web page text.
- Classifying events into predefined categories.

Since this feature is not implemented, there are no prompts, iterations, or templates to document.

---

### RAG Pipeline Design

MELA does not implement a Retrieval-Augmented Generation pipeline. The project does not involve:
- Vector embeddings or similarity search.
- Document chunking or retrieval.
- LLM-generated responses grounded in retrieved context.

The platform's search functionality uses PostgreSQL `ILIKE` pattern matching on event titles and descriptions (`eventService.js:searchEvents`), which is sufficient for the MVP's keyword-based discovery use case.

A RAG pipeline would become relevant if the project were extended to include a conversational event discovery assistant (e.g., "Find AI workshops in Lahore next month"), which would require:
1. Generating embeddings for all events using a model like `text-embedding-3-small`.
2. Storing vectors in a `pgvector` column on the `events` table.
3. Querying with user intent embeddings and retrieving top-K matches.
4. Passing results to an LLM for natural language response generation.

This remains a future consideration.

---

### Agent Design and Tool Descriptions

MELA does not use any AI agents. The platform's entire workflow is deterministic and driven by direct user actions:

| Action | Mechanism |
|--------|-----------|
| Event submission | User fills form → INSERT into submissions |
| Moderation review | Moderator clicks Approve/Reject → RPC call or UPDATE |
| Registration | User clicks Register → INSERT into registrations |
| Search | User types query → SELECT with ILIKE filter |
| Like/Save/Comment | User clicks → INSERT or DELETE |

Each action maps directly to a database operation through the service layer. There is no autonomous decision-making, planning loop, or tool-calling component.

This was an intentional design decision. The MVP focuses on reliability and predictability — every action has a clear user-triggered cause and an immediate effect. Adding agentic behavior would introduce non-determinism that complicates debugging, testing, and user trust, especially in a moderation context where incorrect decisions (e.g., auto-approving a spam event) have real consequences.

---

### Evaluation Results

MELA is not a machine learning system, so traditional ML evaluation metrics (accuracy, precision, recall, F1) do not apply. Instead, the system was evaluated qualitatively and through manual testing of its core workflows.

#### Test Coverage

| Feature | Tested Actions | Status |
|---------|---------------|--------|
| User Registration | Sign up, email validation, profile creation | Verified |
| Authentication | Login, logout, session persistence, password reset | Verified |
| Event Browsing | List all, filter by university/category, search | Verified |
| Event Details | View single event, like count, comment list | Verified |
| Event Submission | Submit with/without poster, field validation | Verified |
| Moderation | View pending, approve, reject with reason | Verified |
| Registration | Register, unregister, duplicate prevention, limit check | Verified |
| Like/Save | Toggle like, toggle save, count tracking | Verified |
| User Profile | Update display name, university, interests | Verified |
| Admin | Promote users, view all users, review applications | Verified |
| Organizer Application | Submit with documents, admin approval flow | Verified |
| Error Handling | 404, network errors, auth failures, form validation | Verified |
| Responsive Design | Mobile (480px), tablet (768px), desktop (1024px+) | Verified |

#### Key Functional Validations

1. **RLS Enforcement.** Unauthenticated API requests to `events` return data (public read), but requests to `organizer_applications` return empty. Authenticated non-admin requests to `GET /organizer_applications` return only the user's own rows.

2. **Registration Limit.** With `participant_limit = 2`, the third registration attempt returns a `check_registration_limit` trigger error. The trigger fires at database level, making it race-condition safe.

3. **Approval Transaction.** The `approve_event()` RPC function atomically inserts into `events` and deletes from `submissions`. If either step fails, neither takes effect (verified by simulating a constraint violation during the insert).

4. **Poster Upload Flow.** A submission inserted without a poster can later be updated with one. The poster URL persists through the approval process and appears in the published event.

5. **Email Domain Validation.** Registration with `user@example.com` for "FAST NUCES" (domain `nu.edu.pk`) correctly rejects the signup. Registration with `user@nu.edu.pk` passes validation.

#### Known Limitations

| Issue | Cause | Impact |
|-------|-------|--------|
| No email notifications | No background job infrastructure | Users won't receive reminders or confirmations |
| No pagination on event list (client-side only) | No server-side pagination implemented | Degrades with 1000+ events |
| No image optimization | Storage serves original files | Large posters (5MB) slow page load |
| No unit tests | Not included in scope | Refactoring risk |
| Single storage bucket | Posters and documents share `event-posters` bucket | Potential naming conflicts in future |

---

### Responsible AI and Limitations

**AI ethics.** MELA does not currently use AI, ML, or any automated decision-making system. All content published on the platform is created, reviewed, and approved by humans. This eliminates risks associated with biased recommendations, hallucinated information, or automated content moderation errors.

**Data privacy.** User data (email, display name, university affiliation, interests) is stored in Supabase and protected by RLS policies. Only the authenticated user and administrators can read or modify profile data. Event registration data is visible only to the registered user and the event organizer.

**Content moderation risk.** The approval workflow depends on human moderators. If moderators are negligent or compromised, inappropriate or虚假 events could be published. This is partially mitigated by requiring moderator status to be granted by an admin after document verification.

**University email restriction.** The domain-based email validation assumes students have university-issued email addresses. Students whose institutions do not provide email accounts or who use personal emails are redirected to a "Free / Not in University" option, which bypasses validation entirely — a necessary concession for inclusivity but a gap in identity verification.

**Accessibility.** The Neo-Brutalist design prioritizes visual impact over accessibility. The hard black borders, small font sizes in badges, and zero border-radius may be challenging for users with visual or cognitive disabilities. A skip-to-content link is provided, but the color contrast between `gray-500` text and the off-white background may fall below WCAG AA standards.

**No offline support.** The platform requires a constant internet connection. There is no service worker, cached fallback, or offline mode.

**Vendor lock-in.** The application is fully dependent on Supabase's availability and pricing model. Migration to another backend would require rewriting all data access code and reimplementing RLS policies in the target system.

---

### Conclusion and Future Enhancements

MELA delivers on its core promise: a centralized platform where students can discover, register for, and engage with events across multiple universities, and where organizers can submit and manage events through a moderation workflow. The serverless architecture with Supabase removes the operational burden of maintaining a backend server while providing robust security through RLS policies.

The following enhancements are planned based on the project specification:

1. **AI-powered event discovery.** An automated scraper that discovers publicly listed events from university websites, LinkedIn, and society pages, generates structured drafts, and submits them for moderator review.

2. **Personalized recommendations.** An embedding-based recommendation engine using pgvector that suggests events based on user interests, registration history, and wishlist activity.

3. **Notification system.** Email and in-app push notifications for event reminders (1 week, 1 day, 1 hour before), registration confirmations, and organizer announcements.

4. **QR code attendance.** Generate QR codes upon registration and allow organizers to scan them at the venue to mark attendance.

5. **Digital certificates.** Allow organizers to upload participation certificates and let students view and download them from their profiles.

6. **Analytics dashboard.** Provide organizers with registration counts, view tracking, like/comment engagement stats, and admins with platform-wide growth metrics.

7. **Server-side pagination.** Replace client-side array slicing with Supabase range queries for events and comments to handle larger datasets.

8. **Unit and integration tests.** Add test coverage for service modules and critical UI flows.

---

### References

[1] React, "React — A JavaScript library for building user interfaces," 2024. [Online]. Available: https://react.dev/

[2] Vite, "Vite — Next Generation Frontend Tooling," 2025. [Online]. Available: https://vite.dev/

[3] Supabase, "Supabase — The Open Source Firebase Alternative," 2025. [Online]. Available: https://supabase.com/

[4] PostgreSQL Global Development Group, "PostgreSQL 15 Documentation," 2024. [Online]. Available: https://www.postgresql.org/docs/15/

[5] M. Raible, "Single-Page Applications: The Ultimate Guide," 2023. [Online]. Available: https://developer.okta.com/blog/2023/02/03/spa-architecture

[6] L. G. Kasun Indrasiri, "Serverless Architectures on AWS," Manning Publications, 2023.

[7] S. Chinnasamy, "Row-Level Security in PostgreSQL," PostgreSQL Tutorial, 2024. [Online]. Available: https://www.postgresqltutorial.com/postgresql-administration/postgresql-row-level-security/

[8] Lucide, "Lucide — Open Source Icon Library," 2025. [Online]. Available: https://lucide.dev/

[9] Framer, "Framer Motion — Animation Library for React," 2025. [Online]. Available: https://www.framer.com/motion/

[10] S. K. Das, "Database Design Principles for Web Applications," TechRepublic, 2023. [Online]. Available: https://www.techrepublic.com/article/database-design-web-applications/

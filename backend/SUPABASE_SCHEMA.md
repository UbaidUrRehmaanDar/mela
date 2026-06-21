# Mela Supabase Database Schema

## Tables Overview

### 1. users
Stores user profile information and roles. Linked to Supabase Auth.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | References auth.users(id) |
| email | TEXT | User email |
| display_name | TEXT | Display name |
| photo_url | TEXT | Profile photo URL |
| university | TEXT | University name |
| role | TEXT | `student`, `moderator`, or `admin` |
| moderator_for | TEXT[] | Universities they moderate |
| interests | TEXT[] | User interests |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last update time |

---

### 2. events
Approved events visible to all users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| title | TEXT | Event title |
| description | TEXT | Event description |
| date_time | TIMESTAMPTZ | Event date and time |
| university | TEXT | Host university |
| category | TEXT | Tech, Workshop, Seminar, etc. |
| venue | TEXT | Event venue |
| poster_url | TEXT | Supabase Storage public URL |
| event_url | TEXT | External event URL |
| organizer_email | TEXT | Organizer contact |
| organizer_id | UUID | User ID of organizer |
| approved | BOOLEAN | Always true in this table |
| approved_by | UUID | Moderator who approved |
| approved_at | TIMESTAMPTZ | Approval time |
| participant_limit | INTEGER | Max participants (optional) |
| created_at | TIMESTAMPTZ | Creation time |
| updated_at | TIMESTAMPTZ | Last update time |

---

### 3. submissions
Pending event submissions awaiting moderator review.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| title | TEXT | Event title |
| description | TEXT | Event description |
| date_time | TIMESTAMPTZ | Event date and time |
| university | TEXT | Host university |
| category | TEXT | Event category |
| venue | TEXT | Event venue |
| poster_url | TEXT | Poster image URL |
| event_url | TEXT | External event URL |
| organizer_email | TEXT | Organizer contact |
| organizer_id | UUID | User ID |
| status | TEXT | `pending` or `rejected` |
| rejection_reason | TEXT | Reason for rejection |
| rejected_by | UUID | Moderator who rejected |
| created_at | TIMESTAMPTZ | Submission time |
| updated_at | TIMESTAMPTZ | Last update time |

---

### 4. saved_events
User's saved/bookmarked events.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID | User who saved |
| event_id | UUID | Event reference |
| event_title | TEXT | Denormalized title |
| event_date_time | TIMESTAMPTZ | Denormalized date |
| reminder_sent | BOOLEAN | Reminder status |
| created_at | TIMESTAMPTZ | Save time |

**Unique constraint:** (user_id, event_id)

---

### 5. organizer_applications
Applications to become an organizer/moderator.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| user_id | UUID | Applicant user |
| user_email | TEXT | Applicant email |
| display_name | TEXT | Applicant name |
| university | TEXT | Target university |
| society_name | TEXT | Society/club name |
| reason | TEXT | Application reason |
| status | TEXT | `pending`, `approved`, `rejected` |
| feedback | TEXT | Admin feedback |
| id_card_url | TEXT | Student ID document URL |
| society_proof_url | TEXT | Society proof URL |
| authorization_url | TEXT | Authorization letter URL |
| created_at | TIMESTAMPTZ | Application time |
| updated_at | TIMESTAMPTZ | Last update time |

---

### 6. comments
Event comments.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| event_id | UUID | Event reference |
| user_id | UUID | Comment author |
| user_email | TEXT | Author email |
| display_name | TEXT | Author name |
| content | TEXT | Comment text |
| created_at | TIMESTAMPTZ | Post time |

---

### 7. likes
Event likes.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| event_id | UUID | Event reference |
| user_id | UUID | User who liked |
| created_at | TIMESTAMPTZ | Like time |

**Unique constraint:** (event_id, user_id)

---

### 8. registrations
Event registrations.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Auto-generated |
| event_id | UUID | Event reference |
| event_title | TEXT | Denormalized title |
| event_date_time | TIMESTAMPTZ | Denormalized date |
| event_university | TEXT | Denormalized university |
| user_id | UUID | Registered user |
| user_name | TEXT | User display name |
| user_email | TEXT | User email |
| user_university | TEXT | User university |
| registered_at | TIMESTAMPTZ | Registration time |

**Unique constraint:** (event_id, user_id)

---

## RPC Functions

### approve_event(submission_id, approver_id)
Transactional function that:
1. Fetches the submission
2. Verifies the approver is a moderator for that university
3. Inserts into `events` table
4. Deletes from `submissions` table

---

## Indexes

- `events`: university, category, date_time, organizer_id
- `submissions`: organizer_id, (university + status)
- `saved_events`: user_id
- `comments`: event_id
- `likes`: event_id, (user_id + event_id)
- `registrations`: event_id, user_id

---

## Storage

### Event Posters
- **Bucket:** `event-posters` (public)
- **Path pattern:** `{eventId}/poster.{ext}`
- **Max size:** 5MB
- **Allowed types:** JPEG, PNG, WebP

### Organizer Documents
- **Bucket:** `event-posters` (shared bucket)
- **Path pattern:** `organizer-documents/{userId}/{docType}_{timestamp}.{ext}`

---

## Data Flow

1. **Event Submission:** User submits event -> stored in `submissions` -> poster uploaded to Storage
2. **Event Approval:** Moderator approves -> `approve_event` RPC moves to `events`
3. **Event Rejection:** Moderator rejects -> status updated to `rejected`
4. **Save Event:** Insert into `saved_events`

---

## Notes

- All timestamps are `TIMESTAMPTZ` (UTC)
- `updated_at` columns are auto-updated via trigger
- Image URLs stored as public Supabase Storage URLs
- Denormalized data (event_title, event_date_time in saved_events/registrations) reduces joins
- `moderator_for` uses Postgres `TEXT[]` arrays

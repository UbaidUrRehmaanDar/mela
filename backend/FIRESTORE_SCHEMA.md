# Mela Firestore Database Schema

## Collections Overview

### 1. **users**
Stores user profile information and roles.

```
users/{userId}
├── email: string
├── displayName: string
├── photoURL: string (optional)
├── university: string (e.g., "FAST NUCES", "LUMS", "PUCIT")
├── role: string ("student" | "moderator" | "admin")
├── moderatorFor: array<string> (universities they moderate, only if role is moderator)
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Example:**
```json
{
  "email": "ubaid@fastmail.nu.edu.pk",
  "displayName": "Ubaid Rehman",
  "photoURL": "https://...",
  "university": "FAST NUCES",
  "role": "moderator",
  "moderatorFor": ["FAST NUCES"],
  "createdAt": "2026-04-07T10:00:00Z",
  "updatedAt": "2026-04-07T10:00:00Z"
}
```

---

### 2. **events**
Approved events visible to all users.

```
events/{eventId}
├── title: string
├── description: string
├── dateTime: timestamp
├── university: string
├── category: string ("Tech" | "Workshop" | "Seminar" | "Hackathon" | "Meetup" | "Other")
├── venue: string (optional)
├── posterURL: string (Firebase Storage URL)
├── organizerEmail: string
├── organizerId: string (user ID)
├── approved: boolean (always true in this collection)
├── approvedBy: string (moderator user ID)
├── approvedAt: timestamp
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Example:**
```json
{
  "title": "AI & Gen-Z Tech Meetup",
  "description": "Explore the latest AI trends with industry experts",
  "dateTime": "2026-10-24T14:00:00Z",
  "university": "FAST NUCES",
  "category": "Tech",
  "venue": "Auditorium Block A",
  "posterURL": "https://firebasestorage.googleapis.com/...",
  "organizerEmail": "organizer@example.com",
  "organizerId": "user123",
  "approved": true,
  "approvedBy": "mod456",
  "approvedAt": "2026-04-07T11:00:00Z",
  "createdAt": "2026-04-07T10:30:00Z",
  "updatedAt": "2026-04-07T11:00:00Z"
}
```

---

### 3. **submissions**
Pending event submissions awaiting moderator review.

```
submissions/{submissionId}
├── title: string
├── description: string
├── dateTime: timestamp
├── university: string
├── category: string
├── venue: string (optional)
├── posterURL: string
├── organizerEmail: string
├── organizerId: string
├── status: string ("pending" | "rejected")
├── rejectionReason: string (optional, if status is rejected)
├── rejectedBy: string (optional, moderator user ID)
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Example:**
```json
{
  "title": "Web3 Developer Workshop",
  "description": "Learn blockchain development fundamentals",
  "dateTime": "2026-11-05T16:00:00Z",
  "university": "LUMS",
  "category": "Workshop",
  "venue": "CS Lab 3",
  "posterURL": "https://firebasestorage.googleapis.com/...",
  "organizerEmail": "ali@lums.edu.pk",
  "organizerId": "user789",
  "status": "pending",
  "createdAt": "2026-04-07T12:00:00Z",
  "updatedAt": "2026-04-07T12:00:00Z"
}
```

---

### 4. **savedEvents**
User's saved/bookmarked events for reminders.

```
savedEvents/{savedEventId}
├── userId: string
├── eventId: string (reference to events collection)
├── eventTitle: string (denormalized for quick access)
├── eventDateTime: timestamp (denormalized)
├── reminderSent: boolean
├── createdAt: timestamp
```

**Alternative Structure (Subcollection):**
```
users/{userId}/savedEvents/{eventId}
├── eventTitle: string
├── eventDateTime: timestamp
├── reminderSent: boolean
└── createdAt: timestamp
```

**Example:**
```json
{
  "userId": "user123",
  "eventId": "event456",
  "eventTitle": "AI & Gen-Z Tech Meetup",
  "eventDateTime": "2026-10-24T14:00:00Z",
  "reminderSent": false,
  "createdAt": "2026-04-07T13:00:00Z"
}
```

---

### 5. **moderators** (Optional - Alternative to embedding in users)
Dedicated collection for moderator assignments.

```
moderators/{moderatorId}
├── userId: string
├── university: string
├── assignedBy: string (admin user ID)
├── assignedAt: timestamp
└── active: boolean
```

**Example:**
```json
{
  "userId": "user456",
  "university": "FAST NUCES",
  "assignedBy": "admin001",
  "assignedAt": "2026-03-01T10:00:00Z",
  "active": true
}
```

---

## Indexes Required

### Composite Indexes (configure in Firebase Console or firestore.indexes.json)

1. **events** collection:
   - `university` (ascending) + `dateTime` (descending)
   - `category` (ascending) + `dateTime` (descending)
   - `university` (ascending) + `category` (ascending) + `dateTime` (descending)

2. **submissions** collection:
   - `university` (ascending) + `status` (ascending) + `createdAt` (descending)

3. **savedEvents** collection:
   - `userId` (ascending) + `eventDateTime` (ascending)
   - `reminderSent` (ascending) + `eventDateTime` (ascending)

---

## Storage Structure

### Event Posters
```
event-posters/
├── {submissionId}/
│   └── poster.jpg (or .png)
└── {eventId}/
    └── poster.jpg
```

**Path pattern:** `event-posters/{eventId}/poster.{ext}`

---

## Security Considerations

1. **Users**: Read own profile, moderators can read users in their university
2. **Events**: Public read, only moderators can write
3. **Submissions**: Organizers can create, only see their own, moderators see all for their university
4. **SavedEvents**: Users can only read/write their own saved events
5. **Moderators**: Only admins can write, users can read to verify moderator status

---

## Data Flow

1. **Event Submission:**
   - User submits event → stored in `submissions` collection
   - Poster uploaded to Storage → URL stored in submission

2. **Event Approval:**
   - Moderator approves → document moved from `submissions` to `events`
   - Original submission deleted

3. **Event Rejection:**
   - Moderator rejects → status updated to "rejected" with reason
   - Document stays in submissions for organizer to see

4. **Save Event:**
   - User saves event → document created in `savedEvents` or subcollection
   - Used for reminder system

---

## Notes

- All timestamps use Firebase `serverTimestamp()`
- Image URLs stored as strings (Firebase Storage download URLs)
- Denormalized data (eventTitle, eventDateTime in savedEvents) reduces reads
- Consider implementing soft deletes for audit trail

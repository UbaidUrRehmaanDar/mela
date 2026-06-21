# Project Overview

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [backend/README.md](file://backend/README.md)
- [QUICKSTART.md](file://QUICKSTART.md)
- [BUILD_SUMMARY.md](file://BUILD_SUMMARY.md)
- [frontend/SERVICES_USAGE.md](file://frontend/SERVICES_USAGE.md)
- [backend/FIRESTORE_SCHEMA.md](file://backend/FIRESTORE_SCHEMA.md)
- [backend/functions/index.js](file://backend/functions/index.js)
- [frontend/src/App.jsx](file://frontend/src/App.jsx)
- [frontend/src/firebase.js](file://frontend/src/firebase.js)
- [frontend/src/services/index.js](file://frontend/src/services/index.js)
- [frontend/src/utils/constants.js](file://frontend/src/utils/constants.js)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
Mela is a campus event discovery platform designed to unify event communication across Lahore’s academic institutions. It connects three primary user groups:
- Students: Discover, filter, search, and save events across universities.
- Event Organizers: Submit events for review and track submission status.
- Moderators: Review, approve/reject submissions, and manage events for assigned universities.

Mela centralizes event visibility, streamlines submission workflows, and maintains quality through role-based moderation powered by Firebase.

Practical value propositions:
- Students save time by discovering relevant events in one place, with filters by university, category, and date.
- Organizers reach a broader audience by submitting events that are vetted and published.
- Moderators efficiently manage submissions for their assigned universities with built-in approval workflows.

## Project Structure
The repository is organized into two main areas:
- frontend: React application with routing, services, UI components, and utilities.
- backend: Firebase configuration including Firestore collections, security rules, Cloud Functions, and deployment metadata.

```mermaid
graph TB
subgraph "Frontend (React)"
FE_App["App.jsx<br/>Routing"]
FE_Services["services/index.js<br/>Service exports"]
FE_Firebase["firebase.js<br/>Firebase SDK init"]
FE_Constants["utils/constants.js<br/>UNIVERSITIES, CATEGORIES, VALIDATION"]
end
subgraph "Backend (Firebase)"
BE_Functions["functions/index.js<br/>Cloud Functions"]
BE_Rules["firestore.rules<br/>Security rules"]
BE_StorageRules["storage.rules<br/>Storage rules"]
BE_Indexes["firestore.indexes.json<br/>Composite indexes"]
BE_Schema["FIRESTORE_SCHEMA.md<br/>Collections & indexes"]
end
FE_App --> FE_Services
FE_Services --> FE_Firebase
FE_Services --> BE_Functions
FE_Firebase --> BE_Rules
FE_Firebase --> BE_StorageRules
BE_Functions --> BE_Schema
BE_Rules --> BE_Indexes
```

**Diagram sources**
- [frontend/src/App.jsx:14-31](file://frontend/src/App.jsx#L14-L31)
- [frontend/src/services/index.js:1-7](file://frontend/src/services/index.js#L1-L7)
- [frontend/src/firebase.js:1-28](file://frontend/src/firebase.js#L1-L28)
- [frontend/src/utils/constants.js:1-100](file://frontend/src/utils/constants.js#L1-L100)
- [backend/functions/index.js:1-331](file://backend/functions/index.js#L1-L331)
- [backend/FIRESTORE_SCHEMA.md:1-250](file://backend/FIRESTORE_SCHEMA.md#L1-L250)

**Section sources**
- [README.md:48-76](file://README.md#L48-L76)
- [backend/README.md:6-18](file://backend/README.md#L6-L18)

## Core Components
- Frontend (React + Vite)
  - Routing via React Router with page components for landing, event feed, submission, moderation dashboard, profile, and saved events.
  - Services module exports for authentication, event retrieval, submissions, moderation actions, and user profile/saved events.
  - Firebase SDK initialized for Firestore, Auth, Storage, Functions, and Analytics.
  - Constants module defines supported universities, categories, statuses, roles, upload constraints, and helpers for validation and formatting.

- Backend (Firebase)
  - Firestore collections: users, events, submissions, savedEvents, optional moderators.
  - Cloud Functions: approveEvent, rejectEvent, checkModeratorStatus, createUserProfile, scheduled sendEventReminders and cleanupRejectedSubmissions.
  - Security rules and composite indexes for efficient querying and role-based access.
  - Storage rules for event poster uploads.

Key user role features:
- Students: browse, filter, search, save events; view details and posters.
- Organizers: submit events, track status, edit pending submissions, view rejection feedback.
- Moderators: review submissions for assigned universities, approve/reject with feedback, edit approved events.

**Section sources**
- [README.md:12-32](file://README.md#L12-L32)
- [README.md:125-150](file://README.md#L125-L150)
- [frontend/src/App.jsx:14-31](file://frontend/src/App.jsx#L14-L31)
- [frontend/src/services/index.js:1-7](file://frontend/src/services/index.js#L1-L7)
- [frontend/src/firebase.js:1-28](file://frontend/src/firebase.js#L1-L28)
- [frontend/src/utils/constants.js:1-100](file://frontend/src/utils/constants.js#L1-L100)
- [backend/FIRESTORE_SCHEMA.md:3-177](file://backend/FIRESTORE_SCHEMA.md#L3-L177)
- [backend/functions/index.js:47-120](file://backend/functions/index.js#L47-L120)
- [backend/functions/index.js:126-188](file://backend/functions/index.js#L126-L188)
- [backend/functions/index.js:194-225](file://backend/functions/index.js#L194-L225)
- [backend/functions/index.js:234-252](file://backend/functions/index.js#L234-L252)

## Architecture Overview
Mela follows a client-server architecture:
- Client: React SPA using Vite for development and Firebase Hosting for production.
- Serverless backend: Firebase Firestore for data, Firebase Authentication for identity, Firebase Storage for images, and Firebase Cloud Functions for business logic and scheduled tasks.

```mermaid
graph TB
Client["Browser (React SPA)"]
Router["React Router<br/>App.jsx"]
Services["Frontend Services<br/>services/index.js"]
FirebaseInit["Firebase SDK Init<br/>firebase.js"]
Firestore["Firestore DB"]
Auth["Firebase Auth"]
Storage["Firebase Storage"]
Functions["Cloud Functions<br/>index.js"]
Rules["Firestore Rules"]
StorageRules["Storage Rules"]
Client --> Router
Router --> Services
Services --> FirebaseInit
FirebaseInit --> Firestore
FirebaseInit --> Auth
FirebaseInit --> Storage
Services --> Functions
Functions --> Firestore
Firestore --- Rules
Storage --- StorageRules
```

**Diagram sources**
- [frontend/src/App.jsx:14-31](file://frontend/src/App.jsx#L14-L31)
- [frontend/src/services/index.js:1-7](file://frontend/src/services/index.js#L1-L7)
- [frontend/src/firebase.js:1-28](file://frontend/src/firebase.js#L1-L28)
- [backend/functions/index.js:1-331](file://backend/functions/index.js#L1-L331)
- [backend/FIRESTORE_SCHEMA.md:181-250](file://backend/FIRESTORE_SCHEMA.md#L181-L250)

## Detailed Component Analysis

### Data Model and Collections
The Firestore schema defines five core collections with denormalized fields for performance and clear separation of concerns.

```mermaid
erDiagram
USERS {
string uid PK
string email
string displayName
string photoURL
string university
string role
string[] moderatorFor
timestamp createdAt
timestamp updatedAt
}
EVENTS {
string id PK
string title
string description
timestamp dateTime
string university
string category
string venue
string posterURL
string organizerEmail
string organizerId
boolean approved
string approvedBy
timestamp approvedAt
timestamp createdAt
timestamp updatedAt
}
SUBMISSIONS {
string id PK
string title
string description
timestamp dateTime
string university
string category
string venue
string posterURL
string organizerEmail
string organizerId
string status
string rejectionReason
string rejectedBy
timestamp createdAt
timestamp updatedAt
}
SAVEDEVENTS {
string id PK
string userId
string eventId
string eventTitle
timestamp eventDateTime
boolean reminderSent
timestamp createdAt
}
MODERATORS {
string id PK
string userId
string university
string assignedBy
timestamp assignedAt
boolean active
}
USERS ||--o{ SAVEDEVENTS : "saves"
USERS ||--o{ SUBMISSIONS : "creates"
USERS ||--o{ EVENTS : "organizes"
SUBMISSIONS ||--|| EVENTS : "converted_to"
```

**Diagram sources**
- [backend/FIRESTORE_SCHEMA.md:3-177](file://backend/FIRESTORE_SCHEMA.md#L3-L177)

**Section sources**
- [backend/FIRESTORE_SCHEMA.md:3-177](file://backend/FIRESTORE_SCHEMA.md#L3-L177)

### Moderator Approval Workflow
This sequence illustrates the end-to-end flow for approving an event submission.

```mermaid
sequenceDiagram
participant Org as "Organizer (Student)"
participant FE as "Frontend Services"
participant CF as "Cloud Function approveEvent"
participant DB as "Firestore"
Org->>FE : "submitEvent(data, poster)"
FE->>DB : "Create document in submissions"
FE->>DB : "Upload poster to Storage"
Org->>FE : "Navigate to /admin"
FE->>CF : "approveEvent({submissionId})"
CF->>DB : "Read submission by ID"
CF->>DB : "Verify moderatorFor for university"
CF->>DB : "Write to events (denormalized)"
CF->>DB : "Delete from submissions"
CF-->>FE : "{success : true}"
FE-->>Org : "Refresh event feed"
```

**Diagram sources**
- [frontend/SERVICES_USAGE.md:215-371](file://frontend/SERVICES_USAGE.md#L215-L371)
- [backend/functions/index.js:47-120](file://backend/functions/index.js#L47-L120)
- [backend/FIRESTORE_SCHEMA.md:224-241](file://backend/FIRESTORE_SCHEMA.md#L224-L241)

**Section sources**
- [README.md:195-239](file://README.md#L195-L239)
- [frontend/SERVICES_USAGE.md:215-371](file://frontend/SERVICES_USAGE.md#L215-L371)
- [backend/functions/index.js:47-120](file://backend/functions/index.js#L47-L120)

### Event Discovery and Filtering Logic
Filtering and search are handled client-side via service functions that query Firestore with composite indexes for performance.

```mermaid
flowchart TD
Start(["User opens Event Feed"]) --> LoadDefaults["Load default filters<br/>upcomingOnly=true"]
LoadDefaults --> Fetch["Call getFilteredEvents(filters)"]
Fetch --> Query["Firestore query with composite index:<br/>university+dateTime desc,<br/>category+dateTime desc,<br/>university+category+dateTime desc"]
Query --> Results{"Results returned?"}
Results --> |Yes| Render["Render event cards<br/>with poster, title, date, category"]
Results --> |No| Empty["Show empty state"]
Render --> Interact["User toggles filters<br/>university/category/all"]
Interact --> Fetch
Empty --> Interact
```

**Diagram sources**
- [frontend/SERVICES_USAGE.md:102-211](file://frontend/SERVICES_USAGE.md#L102-L211)
- [backend/FIRESTORE_SCHEMA.md:181-196](file://backend/FIRESTORE_SCHEMA.md#L181-L196)

**Section sources**
- [frontend/SERVICES_USAGE.md:102-211](file://frontend/SERVICES_USAGE.md#L102-L211)
- [backend/FIRESTORE_SCHEMA.md:181-196](file://backend/FIRESTORE_SCHEMA.md#L181-L196)

### Frontend Routing and Navigation
The application routes define the user journeys for students, organizers, and moderators.

```mermaid
graph LR
Home["/"] --> Events["/events"]
Events --> Details["/events/:id"]
Student["Student"] --> Submit["/submit"]
Student --> Saved["/saved-events"]
Organizer["Organizer"] --> MySub["/my-submissions"]
Moderator["Moderator"] --> Admin["/admin"]
Auth["/login"] --> Home
Profile["/profile"] --> Home
```

**Diagram sources**
- [frontend/src/App.jsx:14-31](file://frontend/src/App.jsx#L14-L31)

**Section sources**
- [frontend/src/App.jsx:14-31](file://frontend/src/App.jsx#L14-L31)

## Dependency Analysis
High-level dependencies:
- Frontend depends on Firebase SDK initialization and service modules for data access.
- Services depend on Cloud Functions for privileged operations (approve/reject) and Firestore for persistence.
- Backend relies on Firestore security rules and composite indexes for access control and query performance.
- Storage rules govern poster uploads.

```mermaid
graph TB
FE["Frontend (React)"]
SVC["Services Module"]
FB["Firebase SDK"]
CF["Cloud Functions"]
FS["Firestore"]
ST["Storage"]
RULES["Firestore Rules"]
IR["Indexes"]
FE --> SVC
SVC --> FB
SVC --> CF
FB --> FS
FB --> ST
CF --> FS
FS --- RULES
FS --- IR
```

**Diagram sources**
- [frontend/src/services/index.js:1-7](file://frontend/src/services/index.js#L1-L7)
- [frontend/src/firebase.js:1-28](file://frontend/src/firebase.js#L1-L28)
- [backend/functions/index.js:1-331](file://backend/functions/index.js#L1-L331)
- [backend/FIRESTORE_SCHEMA.md:181-196](file://backend/FIRESTORE_SCHEMA.md#L181-L196)

**Section sources**
- [frontend/src/services/index.js:1-7](file://frontend/src/services/index.js#L1-L7)
- [frontend/src/firebase.js:1-28](file://frontend/src/firebase.js#L1-L28)
- [backend/functions/index.js:1-331](file://backend/functions/index.js#L1-L331)
- [backend/FIRESTORE_SCHEMA.md:181-196](file://backend/FIRESTORE_SCHEMA.md#L181-L196)

## Performance Considerations
- Composite indexes configured for frequent queries (events by university+date, category+date, submissions by university+status, saved events by user+date).
- Denormalized fields in savedEvents reduce read operations when rendering user-specific lists.
- Scheduled cleanup of rejected submissions prevents index bloat and keeps the database lean.
- Image upload constraints (5MB, allowed types) improve reliability and reduce storage overhead.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Permission denied errors: Ensure Firestore security rules are deployed and the user’s role is set correctly in the users collection.
- Functions not working: Check function logs via Firebase CLI and confirm the function is deployed and reachable.
- Image upload failures: Verify storage rules are deployed and the file meets size/type constraints.
- CORS errors: Confirm Firebase configuration is correct in the frontend and functions are deployed.

Verification checklist:
- Firebase project created and configured.
- Frontend Firebase config updated.
- Backend deployed (Firestore rules, indexes, Cloud Functions, Storage rules).
- User can sign up, submit events, and view submissions.
- Moderator can approve/reject and see updated events.
- Images upload and display correctly.
- No console or function errors.

**Section sources**
- [QUICKSTART.md:84-113](file://QUICKSTART.md#L84-L113)
- [backend/README.md:200-230](file://backend/README.md#L200-L230)
- [README.md:228-239](file://README.md#L228-L239)

## Conclusion
Mela delivers a streamlined, role-based event discovery and management platform tailored to Lahore’s academic ecosystem. Its architecture leverages Firebase for rapid iteration, clear security boundaries, and scalable serverless functions. The platform’s value lies in reducing fragmentation, improving discoverability, and enabling efficient moderation workflows—benefiting students, organizers, and moderators alike.

[No sources needed since this section summarizes without analyzing specific files]
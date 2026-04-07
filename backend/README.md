# Mela Backend - Firebase Setup Guide

## Overview
This directory contains the Firebase backend implementation for Mela, including Firestore security rules, Cloud Functions, and storage rules.

## Project Structure

```
backend/
├── functions/
│   ├── index.js           # Cloud Functions
│   ├── package.json       # Node dependencies
│   └── node_modules/
├── firestore.rules        # Firestore security rules
├── firestore.indexes.json # Firestore composite indexes
├── storage.rules          # Firebase Storage security rules
└── FIRESTORE_SCHEMA.md    # Database schema documentation
```

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Project** created at https://console.firebase.google.com

## Initial Setup

### 1. Login to Firebase
```bash
firebase login
```

### 2. Initialize Firebase (if not already done)
```bash
cd backend
firebase init
```

Select:
- ✅ Firestore
- ✅ Functions
- ✅ Storage

### 3. Install Function Dependencies
```bash
cd functions
npm install
```

## Deployment

### Deploy Everything
```bash
firebase deploy
```

### Deploy Specific Components

**Cloud Functions only:**
```bash
firebase deploy --only functions
```

**Firestore Rules only:**
```bash
firebase deploy --only firestore:rules
```

**Firestore Indexes only:**
```bash
firebase deploy --only firestore:indexes
```

**Storage Rules only:**
```bash
firebase deploy --only storage
```

## Cloud Functions

### Available Functions

1. **approveEvent** (HTTPS Callable)
   - Approves a pending event submission
   - Moves submission from `submissions` to `events` collection
   - Requires: Moderator role for the event's university

2. **rejectEvent** (HTTPS Callable)
   - Rejects a pending event submission
   - Updates status and adds rejection reason
   - Requires: Moderator role

3. **checkModeratorStatus** (HTTPS Callable)
   - Returns current user's moderator status
   - Returns list of universities they can moderate

4. **createUserProfile** (Auth Trigger)
   - Automatically creates user profile when new user signs up
   - Sets default role to 'student'

5. **sendEventReminders** (Scheduled)
   - Runs every hour
   - Sends reminders for upcoming events
   - Placeholder for email/push notification implementation

6. **cleanupRejectedSubmissions** (Scheduled)
   - Runs daily
   - Deletes rejected submissions older than 30 days

### Testing Functions Locally

```bash
cd functions
npm run serve
```

This starts the Firebase Emulator Suite for local testing.

## Security Rules

### Firestore Rules
The `firestore.rules` file implements role-based access control:

- **Students**: Can read events, create submissions, manage saved events
- **Moderators**: Can approve/reject submissions for their universities
- **Admins**: Full access to manage users and roles

### Storage Rules
The `storage.rules` file controls event poster uploads:

- Public read access for all images
- Authenticated users can upload images
- Max file size: 5MB
- Allowed types: jpeg, jpg, png, webp

## Database Schema

See `FIRESTORE_SCHEMA.md` for detailed documentation of:
- Collection structures
- Field types
- Relationships
- Indexes

## Environment Variables

For production, set these in Firebase Console → Functions → Configuration:

```bash
# Example: Email service for reminders (future)
firebase functions:config:set email.api_key="YOUR_API_KEY"
```

## Creating Moderators

Moderators must be assigned by an admin. To create the first admin:

1. Create a user account through the app
2. Manually update their role in Firestore Console:

```javascript
// In Firestore Console, edit the user document
{
  role: "admin"  // or "moderator"
  moderatorFor: ["FAST NUCES", "LUMS"]  // for moderators
}
```

## Monitoring

### View Function Logs
```bash
firebase functions:log
```

### View Real-time Logs
```bash
firebase functions:log --only approveEvent
```

### Firebase Console
Monitor usage, errors, and performance at:
https://console.firebase.google.com

## Costs & Quotas

### Spark Plan (Free)
- Firestore: 1GB storage, 50K reads/day, 20K writes/day
- Functions: 125K invocations/month, 40K GB-seconds
- Storage: 5GB, 1GB/day downloads

### Blaze Plan (Pay-as-you-go)
Required for:
- Scheduled functions
- External API calls from functions
- Higher usage

## Troubleshooting

### Functions Not Deploying
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
cd functions
rm -rf node_modules package-lock.json
npm install
```

### Permission Denied Errors
- Check that security rules are deployed
- Verify user authentication
- Check user role in Firestore

### CORS Errors
- Ensure Firebase config is correct in frontend
- Check that functions are deployed
- Verify API keys and domain whitelist

## Development Workflow

1. Make changes to functions/rules
2. Test locally with emulators
3. Deploy to Firebase
4. Monitor logs for errors
5. Update documentation

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

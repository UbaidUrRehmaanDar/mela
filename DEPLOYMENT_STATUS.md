# 🎉 Mela Backend Deployment Complete!

## ✅ What's Deployed

### Firebase
- **Firestore Database** (asia-east2 region - Hong Kong, closest to Pakistan)
  - Security rules deployed
  - Composite indexes deployed
  - Collections: users, events, submissions, savedEvents, moderators

### Supabase  
- **Storage** configured for event poster images
  - Bucket: `event-posters` (public access)
  - Region: Southeast Asia (Singapore)
  - Max file size: 5MB
  - Allowed formats: JPEG, PNG, WebP

## ⚠️ Cloud Functions Not Deployed

Cloud Functions require Firebase Blaze (paid) plan. The moderator features (approve/reject) will need to be implemented client-side or you'll need to upgrade to Blaze plan.

**Alternative Solution**: Moderator actions can be handled directly in the frontend by updating Firestore documents. The security rules will still enforce moderator permissions.

## 🚀 How to Run the Application

### 1. Start Frontend Development Server
```bash
cd d:\Projects\React\Mela\frontend
npm run dev
```

The app will run at: http://localhost:5173

### 2. Test the Flow

**As a Student:**
1. Sign up/Login with email or Google
2. Browse events on Event Feed
3. Submit a new event (with poster image)
4. Save events to your favorites
5. View your submissions in My Submissions

**As a Moderator:**
You need to manually add moderator role in Firestore:
1. Go to Firebase Console: https://console.firebase.google.com/project/mela-00000/firestore
2. Find your user in the `users` collection
3. Edit the document and set:
   - `role: "moderator"`
   - `moderatorFor: ["University Name"]`

Then you can:
1. Access Moderator Dashboard
2. Approve/Reject pending submissions
3. Manage events

## 📁 Project Structure

```
Mela/
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, EventCard
│   │   ├── pages/          # All 9 pages
│   │   ├── services/       # Firebase & Supabase integrations
│   │   ├── config/         # supabase.js config
│   │   └── firebase.js     # Firebase config
│   └── package.json
│
└── backend/
    ├── functions/          # Cloud Functions (NOT deployed)
    │   └── index.js       # 6 functions ready to deploy
    ├── firestore.rules    # ✅ DEPLOYED
    ├── firestore.indexes.json  # ✅ DEPLOYED
    └── firebase.json
```

## 🔧 Configuration Files

### Frontend Environment
Already configured in `frontend/src/firebase.js` and `frontend/src/config/supabase.js`

### Firebase Project
- Project ID: `mela-00000`
- Console: https://console.firebase.google.com/project/mela-00000
- Firestore location: asia-east2 (Hong Kong)

### Supabase Storage
- URL: https://poyikbsrlwilpeojeuaa.supabase.co
- Bucket: event-posters
- Public access enabled

## 🎯 Key Features Working

✅ User Authentication (Email + Google OAuth)  
✅ Event Feed with filtering by university & category  
✅ Event Submission with image upload to Supabase  
✅ Save/Unsave events  
✅ View saved events  
✅ Track your submissions  
✅ User profile management  
✅ Firestore security rules enforcing permissions  

## ⚙️ Moderator Approval (Manual Workaround)

Since Cloud Functions aren't deployed, moderators can approve events by:

1. Opening Firestore console
2. Finding the submission in `submissions` collection
3. Copying the submission data
4. Creating a new document in `events` collection
5. Updating the submission status to 'approved'

Or you can upgrade to Firebase Blaze plan (pay-as-you-go) and deploy functions:
```bash
cd backend
firebase deploy --only functions
```

## 📊 Firebase Pricing

**Spark Plan (Free - Current):**
- ✅ Firestore: 1GB storage, 50K reads/day
- ✅ Authentication: Unlimited
- ❌ Cloud Functions: Not available
- ❌ Storage: Not available (using Supabase instead)

**Blaze Plan (Pay-as-you-go):**
- Cloud Functions: 2M invocations/month free
- Storage: 5GB free
- More Firestore quota

## 🐛 Known Limitations

1. **No Cloud Functions**: Moderator approval requires manual Firestore edits
2. **Node Version Warning**: Functions specify Node 18, but you have Node 24 (not an issue since functions aren't deployed)
3. **No Real-time Updates**: Event feed doesn't auto-refresh when new events are approved

## 🔗 Useful Links

- Firebase Console: https://console.firebase.google.com/project/mela-00000
- Supabase Dashboard: https://supabase.com/dashboard/project/poyikbsrlwilpeojeuaa
- Backend Docs: See `backend/README.md` and `backend/FIRESTORE_SCHEMA.md`

## 💡 Next Steps

1. **Test the app** thoroughly
2. **Add moderators** manually in Firestore
3. **Consider upgrading** to Blaze plan for Cloud Functions
4. **Deploy frontend** to Firebase Hosting (free): `firebase init hosting` then `firebase deploy --only hosting`

---

**You're all set! 🚀 The app is ready to use!**

# 🚀 Mela Quick Start Guide

Get your Mela backend up and running in minutes!

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies ✅
```bash
# Backend
cd backend/functions
npm install

# Frontend
cd ../../frontend
npm install
```

### Step 2: Firebase Project Setup

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add Project"
   - Name it "Mela" (or your preferred name)
   - Disable Google Analytics (optional)

2. **Enable Services**
   - **Authentication**: Enable Email/Password and Google providers
   - **Firestore Database**: Create in production mode
   - **Storage**: Enable with default rules
   - **Functions**: Will be enabled automatically on first deploy

3. **Get Firebase Config**
   - Project Settings → General → Your apps
   - Click "Web" (</>) to add a web app
   - Copy the `firebaseConfig` object
   - Paste into `frontend/src/firebase.js`

### Step 3: Firebase CLI Setup
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (in backend directory)
cd backend
firebase init
```

**Select:**
- Firestore ✓
- Functions ✓
- Storage ✓
- Hosting (optional)

**Choose:**
- Use existing project → Select your Mela project
- Use default files (press Enter for all)
- Install dependencies: Yes

### Step 4: Deploy Backend
```bash
# Still in backend directory
firebase deploy
```

This deploys:
- ✅ Firestore security rules
- ✅ Firestore indexes
- ✅ Cloud Functions
- ✅ Storage rules

### Step 5: Run Frontend
```bash
cd ../frontend
npm run dev
```

Open http://localhost:5173 - You're live! 🎉

---

## 🔧 Common Issues & Fixes

### Issue: "Permission denied" errors in app
**Fix:** Deploy Firestore rules
```bash
cd backend
firebase deploy --only firestore:rules
```

### Issue: Functions not working
**Fix:** Check function logs
```bash
firebase functions:log
```

### Issue: Images not uploading
**Fix:** Deploy storage rules
```bash
firebase deploy --only storage
```

### Issue: "Module not found" errors
**Fix:** Reinstall dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next Steps

### 1. Create Your First Moderator

Since you can't approve events without a moderator:

1. **Sign up** through the app with your email
2. **Open Firestore** in Firebase Console
3. **Find your user** in the `users` collection
4. **Edit the document** and change:
   ```json
   {
     "role": "moderator",
     "moderatorFor": ["FAST NUCES"]
   }
   ```
5. **Refresh** the app - you now have moderator access!

### 2. Test the Full Flow

**As a Student:**
1. Go to `/submit`
2. Fill out event details
3. Upload a poster
4. Submit for review

**As a Moderator:**
1. Go to `/admin`
2. See your pending submission
3. Click "Approve"
4. Check `/events` - it's live!

### 3. Customize for Your Universities

Edit `frontend/src/utils/constants.js`:
```javascript
export const UNIVERSITIES = [
  'Your University',
  'Another University',
  'Add more here'
];
```

---

## 📚 File Locations Cheat Sheet

| What | Where |
|------|-------|
| Firebase config | `frontend/src/firebase.js` |
| Cloud Functions | `backend/functions/index.js` |
| Security rules | `backend/firestore.rules` |
| Storage rules | `backend/storage.rules` |
| Database schema | `backend/FIRESTORE_SCHEMA.md` |
| Service examples | `frontend/SERVICES_USAGE.md` |
| Backend guide | `backend/README.md` |

---

## 🔑 Key Firebase Console Links

After creating your project, bookmark these:

- **Firestore**: `console.firebase.google.com/project/YOUR_PROJECT/firestore`
- **Functions**: `console.firebase.google.com/project/YOUR_PROJECT/functions`
- **Storage**: `console.firebase.google.com/project/YOUR_PROJECT/storage`
- **Auth Users**: `console.firebase.google.com/project/YOUR_PROJECT/authentication/users`

Replace `YOUR_PROJECT` with your Firebase project ID.

---

## 🎨 Customizing the Design

All your brutalist colors are in `frontend/src/index.css`:

```css
:root {
  --mela-yellow: #FFD93D;
  --mela-pink: #FF6B9D;
  --mela-teal: #4ECDC4;
  /* Change these to your brand colors! */
}
```

---

## 💡 Pro Tips

1. **Local Development**: Use Firebase Emulators
   ```bash
   firebase emulators:start
   ```

2. **Free Tier Limits**: 
   - 50K Firestore reads/day
   - 20K writes/day
   - 125K function calls/month
   - Monitor in Firebase Console

3. **Deploy Only What Changed**:
   ```bash
   firebase deploy --only functions:approveEvent
   firebase deploy --only firestore:rules
   ```

4. **View Logs in Real-Time**:
   ```bash
   firebase functions:log --only approveEvent
   ```

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Firebase project created
- [ ] Config updated in `firebase.js`
- [ ] Backend deployed successfully
- [ ] Can create user account
- [ ] Can submit event (shows in Firestore → submissions)
- [ ] Created at least one moderator
- [ ] Moderator can approve events
- [ ] Approved events appear in feed
- [ ] Images upload successfully
- [ ] No errors in browser console
- [ ] No errors in function logs

---

## 🆘 Getting Help

1. **Backend Issues**: Check `backend/README.md`
2. **Service Usage**: See `frontend/SERVICES_USAGE.md`
3. **Database Schema**: Read `backend/FIRESTORE_SCHEMA.md`
4. **Firebase Docs**: https://firebase.google.com/docs
5. **Function Errors**: `firebase functions:log`

---

**You're all set! Happy building! 🎉**

Questions? Check the documentation files or Firebase Console logs.

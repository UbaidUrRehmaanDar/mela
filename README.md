# Mela - Campus Event Discovery Platform 🎉

A centralized web platform for discovering and managing university events across Lahore's academic institutions.

## 🚀 Project Overview

Mela solves the problem of fragmented event communication in universities by providing a single platform where:
- **Students** can discover events happening across multiple universities
- **Organizers** can submit events for review and reach a wider audience
- **Moderators** can verify and approve event submissions to maintain quality

## 📋 Features

### For Students
- ✅ Browse all approved events from multiple universities
- ✅ Filter events by university, category, and date
- ✅ Search events by title and description
- ✅ Save events and receive reminders
- ✅ View detailed event information with posters

### For Event Organizers
- ✅ Submit events with rich details and poster images
- ✅ Track submission status (pending, approved, rejected)
- ✅ Edit pending submissions
- ✅ View rejection feedback

### For Moderators
- ✅ Review pending event submissions
- ✅ Approve or reject events with feedback
- ✅ Edit approved events
- ✅ Manage events for assigned universities

## 🛠 Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **Vanilla CSS** - Styling (Brutalist design system)

### Backend
- **Firebase Firestore** - Database
- **Firebase Authentication** - User management
- **Firebase Storage** - Image hosting
- **Firebase Cloud Functions** - Business logic
- **Firebase Hosting** - Deployment

## 📁 Project Structure

```
Mela/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # Backend service modules
│   │   ├── utils/           # Utility functions & constants
│   │   ├── firebase.js      # Firebase configuration
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json
│   └── SERVICES_USAGE.md    # Service usage guide
│
├── backend/                  # Firebase backend
│   ├── functions/
│   │   ├── index.js         # Cloud Functions
│   │   └── package.json
│   ├── firestore.rules      # Security rules
│   ├── firestore.indexes.json
│   ├── storage.rules        # Storage security
│   ├── FIRESTORE_SCHEMA.md  # Database schema docs
│   └── README.md            # Backend setup guide
│
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Firebase CLI installed: `npm install -g firebase-tools`

### 1. Clone the Repository
```bash
cd Mela
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`

### 3. Backend Setup
```bash
cd backend/functions
npm install
```

#### Configure Firebase
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore, Authentication, Storage, and Functions
3. Update `frontend/src/firebase.js` with your Firebase config
4. Login to Firebase CLI: `firebase login`
5. Initialize Firebase in backend directory: `firebase init`

#### Deploy Backend
```bash
cd backend
firebase deploy
```

Or deploy specific components:
```bash
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 🔐 Security & Roles

### User Roles
- **Student** (default): Can browse events and save favorites
- **Moderator**: Can review and approve/reject submissions for assigned universities
- **Admin**: Full access to manage users and roles

### Creating Moderators
1. User creates an account through the app
2. Admin manually updates their role in Firestore Console:
   ```json
   {
     "role": "moderator",
     "moderatorFor": ["FAST NUCES", "LUMS"]
   }
   ```

## 📚 Database Collections

### Collections Structure
- **users** - User profiles and roles
- **events** - Approved events (public)
- **submissions** - Pending event submissions
- **savedEvents** - User's saved events

See `backend/FIRESTORE_SCHEMA.md` for detailed schema documentation.

## 🔥 Firebase Services Used

### Firestore Database
- Event and user data storage
- Role-based security rules
- Composite indexes for efficient querying

### Authentication
- Email/Password authentication
- Google OAuth
- User profile management

### Cloud Functions
- `approveEvent` - Approve pending submissions
- `rejectEvent` - Reject submissions with feedback
- `checkModeratorStatus` - Verify moderator permissions
- `createUserProfile` - Auto-create profile on signup
- `sendEventReminders` - Scheduled reminders (planned)

### Storage
- Event poster image uploads
- 5MB max file size
- Image type validation

## 🎨 Design System

Mela uses a **Brutalist** design aesthetic:
- Bold, colorful blocks
- Thick black borders
- High contrast
- Playful typography
- Hand-drawn feel

### Color Palette
```css
--mela-yellow: #FFD93D
--mela-pink: #FF6B9D
--mela-teal: #4ECDC4
--mela-orange: #FF8C42
--mela-purple: #9D4EDD
--mela-blue: #3772FF
```

## 📖 Usage Examples

### Submitting an Event
```javascript
import { submitEvent } from './services';
import { Timestamp } from 'firebase/firestore';

const eventData = {
  title: 'AI Workshop 2026',
  description: 'Learn AI fundamentals',
  dateTime: Timestamp.fromDate(new Date('2026-11-15T14:00')),
  university: 'FAST NUCES',
  category: 'Workshop',
  venue: 'Main Auditorium'
};

const result = await submitEvent(eventData, posterFile);
if (result.success) {
  console.log('Event submitted!');
}
```

### Fetching Events
```javascript
import { getFilteredEvents } from './services';

const events = await getFilteredEvents({
  university: 'FAST NUCES',
  category: 'Tech',
  upcomingOnly: true
});
```

### Moderator Actions
```javascript
import { approveEvent, rejectEvent } from './services';

// Approve
await approveEvent(submissionId);

// Reject with feedback
await rejectEvent(submissionId, 'Incomplete information');
```

See `frontend/SERVICES_USAGE.md` for complete API documentation.

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run lint
```

### Backend Functions (Local Emulator)
```bash
cd backend/functions
npm run serve
```

## 🚢 Deployment

### Frontend (Firebase Hosting)
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend
```bash
cd backend
firebase deploy --only functions,firestore,storage
```

## 📊 Monitoring

### View Function Logs
```bash
firebase functions:log
```

### Firebase Console
- Performance monitoring
- Usage analytics
- Error tracking
- User metrics

Visit: https://console.firebase.google.com

## 🛣 Roadmap

### Phase 1: CS Departments (Current)
- ✅ Core event discovery and submission
- ✅ Moderator approval system
- ✅ Basic filtering and search

### Phase 2: All Faculties
- Multi-department expansion
- Enhanced search with Algolia
- Advanced filtering

### Phase 3: Mobile & Features
- Mobile app (React Native)
- Push notifications
- Event analytics
- User recommendations
- Public events beyond universities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is part of an academic initiative for improving campus event discovery.

## 👤 Author

**Ubaid Ur Rehman Dar**
- Lead Developer
- Computer Science Student

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- React community for excellent tools
- University communities for feedback

## 📞 Support

For questions or issues:
1. Check documentation in `SERVICES_USAGE.md` and `backend/README.md`
2. Review Firebase Console for errors
3. Check Cloud Function logs

---

**Made with ❤️ for the campus community**

# Mela Frontend Services - Usage Guide

## Overview
This guide shows how to use the Mela backend services in your React components.

## Services Available

- **authService**: User authentication (login, signup, Google auth)
- **eventService**: Fetch and search events
- **submissionService**: Submit events for moderation
- **moderatorService**: Moderate event submissions
- **userService**: User profiles and saved events

---

## Authentication Service

### Sign Up with Email
```javascript
import { signUp } from '../services';

const handleSignUp = async () => {
  const result = await signUp(
    'user@example.com',
    'password123',
    'John Doe',
    'FAST NUCES'
  );
  
  if (result.success) {
    console.log('User created:', result.user);
  } else {
    console.error('Error:', result.error);
  }
};
```

### Sign In with Email
```javascript
import { signIn } from '../services';

const handleSignIn = async () => {
  const result = await signIn('user@example.com', 'password123');
  
  if (result.success) {
    console.log('Signed in:', result.user);
  } else {
    console.error('Error:', result.error);
  }
};
```

### Sign In with Google
```javascript
import { signInWithGoogle } from '../services';

const handleGoogleSignIn = async () => {
  const result = await signInWithGoogle();
  
  if (result.success) {
    console.log('Signed in with Google:', result.user);
  } else {
    console.error('Error:', result.error);
  }
};
```

### Listen to Auth Changes
```javascript
import { onAuthChange } from '../services';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      setUser(currentUser);
    });
    
    return () => unsubscribe();
  }, []);
  
  return <div>{user ? `Hello ${user.displayName}` : 'Not logged in'}</div>;
}
```

### Log Out
```javascript
import { logOut } from '../services';

const handleLogOut = async () => {
  const result = await logOut();
  if (result.success) {
    console.log('Logged out successfully');
  }
};
```

---

## Event Service

### Get All Events
```javascript
import { getAllEvents } from '../services';
import { useEffect, useState } from 'react';

function EventFeed() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      const result = await getAllEvents();
      if (result.success) {
        setEvents(result.events);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <div>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.title}</h3>
          <p>{event.university} - {event.category}</p>
        </div>
      ))}
    </div>
  );
}
```

### Filter Events by University
```javascript
import { getEventsByUniversity } from '../services';

const fetchFASTEvents = async () => {
  const result = await getEventsByUniversity('FAST NUCES');
  if (result.success) {
    console.log('FAST events:', result.events);
  }
};
```

### Filter Events by Category
```javascript
import { getEventsByCategory } from '../services';

const fetchTechEvents = async () => {
  const result = await getEventsByCategory('Tech');
  if (result.success) {
    console.log('Tech events:', result.events);
  }
};
```

### Get Upcoming Events Only
```javascript
import { getUpcomingEvents } from '../services';

const fetchUpcoming = async () => {
  const result = await getUpcomingEvents();
  if (result.success) {
    console.log('Upcoming events:', result.events);
  }
};
```

### Advanced Filtering
```javascript
import { getFilteredEvents } from '../services';

const fetchFiltered = async () => {
  const result = await getFilteredEvents({
    university: 'FAST NUCES',
    category: 'Tech',
    upcomingOnly: true
  });
  
  if (result.success) {
    console.log('Filtered events:', result.events);
  }
};
```

### Search Events
```javascript
import { searchEvents } from '../services';

const handleSearch = async (searchTerm) => {
  const result = await searchEvents(searchTerm);
  if (result.success) {
    console.log('Search results:', result.events);
  }
};
```

### Get Single Event
```javascript
import { getEventById } from '../services';

const fetchEventDetails = async (eventId) => {
  const result = await getEventById(eventId);
  if (result.success) {
    console.log('Event details:', result.event);
  }
};
```

---

## Submission Service

### Submit an Event
```javascript
import { submitEvent } from '../services';
import { Timestamp } from 'firebase/firestore';

const handleSubmit = async (formData, posterFile) => {
  const eventData = {
    title: formData.title,
    description: formData.description,
    dateTime: Timestamp.fromDate(new Date(formData.dateTime)),
    university: formData.university,
    category: formData.category,
    venue: formData.venue
  };
  
  const result = await submitEvent(eventData, posterFile);
  
  if (result.success) {
    console.log('Event submitted:', result.submissionId);
  } else {
    console.error('Error:', result.error);
  }
};
```

### Get My Submissions
```javascript
import { getMySubmissions } from '../services';

const fetchMySubmissions = async () => {
  const result = await getMySubmissions();
  if (result.success) {
    console.log('My submissions:', result.submissions);
  }
};
```

### Update a Submission
```javascript
import { updateSubmission } from '../services';

const handleUpdate = async (submissionId, updates, newPosterFile) => {
  const result = await updateSubmission(submissionId, updates, newPosterFile);
  
  if (result.success) {
    console.log('Submission updated');
  }
};
```

### Delete a Rejected Submission
```javascript
import { deleteSubmission } from '../services';

const handleDelete = async (submissionId) => {
  const result = await deleteSubmission(submissionId);
  if (result.success) {
    console.log('Submission deleted');
  }
};
```

---

## Moderator Service

### Check Moderator Status
```javascript
import { checkModeratorStatus } from '../services';

const checkStatus = async () => {
  const result = await checkModeratorStatus();
  
  if (result.success && result.isModerator) {
    console.log('Moderator for:', result.universities);
  }
};
```

### Get Pending Submissions
```javascript
import { getPendingSubmissions } from '../services';

function ModeratorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [universities, setUniversities] = useState([]);
  
  useEffect(() => {
    const fetchPending = async () => {
      // First check moderator status
      const statusResult = await checkModeratorStatus();
      if (statusResult.isModerator) {
        setUniversities(statusResult.universities);
        
        // Get pending submissions
        const result = await getPendingSubmissions(statusResult.universities);
        if (result.success) {
          setSubmissions(result.submissions);
        }
      }
    };
    
    fetchPending();
  }, []);
  
  return <div>{/* Render submissions */}</div>;
}
```

### Approve Event
```javascript
import { approveEvent } from '../services';

const handleApprove = async (submissionId) => {
  const result = await approveEvent(submissionId);
  
  if (result.success) {
    console.log('Event approved!');
    // Refresh submissions list
  } else {
    console.error('Error:', result.error);
  }
};
```

### Reject Event
```javascript
import { rejectEvent } from '../services';

const handleReject = async (submissionId, reason) => {
  const result = await rejectEvent(submissionId, reason);
  
  if (result.success) {
    console.log('Event rejected');
    // Refresh submissions list
  }
};
```

### Edit Approved Event
```javascript
import { editEvent } from '../services';

const handleEdit = async (eventId, updates) => {
  const result = await editEvent(eventId, {
    title: 'Updated Title',
    description: 'Updated description'
  });
  
  if (result.success) {
    console.log('Event updated');
  }
};
```

---

## User Service

### Get User Profile
```javascript
import { getUserProfile } from '../services';

const fetchProfile = async (userId) => {
  const result = await getUserProfile(userId);
  if (result.success) {
    console.log('User profile:', result.user);
  }
};
```

### Update Profile
```javascript
import { updateUserProfile } from '../services';

const handleProfileUpdate = async (userId, updates) => {
  const result = await updateUserProfile(userId, {
    displayName: 'New Name',
    university: 'LUMS'
  });
  
  if (result.success) {
    console.log('Profile updated');
  }
};
```

### Save an Event
```javascript
import { saveEvent } from '../services';

const handleSave = async (event) => {
  const result = await saveEvent(
    event.id,
    event.title,
    event.dateTime
  );
  
  if (result.success) {
    console.log('Event saved!');
  } else {
    console.error('Error:', result.error);
  }
};
```

### Unsave an Event
```javascript
import { unsaveEvent } from '../services';

const handleUnsave = async (eventId) => {
  const result = await unsaveEvent(eventId);
  if (result.success) {
    console.log('Event removed from saved');
  }
};
```

### Get Saved Events
```javascript
import { getSavedEvents } from '../services';

function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState([]);
  
  useEffect(() => {
    const fetchSaved = async () => {
      const result = await getSavedEvents();
      if (result.success) {
        setSavedEvents(result.savedEvents);
      }
    };
    
    fetchSaved();
  }, []);
  
  return <div>{/* Render saved events */}</div>;
}
```

### Check if Event is Saved
```javascript
import { isEventSaved } from '../services';

const checkSaved = async (eventId) => {
  const result = await isEventSaved(eventId);
  if (result.success) {
    console.log('Is saved:', result.isSaved);
  }
};
```

---

## Complete Example: Event Feed with Filter

```javascript
import React, { useState, useEffect } from 'react';
import { getFilteredEvents, saveEvent, isEventSaved } from '../services';

function EventFeed() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({
    university: '',
    category: '',
    upcomingOnly: true
  });
  const [savedEventIds, setSavedEventIds] = useState(new Set());

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    const result = await getFilteredEvents(filters);
    if (result.success) {
      setEvents(result.events);
      
      // Check which events are saved
      const savedIds = new Set();
      for (const event of result.events) {
        const savedResult = await isEventSaved(event.id);
        if (savedResult.isSaved) {
          savedIds.add(event.id);
        }
      }
      setSavedEventIds(savedIds);
    }
  };

  const handleSaveEvent = async (event) => {
    const result = await saveEvent(event.id, event.title, event.dateTime);
    if (result.success) {
      setSavedEventIds(prev => new Set([...prev, event.id]));
    }
  };

  return (
    <div>
      <div>
        <select onChange={(e) => setFilters({...filters, university: e.target.value})}>
          <option value="">All Universities</option>
          <option value="FAST NUCES">FAST NUCES</option>
          <option value="LUMS">LUMS</option>
          <option value="PUCIT">PUCIT</option>
        </select>
        
        <select onChange={(e) => setFilters({...filters, category: e.target.value})}>
          <option value="">All Categories</option>
          <option value="Tech">Tech</option>
          <option value="Workshop">Workshop</option>
          <option value="Seminar">Seminar</option>
        </select>
      </div>

      <div>
        {events.map(event => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.university} - {event.category}</p>
            <p>{event.dateTime.toLocaleDateString()}</p>
            <button onClick={() => handleSaveEvent(event)}>
              {savedEventIds.has(event.id) ? 'Saved ✓' : 'Save Event'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventFeed;
```

---

## Error Handling Best Practices

Always check the `success` property in results:

```javascript
const result = await someService();

if (result.success) {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
  // Show user-friendly error message
  alert(result.error);
}
```

---

## Constants for Categories and Universities

Create a constants file for reusability:

```javascript
// src/constants/index.js
export const UNIVERSITIES = [
  'FAST NUCES',
  'LUMS',
  'PUCIT',
  'UET',
  'Other'
];

export const CATEGORIES = [
  'Tech',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Meetup',
  'Other'
];
```

Use in components:
```javascript
import { UNIVERSITIES, CATEGORIES } from '../constants';

<select>
  {UNIVERSITIES.map(uni => (
    <option key={uni} value={uni}>{uni}</option>
  ))}
</select>
```

---

## Tips

1. **Always handle loading states** while fetching data
2. **Check authentication** before calling protected services
3. **Use try-catch** for additional error handling
4. **Validate form data** before submitting
5. **Show user feedback** (success/error messages)
6. **Refresh data** after mutations (create, update, delete)

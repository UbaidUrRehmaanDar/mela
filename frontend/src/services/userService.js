// User Service for Mela
import { 
  doc, 
  getDoc,
  updateDoc, 
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User not found', user: null };
    }

    return { 
      success: true, 
      user: { id: userDoc.id, ...userDoc.data() } 
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: error.message, user: null };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user || user.uid !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Prevent updating role and moderatorFor (security)
    const allowedUpdates = {
      displayName: updates.displayName,
      university: updates.university,
      photoURL: updates.photoURL,
      updatedAt: serverTimestamp()
    };

    // Remove undefined values
    Object.keys(allowedUpdates).forEach(key => 
      allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    await updateDoc(doc(db, 'users', userId), allowedUpdates);

    return { success: true, message: 'Profile updated successfully' };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save an event for the current user
 */
export const saveEvent = async (eventId, eventTitle, eventDateTime) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if already saved
    const savedEventsRef = collection(db, 'savedEvents');
    const q = query(
      savedEventsRef,
      where('userId', '==', user.uid),
      where('eventId', '==', eventId)
    );
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      return { success: false, error: 'Event already saved' };
    }

    // Convert JS Date to Firestore Timestamp if needed
    const timestamp = eventDateTime instanceof Date 
      ? Timestamp.fromDate(eventDateTime) 
      : eventDateTime;

    // Save event
    await addDoc(savedEventsRef, {
      userId: user.uid,
      eventId: eventId,
      eventTitle: eventTitle,
      eventDateTime: timestamp,
      reminderSent: false,
      createdAt: serverTimestamp()
    });

    return { success: true, message: 'Event saved successfully' };
  } catch (error) {
    console.error('Error saving event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unsave an event
 */
export const unsaveEvent = async (eventId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Find saved event
    const savedEventsRef = collection(db, 'savedEvents');
    const q = query(
      savedEventsRef,
      where('userId', '==', user.uid),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Event not found in saved events' };
    }

    // Delete saved event
    await deleteDoc(querySnapshot.docs[0].ref);

    return { success: true, message: 'Event removed from saved events' };
  } catch (error) {
    console.error('Error unsaving event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all saved events for current user
 */
export const getSavedEvents = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated', savedEvents: [] };
    }

    const savedEventsRef = collection(db, 'savedEvents');
    const q = query(
      savedEventsRef,
      where('userId', '==', user.uid)
    );
    const querySnapshot = await getDocs(q);

    const savedEvents = [];
    querySnapshot.forEach((doc) => {
      savedEvents.push({
        id: doc.id,
        ...doc.data(),
        eventDateTime: doc.data().eventDateTime?.toDate()
      });
    });

    // Sort by event date
    savedEvents.sort((a, b) => a.eventDateTime - b.eventDateTime);

    return { success: true, savedEvents };
  } catch (error) {
    console.error('Error fetching saved events:', error);
    return { success: false, error: error.message, savedEvents: [] };
  }
};

/**
 * Check if an event is saved by current user
 */
export const isEventSaved = async (eventId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: true, isSaved: false };
    }

    const savedEventsRef = collection(db, 'savedEvents');
    const q = query(
      savedEventsRef,
      where('userId', '==', user.uid),
      where('eventId', '==', eventId)
    );
    const querySnapshot = await getDocs(q);

    return { success: true, isSaved: !querySnapshot.empty };
  } catch (error) {
    console.error('Error checking if event is saved:', error);
    return { success: false, error: error.message, isSaved: false };
  }
};

/**
 * Get upcoming saved events (for reminders)
 */
export const getUpcomingSavedEvents = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated', savedEvents: [] };
    }

    const now = Timestamp.now();
    const savedEventsRef = collection(db, 'savedEvents');
    const q = query(
      savedEventsRef,
      where('userId', '==', user.uid),
      where('eventDateTime', '>', now)
    );
    const querySnapshot = await getDocs(q);

    const savedEvents = [];
    querySnapshot.forEach((doc) => {
      savedEvents.push({
        id: doc.id,
        ...doc.data(),
        eventDateTime: doc.data().eventDateTime?.toDate()
      });
    });

    // Sort by event date (soonest first)
    savedEvents.sort((a, b) => a.eventDateTime - b.eventDateTime);

    return { success: true, savedEvents };
  } catch (error) {
    console.error('Error fetching upcoming saved events:', error);
    return { success: false, error: error.message, savedEvents: [] };
  }
};

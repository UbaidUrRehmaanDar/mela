// Moderator Service for Mela
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../firebase';

const functions = getFunctions();

/**
 * Check if current user is a moderator
 */
export const checkModeratorStatus = async () => {
  try {
    const checkStatus = httpsCallable(functions, 'checkModeratorStatus');
    const result = await checkStatus();
    return { 
      success: true, 
      ...result.data 
    };
  } catch (error) {
    console.error('Error checking moderator status:', error);
    return { 
      success: false, 
      isModerator: false, 
      universities: [],
      error: error.message 
    };
  }
};

/**
 * Get pending submissions for moderator's universities
 */
export const getPendingSubmissions = async (universities) => {
  try {
    if (!universities || universities.length === 0) {
      return { success: true, submissions: [] };
    }

    const submissionsRef = collection(db, 'submissions');
    const q = query(
      submissionsRef,
      where('university', 'in', universities),
      where('status', '==', 'pending')
    );
    
    const querySnapshot = await getDocs(q);
    
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate()
      });
    });

    // Sort by creation date (newest first)
    submissions.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

    return { success: true, submissions };
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    return { success: false, error: error.message, submissions: [] };
  }
};

/**
 * Get all submissions (pending and rejected) for moderator's universities
 */
export const getAllSubmissions = async (universities) => {
  try {
    if (!universities || universities.length === 0) {
      return { success: true, submissions: [] };
    }

    const submissionsRef = collection(db, 'submissions');
    const q = query(
      submissionsRef,
      where('university', 'in', universities)
    );
    
    const querySnapshot = await getDocs(q);
    
    const submissions = [];
    querySnapshot.forEach((doc) => {
      submissions.push({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate()
      });
    });

    // Sort by creation date (newest first)
    submissions.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

    return { success: true, submissions };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: error.message, submissions: [] };
  }
};

/**
 * Approve an event submission
 */
export const approveEvent = async (submissionId) => {
  try {
    const approveEventFn = httpsCallable(functions, 'approveEvent');
    const result = await approveEventFn({ submissionId });
    
    return { 
      success: true, 
      message: result.data.message 
    };
  } catch (error) {
    console.error('Error approving event:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to approve event' 
    };
  }
};

/**
 * Reject an event submission
 */
export const rejectEvent = async (submissionId, reason) => {
  try {
    const rejectEventFn = httpsCallable(functions, 'rejectEvent');
    const result = await rejectEventFn({ 
      submissionId, 
      reason: reason || 'No reason provided' 
    });
    
    return { 
      success: true, 
      message: result.data.message 
    };
  } catch (error) {
    console.error('Error rejecting event:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to reject event' 
    };
  }
};

/**
 * Edit an approved event (moderators only)
 */
export const editEvent = async (eventId, updates) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    
    await updateDoc(eventRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { 
      success: true, 
      message: 'Event updated successfully' 
    };
  } catch (error) {
    console.error('Error editing event:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get approved events for moderator's universities
 */
export const getModeratedEvents = async (universities) => {
  try {
    if (!universities || universities.length === 0) {
      return { success: true, events: [] };
    }

    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('university', 'in', universities)
    );
    
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate()
      });
    });

    // Sort by date (newest first)
    events.sort((a, b) => b.dateTime - a.dateTime);

    return { success: true, events };
  } catch (error) {
    console.error('Error fetching moderated events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

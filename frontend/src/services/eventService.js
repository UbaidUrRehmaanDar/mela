// Event Service for Mela
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  doc,
  Timestamp,
  limit,
  startAfter
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Fetch all approved events
 */
export const getAllEvents = async () => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('dateTime', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate() // Convert Firestore timestamp to JS Date
      });
    });
    
    return { success: true, events };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Fetch events by university
 */
export const getEventsByUniversity = async (university) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef, 
      where('university', '==', university),
      orderBy('dateTime', 'desc')
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
    
    return { success: true, events };
  } catch (error) {
    console.error('Error fetching events by university:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Fetch events by category
 */
export const getEventsByCategory = async (category) => {
  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('category', '==', category),
      orderBy('dateTime', 'desc')
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
    
    return { success: true, events };
  } catch (error) {
    console.error('Error fetching events by category:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Fetch upcoming events (events happening after now)
 */
export const getUpcomingEvents = async () => {
  try {
    const now = Timestamp.now();
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('dateTime', '>', now),
      orderBy('dateTime', 'asc')
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
    
    return { success: true, events };
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Fetch events with filters
 */
export const getFilteredEvents = async (filters = {}) => {
  try {
    const eventsRef = collection(db, 'events');
    let constraints = [orderBy('dateTime', 'desc')];
    
    if (filters.university) {
      constraints.unshift(where('university', '==', filters.university));
    }
    
    if (filters.category) {
      constraints.unshift(where('category', '==', filters.category));
    }
    
    if (filters.upcomingOnly) {
      constraints.unshift(where('dateTime', '>', Timestamp.now()));
      constraints = [orderBy('dateTime', 'asc')]; // Change order for upcoming
    }
    
    const q = query(eventsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        dateTime: doc.data().dateTime?.toDate()
      });
    });
    
    return { success: true, events };
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId) => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    
    if (!eventDoc.exists()) {
      return { success: false, error: 'Event not found', event: null };
    }
    
    const event = {
      id: eventDoc.id,
      ...eventDoc.data(),
      dateTime: eventDoc.data().dateTime?.toDate()
    };
    
    return { success: true, event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { success: false, error: error.message, event: null };
  }
};

/**
 * Search events by title or description
 */
export const searchEvents = async (searchTerm) => {
  try {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider using Algolia or similar
    const eventsRef = collection(db, 'events');
    const querySnapshot = await getDocs(eventsRef);
    
    const events = [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const title = (data.title || '').toLowerCase();
      const description = (data.description || '').toLowerCase();
      
      if (title.includes(lowerSearchTerm) || description.includes(lowerSearchTerm)) {
        events.push({
          id: doc.id,
          ...data,
          dateTime: data.dateTime?.toDate()
        });
      }
    });
    
    // Sort by date
    events.sort((a, b) => b.dateTime - a.dateTime);
    
    return { success: true, events };
  } catch (error) {
    console.error('Error searching events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

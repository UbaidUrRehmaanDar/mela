// Submission Service for Mela
import { 
  collection, 
  addDoc, 
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { supabase, STORAGE_BUCKET } from '../config/supabase';

/**
 * Submit a new event for moderation
 */
export const submitEvent = async (eventData, posterFile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'You must be logged in to submit events' };
    }

    // First, create the submission document
    const submissionData = {
      title: eventData.title,
      description: eventData.description,
      dateTime: eventData.dateTime, // Should be a Firestore Timestamp
      university: eventData.university,
      category: eventData.category,
      venue: eventData.venue || '',
      posterURL: '', // Will be updated after upload
      organizerEmail: user.email,
      organizerId: user.uid,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const submissionRef = await addDoc(collection(db, 'submissions'), submissionData);
    const submissionId = submissionRef.id;

    // Upload poster image if provided
    if (posterFile) {
      const posterURL = await uploadEventPoster(submissionId, posterFile);
      
      // Update submission with poster URL
      await updateDoc(submissionRef, {
        posterURL: posterURL,
        updatedAt: serverTimestamp()
      });
    }

    return { 
      success: true, 
      submissionId,
      message: 'Event submitted successfully and is awaiting moderation' 
    };
  } catch (error) {
    console.error('Error submitting event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Upload event poster to Supabase Storage
 */
export const uploadEventPoster = async (eventId, file) => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading poster:', error);
    throw error;
  }
};

/**
 * Get user's own submissions
 */
export const getMySubmissions = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated', submissions: [] };
    }

    const submissionsRef = collection(db, 'submissions');
    const q = query(
      submissionsRef,
      where('organizerId', '==', user.uid)
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

    // Sort by creation date
    submissions.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate());

    return { success: true, submissions };
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return { success: false, error: error.message, submissions: [] };
  }
};

/**
 * Update a pending submission
 */
export const updateSubmission = async (submissionId, updates, newPosterFile) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership
    const submissionDoc = await getDoc(doc(db, 'submissions', submissionId));
    if (!submissionDoc.exists()) {
      return { success: false, error: 'Submission not found' };
    }

    if (submissionDoc.data().organizerId !== user.uid) {
      return { success: false, error: 'Unauthorized' };
    }

    if (submissionDoc.data().status !== 'pending') {
      return { success: false, error: 'Cannot update non-pending submissions' };
    }

    // Upload new poster if provided
    if (newPosterFile) {
      const posterURL = await uploadEventPoster(submissionId, newPosterFile);
      updates.posterURL = posterURL;
    }

    // Update submission
    await updateDoc(doc(db, 'submissions', submissionId), {
      ...updates,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: 'Submission updated successfully' };
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a rejected submission
 */
export const deleteSubmission = async (submissionId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify ownership and status
    const submissionDoc = await getDoc(doc(db, 'submissions', submissionId));
    if (!submissionDoc.exists()) {
      return { success: false, error: 'Submission not found' };
    }

    const data = submissionDoc.data();
    if (data.organizerId !== user.uid) {
      return { success: false, error: 'Unauthorized' };
    }

    if (data.status !== 'rejected') {
      return { success: false, error: 'Can only delete rejected submissions' };
    }

    // Note: Cloudinary images can be deleted via API if needed
    // For now, we'll leave them (they're cheap and can be managed in Cloudinary dashboard)

    // Delete submission document
    await deleteDoc(doc(db, 'submissions', submissionId));

    return { success: true, message: 'Submission deleted successfully' };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get submission by ID
 */
export const getSubmissionById = async (submissionId) => {
  try {
    const submissionDoc = await getDoc(doc(db, 'submissions', submissionId));
    
    if (!submissionDoc.exists()) {
      return { success: false, error: 'Submission not found', submission: null };
    }

    const submission = {
      id: submissionDoc.id,
      ...submissionDoc.data(),
      dateTime: submissionDoc.data().dateTime?.toDate()
    };

    return { success: true, submission };
  } catch (error) {
    console.error('Error fetching submission:', error);
    return { success: false, error: error.message, submission: null };
  }
};

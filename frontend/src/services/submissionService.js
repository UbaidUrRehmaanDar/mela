// Submission Service for Mela (Supabase)
import { supabase, STORAGE_BUCKET } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Submit a new event for moderation
 */
export const submitEvent = async (eventData, posterFile) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to submit events' };
    }

    const submissionData = {
      title: eventData.title,
      description: eventData.description,
      date_time: eventData.dateTime instanceof Date
        ? eventData.dateTime.toISOString()
        : new Date(eventData.dateTime).toISOString(),
      university: eventData.university,
      category: eventData.category,
      venue: eventData.venue || '',
      event_url: eventData.eventURL || '',
      poster_url: '',
      organizer_email: user.email,
      organizer_id: user.id,
      status: 'pending',
    };

    console.log('Inserting submission:', submissionData);

    const { data: inserted, error } = await supabase
      .from('submissions')
      .insert(submissionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    console.log('Submission inserted:', inserted?.id);

    const submissionId = inserted.id;

    if (posterFile) {
      try {
        const posterURL = await uploadEventPoster(submissionId, posterFile);
        await supabase
          .from('submissions')
          .update({ poster_url: posterURL })
          .eq('id', submissionId);
      } catch (uploadErr) {
        console.warn('Poster upload failed, submitting without poster:', uploadErr.message);
      }
    }

    return {
      success: true,
      submissionId,
      message: 'Event submitted successfully and is awaiting moderation',
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
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    const fileExtension = file.name.split('.').pop();
    const filePath = `${eventId}/poster.${fileExtension}`;

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true });

    if (error) throw error;

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
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', submissions: [] };
    }

    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const submissions = (data || []).map((s) => ({
      ...s,
      dateTime: s.date_time ? new Date(s.date_time) : null,
      createdAt: s.created_at ? new Date(s.created_at) : null,
    }));

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
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: sub, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !sub) {
      return { success: false, error: 'Submission not found' };
    }

    if (sub.organizer_id !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    if (sub.status !== 'pending') {
      return { success: false, error: 'Cannot update non-pending submissions' };
    }

    if (newPosterFile) {
      updates.poster_url = await uploadEventPoster(submissionId, newPosterFile);
    }

    const dbUpdates = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.dateTime !== undefined) {
      dbUpdates.date_time = updates.dateTime instanceof Date
        ? updates.dateTime.toISOString()
        : new Date(updates.dateTime).toISOString();
    }
    if (updates.university !== undefined) dbUpdates.university = updates.university;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.venue !== undefined) dbUpdates.venue = updates.venue;
    if (updates.eventURL !== undefined) dbUpdates.event_url = updates.eventURL;
    if (updates.poster_url !== undefined) dbUpdates.poster_url = updates.poster_url;

    const { error: updateError } = await supabase
      .from('submissions')
      .update(dbUpdates)
      .eq('id', submissionId);

    if (updateError) throw updateError;

    return { success: true, message: 'Submission updated successfully' };
  } catch (error) {
    console.error('Error updating submission:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a pending or rejected submission (owner only)
 */
export const deleteSubmission = async (submissionId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // First fetch to get poster URL and validate ownership + status
    const { data: sub, error: fetchError } = await supabase
      .from('submissions')
      .select('organizer_id, status, poster_url')
      .eq('id', submissionId)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { success: false, error: 'Submission not found or access denied' };
    }

    if (!sub) {
      return { success: false, error: 'Submission not found' };
    }

    if (sub.organizer_id !== user.id) {
      return { success: false, error: 'Unauthorized — you do not own this submission' };
    }

    if (sub.status !== 'rejected' && sub.status !== 'pending') {
      return { success: false, error: 'Can only delete pending or rejected submissions' };
    }

    // Delete poster from storage (non-fatal)
    if (sub.poster_url) {
      try {
        const parts = sub.poster_url.split(`/public/${STORAGE_BUCKET}/`);
        const filePath = parts.length > 1 ? parts[1] : null;
        if (filePath) {
          await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
        }
      } catch (err) {
        console.warn('Could not delete poster:', err);
      }
    }

    // Delete the submission row — include organizer_id filter as extra safety
    const { error: deleteError, data: deleted } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId)
      .eq('organizer_id', user.id)
      .select('id');

    if (deleteError) {
      console.error('Delete error:', deleteError);
      throw deleteError;
    }

    if (!deleted || deleted.length === 0) {
      // RLS blocked it silently
      return { success: false, error: 'Delete was blocked — check Supabase RLS policies for the submissions table' };
    }

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
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Submission not found', submission: null };
    }

    const submission = {
      ...data,
      dateTime: data.date_time ? new Date(data.date_time) : null,
      createdAt: data.created_at ? new Date(data.created_at) : null,
    };

    return { success: true, submission };
  } catch (error) {
    console.error('Error fetching submission:', error);
    return { success: false, error: error.message, submission: null };
  }
};

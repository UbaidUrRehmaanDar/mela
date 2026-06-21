// Moderator Service for Mela (Supabase)
import { supabase } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Check if current user is a moderator or admin
 */
export const checkModeratorStatus = async () => {
  try {
    const currentUser = await getAuthUser();
    if (!currentUser) {
      return { success: true, isModerator: false, universities: [], university: '' };
    }

    const { data, error } = await supabase
      .from('users')
      .select('role, moderator_for, university')
      .eq('id', currentUser.id)
      .single();

    if (error || !data) {
      return { success: true, isModerator: false, universities: [], university: '' };
    }

    // Admins can moderate everything — signal with a sentinel value
    if (data.role === 'admin') {
      return {
        success: true,
        isModerator: true,
        isAdmin: true,
        universities: [],        // empty = fetch ALL universities
        university: data.university || '',
      };
    }

    return {
      success: true,
      isModerator: data.role === 'moderator',
      isAdmin: false,
      universities: data.moderator_for || [],
      university: data.university || '',
    };
  } catch (error) {
    console.error('Error checking moderator status:', error);
    return { success: false, isModerator: false, universities: [], error: error.message };
  }
};

/**
 * Get pending submissions.
 * Pass an empty array for universities to fetch ALL (admin use).
 */
export const getPendingSubmissions = async (universities) => {
  try {
    let query = supabase
      .from('submissions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    // Non-empty array = moderator scoped to specific universities
    if (universities && universities.length > 0) {
      query = query.in('university', universities);
    }
    // Empty array = admin, no university filter → fetch all

    const { data, error } = await query;
    if (error) throw error;

    const submissions = (data || []).map((s) => ({
      ...s,
      dateTime: s.date_time ? new Date(s.date_time) : null,
      createdAt: s.created_at ? new Date(s.created_at) : null,
    }));

    return { success: true, submissions };
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    return { success: false, error: error.message, submissions: [] };
  }
};

/**
 * Approve an event submission
 * Uses the approve_event RPC function for transactional safety
 */
export const approveEvent = async (submissionId) => {
  try {
    const currentUser = await getAuthUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }

    const { error } = await supabase.rpc('approve_event', {
      submission_id: submissionId,
      approver_id: currentUser.id,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Event approved successfully.',
    };
  } catch (error) {
    console.error('Error approving event:', error);
    return {
      success: false,
      error: error.message || 'Failed to approve event',
    };
  }
};

/**
 * Reject an event submission
 */
export const rejectEvent = async (submissionId, reason) => {
  try {
    const currentUser = await getAuthUser();
    if (!currentUser) {
      return { success: false, error: 'Not authenticated.' };
    }

    const { data: sub } = await supabase
      .from('submissions')
      .select('university')
      .eq('id', submissionId)
      .single();

    if (!sub) {
      return { success: false, error: 'Submission not found.' };
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, moderator_for')
      .eq('id', currentUser.id)
      .single();

    const isMod = userData?.role === 'moderator' &&
      userData?.moderator_for?.includes(sub.university);

    if (!isMod && userData?.role !== 'admin') {
      return { success: false, error: 'You are not authorized to reject events for this university.' };
    }

    const { error } = await supabase
      .from('submissions')
      .update({
        status: 'rejected',
        rejection_reason: reason || 'No reason provided',
        rejected_by: currentUser.id,
      })
      .eq('id', submissionId);

    if (error) throw error;

    return {
      success: true,
      message: 'Event rejected successfully.',
    };
  } catch (error) {
    console.error('Error rejecting event:', error);
    return {
      success: false,
      error: error.message || 'Failed to reject event',
    };
  }
};

/**
 * Edit an approved event (moderators only)
 */
export const editEvent = async (eventId, updates) => {
  try {
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
    if (updates.posterURL !== undefined) dbUpdates.poster_url = updates.posterURL;
    if (updates.eventURL !== undefined) dbUpdates.event_url = updates.eventURL;

    const { error } = await supabase
      .from('events')
      .update(dbUpdates)
      .eq('id', eventId);

    if (error) throw error;

    return {
      success: true,
      message: 'Event updated successfully',
    };
  } catch (error) {
    console.error('Error editing event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get approved events for moderator's universities
 */
export const getModeratedEvents = async (universities) => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: false });

    if (universities && universities.length > 0) {
      query = query.in('university', universities);
    }

    const { data, error } = await query;

    if (error) throw error;

    const events = (data || []).map((e) => ({
      ...e,
      dateTime: e.date_time ? new Date(e.date_time) : null,
    }));

    return { success: true, events };
  } catch (error) {
    console.error('Error fetching moderated events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

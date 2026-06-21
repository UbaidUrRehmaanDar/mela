// User Service for Mela (Supabase)
import { supabase } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return { success: false, error: 'User not found', user: null };
    }

    return {
      success: true,
      user: { id: data.id, ...data },
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
    const user = await getAuthUser();
    if (!user || user.id !== userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const dbUpdates = {};
    if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
    if (updates.university !== undefined) dbUpdates.university = updates.university;
    if (updates.photoURL !== undefined) dbUpdates.photo_url = updates.photoURL;
    if (updates.interests !== undefined) dbUpdates.interests = updates.interests;

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId);

    if (error) throw error;

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
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: existing } = await supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Event already saved' };
    }

    const { error } = await supabase.from('saved_events').insert({
      user_id: user.id,
      event_id: eventId,
      event_title: eventTitle,
      event_date_time: eventDateTime instanceof Date
        ? eventDateTime.toISOString()
        : eventDateTime || null,
      reminder_sent: false,
    });

    if (error) throw error;

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
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('saved_events')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) throw error;

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
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', savedEvents: [] };
    }

    const { data, error } = await supabase
      .from('saved_events')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date_time', { ascending: true });

    if (error) throw error;

    // Fetch fresh event titles from events table to avoid stale denormalized data
    const eventIds = [...new Set((data || []).map(s => s.event_id).filter(Boolean))];
    let eventTitles = {};
    if (eventIds.length > 0) {
      const { data: events } = await supabase
        .from('events')
        .select('id, title, date_time')
        .in('id', eventIds);
      if (events) {
        events.forEach(e => {
          eventTitles[e.id] = { title: e.title, dateTime: e.date_time ? new Date(e.date_time) : null };
        });
      }
    }

    const savedEvents = (data || []).map((s) => {
      const fresh = eventTitles[s.event_id] || {};
      return {
        ...s,
        event_title: fresh.title || s.event_title || 'Untitled Event',
        eventDateTime: fresh.dateTime || (s.event_date_time ? new Date(s.event_date_time) : null),
      };
    });

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
    const user = await getAuthUser();
    if (!user) {
      return { success: true, isSaved: false };
    }

    const { data } = await supabase
      .from('saved_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .maybeSingle();

    return { success: true, isSaved: !!data };
  } catch (error) {
    console.error('Error checking if event is saved:', error);
    return { success: false, error: error.message, isSaved: false };
  }
};

/**
 * Get total save/wishlist count for an event
 */
export const getSaveCount = async (eventId) => {
  try {
    const { count, error } = await supabase
      .from('saved_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error getting save count:', error);
    return { success: false, error: error.message, count: 0 };
  }
};
export const getUpcomingSavedEvents = async () => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', savedEvents: [] };
    }

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('saved_events')
      .select('*')
      .eq('user_id', user.id)
      .gt('event_date_time', now)
      .order('event_date_time', { ascending: true });

    if (error) throw error;

    const savedEvents = (data || []).map((s) => ({
      ...s,
      eventDateTime: s.event_date_time ? new Date(s.event_date_time) : null,
    }));

    return { success: true, savedEvents };
  } catch (error) {
    console.error('Error fetching upcoming saved events:', error);
    return { success: false, error: error.message, savedEvents: [] };
  }
};

/**
 * Update user profile by an admin (allows updating role and moderatorFor)
 */
export const adminUpdateUserProfile = async (userId, updates) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: currentUserProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only admins can perform this action' };
    }

    const dbUpdates = {};
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.moderatorFor !== undefined) dbUpdates.moderator_for = updates.moderatorFor;

    const { error } = await supabase
      .from('users')
      .update(dbUpdates)
      .eq('id', userId);

    if (error) throw error;

    return { success: true, message: 'User updated successfully by Admin' };
  } catch (error) {
    console.error('Error updating user as admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch all users (for Admin Dashboard)
 */
export const getAllUsers = async () => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', users: [] };
    }

    const { data: currentUserProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!currentUserProfile || currentUserProfile.role !== 'admin') {
      return { success: false, error: 'Unauthorized', users: [] };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;

    const users = (data || []).map((u) => ({
      ...u,
      id: u.id,
      displayName: u.display_name || '',
      photoURL: u.photo_url || '',
      moderatorFor: u.moderator_for || [],
    }));

    return { success: true, users };
  } catch (error) {
    console.error('Error fetching all users:', error);
    return { success: false, error: error.message, users: [] };
  }
};

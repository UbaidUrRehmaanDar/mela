// Event Service for Mela (Supabase)
import { supabase } from '../config/supabase';

/**
 * Fetch all approved events
 */
export const getAllEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('approved', true)
      .order('date_time', { ascending: false });

    if (error) throw error;

    const events = (data || []).map((e) => ({
      ...e,
      dateTime: e.date_time ? new Date(e.date_time) : null,
      participantLimit: e.participant_limit,
    }));

    return { success: true, events };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Fetch events with filters
 */
export const getFilteredEvents = async (filters = {}) => {
  try {
    let query = supabase.from('events').select('*').eq('approved', true);

    if (filters.university) {
      query = query.eq('university', filters.university);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.upcomingOnly) {
      query = query.gt('date_time', new Date().toISOString());
      query = query.order('date_time', { ascending: true });
    } else {
      query = query.order('date_time', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;

    const events = (data || []).map((e) => ({
      ...e,
      dateTime: e.date_time ? new Date(e.date_time) : null,
      participantLimit: e.participant_limit,
    }));

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
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error || !data) {
      return { success: false, error: 'Event not found', event: null };
    }

    const event = {
      ...data,
      dateTime: data.date_time ? new Date(data.date_time) : null,
      participantLimit: data.participant_limit,
    };

    return { success: true, event };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { success: false, error: error.message, event: null };
  }
};

/**
 * Search events by title or description (using Postgres ilike)
 */
export const searchEvents = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('approved', true)
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('date_time', { ascending: false });

    if (error) throw error;

    const events = (data || []).map((e) => ({
      ...e,
      dateTime: e.date_time ? new Date(e.date_time) : null,
      participantLimit: e.participant_limit,
    }));

    return { success: true, events };
  } catch (error) {
    console.error('Error searching events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

/**
 * Delete an event (admin only)
 */
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }
};
export const getOrganizerEvents = async (organizerId) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('organizer_id', organizerId)
      .eq('approved', true);

    if (error) throw error;

    const events = (data || []).map((e) => ({
      ...e,
      dateTime: e.date_time ? new Date(e.date_time) : null,
      participantLimit: e.participant_limit,
    }));

    return { success: true, events };
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    return { success: false, error: error.message, events: [] };
  }
};

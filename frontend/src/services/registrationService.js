// Registration Service for Mela (Supabase)
import { supabase } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Register current user for an event
 */
export const registerForEvent = async (event) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to register for events' };
    }

    const { data: existing } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'You are already registered for this event' };
    }

    const { data: profile } = await supabase
      .from('users')
      .select('display_name, university')
      .eq('id', user.id)
      .single();

    if (event.participantLimit) {
      const { count } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id);

      if (count !== null && count >= event.participantLimit) {
        return { success: false, error: 'Event registration is full.' };
      }
    }

    const registrationData = {
      event_id: event.id,
      event_title: event.title,
      event_date_time: event.dateTime instanceof Date
        ? event.dateTime.toISOString()
        : event.dateTime || null,
      event_university: event.university || '',
      user_id: user.id,
      user_name: profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      user_email: user.email,
      user_university: profile?.university || '',
    };

    const { error } = await supabase.from('registrations').insert(registrationData);

    if (error) throw error;

    return { success: true, message: 'Registered for event successfully!' };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Cancel a user's registration for an event
 */
export const unregisterFromEvent = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, message: 'Registration cancelled successfully' };
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if current user is registered for the event
 */
export const isRegisteredForEvent = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: true, isRegistered: false };
    }

    const { data } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();

    return { success: true, isRegistered: !!data };
  } catch (error) {
    console.error('Error checking registration status:', error);
    return { success: false, error: error.message, isRegistered: false };
  }
};

/**
 * Get all registrations for a specific event (only event organizers or admins)
 */
export const getEventRegistrations = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', registrations: [] };
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId);

    if (error) throw error;

    const registrations = (data || []).map((r) => ({
      ...r,
      registeredAt: r.registered_at ? new Date(r.registered_at) : new Date(),
    }));

    return { success: true, registrations };
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return { success: false, error: error.message, registrations: [] };
  }
};

/**
 * Get all events the current user is registered for
 */
export const getUserRegistrations = async () => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated', registrations: [] };
    }

    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const registrations = (data || []).map((r) => ({
      ...r,
      eventDateTime: r.event_date_time ? new Date(r.event_date_time) : null,
      registeredAt: r.registered_at ? new Date(r.registered_at) : null,
    }));

    return { success: true, registrations };
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return { success: false, error: error.message, registrations: [] };
  }
};

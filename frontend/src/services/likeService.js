// Like Service for Mela (Supabase)
import { supabase } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Like an event
 */
export const likeEvent = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to like events' };
    }

    const { data: existing } = await supabase
      .from('likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      return { success: false, error: 'Already liked this event' };
    }

    const { error } = await supabase.from('likes').insert({
      event_id: eventId,
      user_id: user.id,
    });

    if (error) throw error;

    return { success: true, message: 'Event liked successfully' };
  } catch (error) {
    console.error('Error liking event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unlike an event
 */
export const unlikeEvent = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) throw error;

    return { success: true, message: 'Event unliked successfully' };
  } catch (error) {
    console.error('Error unliking event:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if the current user has liked the event
 */
export const hasLikedEvent = async (eventId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: true, hasLiked: false };
    }

    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle();

    return { success: true, hasLiked: !!data };
  } catch (error) {
    console.error('Error checking if event is liked:', error);
    return { success: false, error: error.message, hasLiked: false };
  }
};

/**
 * Get total like count for an event
 */
export const getLikeCount = async (eventId) => {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) throw error;

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error getting like count:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

// Comment Service for Mela (Supabase)
import { supabase } from '../config/supabase';
import { getAuthUser } from './authService';

/**
 * Add a comment to an event
 */
export const addComment = async (eventId, content) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'You must be logged in to comment' };
    }

    if (!content || !content.trim()) {
      return { success: false, error: 'Comment content cannot be empty' };
    }

    const commentData = {
      event_id: eventId,
      user_id: user.id,
      user_email: user.email,
      display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      content: content.trim(),
    };

    const { data, error } = await supabase
      .from('comments')
      .insert(commentData)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      commentId: data.id,
      comment: {
        ...data,
        createdAt: new Date(data.created_at),
      },
    };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all comments for an event
 */
export const getComments = async (eventId) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Fetch fresh display names from users table to avoid stale denormalized data
    const userIds = [...new Set((data || []).map(c => c.user_id).filter(Boolean))];
    let userNames = {};
    if (userIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, display_name')
        .in('id', userIds);
      if (users) {
        users.forEach(u => { userNames[u.id] = u.display_name; });
      }
    }

    const comments = (data || []).map((c) => ({
      ...c,
      displayName: userNames[c.user_id] || c.display_name || 'Unknown',
      createdAt: c.created_at ? new Date(c.created_at) : null,
    }));

    return { success: true, comments };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, error: error.message, comments: [] };
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId) => {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    return { success: true, message: 'Comment deleted successfully' };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error: error.message };
  }
};

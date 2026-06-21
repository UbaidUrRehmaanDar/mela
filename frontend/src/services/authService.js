// Authentication Service for Mela (Supabase)
import { supabase } from '../config/supabase';

function mapProfile(data) {
  if (!data) return null;
  return {
    ...data,
    displayName: data.display_name || '',
    photoURL: data.photo_url || '',
    moderatorFor: data.moderator_for || [],
    createdAt: data.created_at || null,
    updatedAt: data.updated_at || null,
  };
}

function cleanProfileCache() {
  _currentProfileCache = null;
  _profileFetchInFlight = null;
}

/**
 * Sign up with email and password
 */
export const signUp = async (email, password, displayName, university) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: displayName, university: university || '' },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) throw error;

    const user = data.user;
    _currentUser = user;

    if (!data.session) {
      return {
        success: false,
        error: 'Please check your email to confirm your account before signing in.',
      };
    }

    const { error: profileError } = await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      display_name: displayName,
      photo_url: '',
      university: university || '',
      role: 'student',
      moderator_for: [],
    });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }

    cleanProfileCache();

    return { success: true, user };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    _currentUser = data.user;
    cleanProfileCache();

    await ensureUserProfile(data.user);

    return { success: true, user: data.user };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw error;
    return { success: true, message: 'Password reset link sent to your email' };
  } catch (error) {
    console.error('Reset password error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Resend email confirmation
 */
export const resendConfirmation = async (email) => {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return { success: true, message: 'Confirmation email resent. Please check your inbox.' };
  } catch (error) {
    console.error('Resend confirmation error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    _currentUser = null;
    cleanProfileCache();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    _currentUser = null;
    cleanProfileCache();
    return { success: false, error: error.message };
  }
};

/**
 * Listen to auth state changes
 * Returns an unsubscribe function
 */
export const onAuthChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      callback(session?.user ?? null);
    }
  );
  return () => subscription.unsubscribe();
};

/**
 * Get current user (synchronous, from cache)
 */
export const getCurrentUser = () => {
  return _currentUser;
};

/**
 * Get current user reliably (async, from Supabase)
 * Use this in service functions that need a guaranteed user ID
 */
export const getAuthUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) _currentUser = user;
    return user;
  } catch {
    return _currentUser;
  }
};

let _currentUser = null;
let _currentProfileCache = null;
let _profileFetchInFlight = null;

// Eagerly initialize from existing session
supabase.auth.getSession().then(({ data: { session } }) => {
  _currentUser = session?.user ?? null;
}).catch(() => {
  _currentUser = null;
});

/**
 * Update the current user's password
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return { success: true, message: 'Password updated successfully' };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Ensure a user profile exists (called after sign-in or session restore)
 */
export const ensureUserProfile = async (user) => {
  if (!user) return;

  try {
    const { data } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!data) {
      await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        photo_url: user.user_metadata?.avatar_url || '',
        university: '',
        role: 'student',
        moderator_for: [],
      });
    }
  } catch (err) {
    console.error('ensureUserProfile failed:', err);
  }
};

/**
 * Get current user profile from Supabase
 */
export const getCurrentUserProfile = async (forceRefresh = false) => {
  if (!forceRefresh && _currentProfileCache) return _currentProfileCache;

  if (_profileFetchInFlight) return _profileFetchInFlight;

  const user = await getAuthUser();
  if (!user) {
    cleanProfileCache();
    return null;
  }

  _profileFetchInFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        cleanProfileCache();
        return null;
      }

      _currentProfileCache = mapProfile(data);
      return _currentProfileCache;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      _profileFetchInFlight = null;
    }
  })();

  return _profileFetchInFlight;
};

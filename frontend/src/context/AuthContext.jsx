import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

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

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return mapProfile(data);
}

export function AuthProvider({ children }) {
  // loading = true until the initial session check completes
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;

    // 1. Get the current session immediately (synchronous-ish from local storage)
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        const p = await fetchProfile(sessionUser.id);
        if (mounted) setProfile(p);
      }

      if (mounted) setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        const nextUser = session?.user ?? null;
        setUser(nextUser);

        if (nextUser) {
          // Fetch profile in background — don't block render
          fetchProfile(nextUser.id).then((p) => {
            if (mounted) setProfile(p);
          });
        } else {
          setProfile(null);
        }

        // If this is the initial SIGNED_IN / INITIAL_SESSION event and we
        // were still in the loading state, resolve it now.
        if (loading) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Force a fresh profile reload (e.g. after profile edit)
   */
  const refreshProfile = async () => {
    if (!user) return null;
    const p = await fetchProfile(user.id);
    setProfile(p);
    return p;
  };

  return (
    <AuthContext.Provider value={{ loading, user, profile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

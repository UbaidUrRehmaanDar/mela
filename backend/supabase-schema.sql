-- ============================================================================
-- MELA - Supabase Database Schema
-- Run this entire file in Supabase SQL Editor to create all tables,
-- indexes, and Row Level Security (RLS) policies.
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  photo_url TEXT DEFAULT '',
  university TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'advisor', 'moderator', 'admin')),
  moderator_for TEXT[] DEFAULT '{}',
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Public read for all (organizer info display)
CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);

-- Users can insert their own profile (on signup)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile (except role/moderator_for)
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any user (role changes)
CREATE POLICY "users_admin_update" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can delete users
CREATE POLICY "users_admin_delete" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 2. EVENTS TABLE (Approved events visible to all)
-- ============================================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  university TEXT NOT NULL,
  category TEXT NOT NULL,
  venue TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  event_url TEXT DEFAULT '',
  organizer_email TEXT NOT NULL,
  organizer_id UUID NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT true,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  participant_limit INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved events
CREATE POLICY "events_select_all" ON events
  FOR SELECT USING (true);

-- Moderators, admins, and advisors can insert events
CREATE POLICY "events_insert_moderator" ON events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin' OR role = 'advisor' OR (role = 'moderator' AND university = events.university))
    )
  );

-- Moderators, admins, and advisors can update events
CREATE POLICY "events_update_moderator" ON events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin' OR role = 'advisor' OR (role = 'moderator' AND university = events.university))
    )
  );

-- Only admins can delete events
CREATE POLICY "events_admin_delete" ON events
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_events_university ON events(university);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_date_time ON events(date_time DESC);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);

-- ============================================================================
-- 3. SUBMISSIONS TABLE (Pending event submissions)
-- ============================================================================
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  university TEXT NOT NULL,
  category TEXT NOT NULL,
  venue TEXT DEFAULT '',
  poster_url TEXT DEFAULT '',
  event_url TEXT DEFAULT '',
  organizer_email TEXT NOT NULL,
  organizer_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'rejected')),
  rejection_reason TEXT DEFAULT '',
  rejected_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Organizers can read their own submissions; moderators and advisors see submissions for their universities
CREATE POLICY "submissions_select" ON submissions
  FOR SELECT USING (
    organizer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'moderator' OR role = 'advisor')
      AND university = submissions.university
    )
    OR EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Authenticated users can create submissions
CREATE POLICY "submissions_insert" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() = organizer_id AND status = 'pending'
  );

-- Organizers can update their own pending submissions; moderators and advisors can update for their uni
CREATE POLICY "submissions_update" ON submissions
  FOR UPDATE USING (
    (organizer_id = auth.uid() AND status = 'pending')
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin' OR role = 'advisor' OR (role = 'moderator' AND university = submissions.university))
    )
  );

-- Organizers can delete their own pending or rejected submissions; moderators, advisors and admins can delete for their uni
CREATE POLICY "submissions_delete" ON submissions
  FOR DELETE USING (
    (organizer_id = auth.uid() AND status IN ('pending', 'rejected'))
    OR EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND (role = 'admin' OR role = 'advisor' OR (role = 'moderator' AND university = submissions.university))
    )
  );

CREATE INDEX idx_submissions_organizer ON submissions(organizer_id);
CREATE INDEX idx_submissions_university_status ON submissions(university, status);

-- ============================================================================
-- 4. SAVED EVENTS TABLE
-- ============================================================================
CREATE TABLE saved_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  event_date_time TIMESTAMPTZ,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_events_select_own" ON saved_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_events_insert_own" ON saved_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_events_update_own" ON saved_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "saved_events_delete_own" ON saved_events
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_saved_events_user ON saved_events(user_id);

-- ============================================================================
-- 5. ORGANIZER APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE organizer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  user_email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  university TEXT NOT NULL,
  society_name TEXT DEFAULT '',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  feedback TEXT DEFAULT '',
  id_card_url TEXT DEFAULT '',
  society_proof_url TEXT DEFAULT '',
  authorization_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE organizer_applications ENABLE ROW LEVEL SECURITY;

-- Users can read their own applications; admins can read all
CREATE POLICY "org_apps_select" ON organizer_applications
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated users can create applications
CREATE POLICY "org_apps_insert" ON organizer_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can update or delete applications
CREATE POLICY "org_apps_admin_write" ON organizer_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "org_apps_admin_delete" ON organizer_applications
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- 6. COMMENTS TABLE
-- ============================================================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  user_email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "comments_insert" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Authors and admins can delete comments
CREATE POLICY "comments_delete" ON comments
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX idx_comments_event ON comments(event_id);

-- ============================================================================
-- 7. LIKES TABLE
-- ============================================================================
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "likes_select_all" ON likes
  FOR SELECT USING (true);

-- Authenticated users can like
CREATE POLICY "likes_insert" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can unlike their own likes
CREATE POLICY "likes_delete" ON likes
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_likes_event ON likes(event_id);
CREATE INDEX idx_likes_user_event ON likes(user_id, event_id);

-- ============================================================================
-- 8. REGISTRATIONS TABLE
-- ============================================================================
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  event_date_time TIMESTAMPTZ,
  event_university TEXT DEFAULT '',
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL DEFAULT '',
  user_email TEXT NOT NULL,
  user_university TEXT DEFAULT '',
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Users can view own registration; admins and event organizers can view all for an event
CREATE POLICY "registrations_select" ON registrations
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM events WHERE id = registrations.event_id AND organizer_id = auth.uid()
    )
  );

-- Authenticated users can register
CREATE POLICY "registrations_insert" ON registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can cancel own registration; admins and organizers can also cancel
CREATE POLICY "registrations_delete" ON registrations
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (
      SELECT 1 FROM events WHERE id = registrations.event_id AND organizer_id = auth.uid()
    )
  );

CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_registrations_user ON registrations(user_id);

-- ============================================================================
-- HELPER: approve_event function (replaces Firestore batch write)
-- ============================================================================
CREATE OR REPLACE FUNCTION approve_event(submission_id UUID, approver_id UUID)
RETURNS VOID AS $$
DECLARE
  sub RECORD;
BEGIN
  -- Fetch the submission
  SELECT * INTO sub FROM submissions WHERE id = submission_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Verify moderator/advisor status
  IF NOT EXISTS (
    SELECT 1 FROM users
    WHERE id = approver_id
    AND (role = 'admin' OR role = 'advisor' OR (role = 'moderator' AND sub.university = ANY(moderator_for)))
  ) THEN
    RAISE EXCEPTION 'Not authorized to approve events for this university';
  END IF;

  -- Insert into events
  INSERT INTO events (title, description, date_time, university, category, venue, poster_url, event_url,
                      organizer_email, organizer_id, approved, approved_by, approved_at, created_at, updated_at)
  VALUES (sub.title, sub.description, sub.date_time, sub.university, sub.category, sub.venue,
          sub.poster_url, sub.event_url, sub.organizer_email, sub.organizer_id,
          true, approver_id, NOW(), NOW(), NOW());

  -- Delete the submission
  DELETE FROM submissions WHERE id = submission_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER: updated_at trigger for all tables with updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER organizer_apps_updated_at BEFORE UPDATE ON organizer_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

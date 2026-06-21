-- =============================================================
-- Mela — Scraped Events table + seed data
-- Run in Supabase Dashboard > SQL Editor
-- =============================================================

CREATE TABLE IF NOT EXISTS scraped_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  university TEXT NOT NULL,
  category TEXT NOT NULL,
  venue TEXT DEFAULT '',
  source_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'discarded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO scraped_events (title, description, date_time, university, category, venue, source_url, status)
VALUES
(
  'National Robotics Competition 2026',
  'The ultimate battle of bots! Teams from all over Pakistan will compete in Speed Programming, RoboWars, and RoboMaze. Grand cash prizes and certificates for all participants.',
  '2026-11-20T09:00:00Z', 'UET', 'Competition', 'Main Sports Complex, UET Lahore',
  'https://uet.edu.pk/events/robotics-2026', 'pending'
),
(
  'Generative AI Developer Workshop',
  'Learn how to build and deploy GenAI applications using LLMs, LangChain, and vector databases. Hands-on coding sessions led by industry experts.',
  '2026-10-15T13:00:00Z', 'FAST NUCES', 'Workshop', 'EE Auditorium, FAST Lahore',
  'https://lhr.nu.edu.pk/gen-ai-workshop', 'pending'
),
(
  'Annual Career Fair 2026',
  'Connect with over 100 top companies, secure internship opportunities, and attend resume-building seminars. Open to final year students.',
  '2026-12-05T10:00:00Z', 'LUMS', 'Meetup', 'SSE Lawn, LUMS',
  'https://careerfair.lums.edu.pk', 'pending'
);

-- =============================================================
-- Mela — Seed Events (run in Supabase Dashboard > SQL Editor)
-- =============================================================

-- 1. Fix the role CHECK constraint to include 'advisor'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role = ANY (ARRAY['student'::text, 'advisor'::text, 'moderator'::text, 'admin'::text]));

-- 2. Make organizer_id nullable for seed events (FK references auth.users, can't insert directly)
ALTER TABLE events ALTER COLUMN organizer_id DROP NOT NULL;

-- 3. Insert seed events
INSERT INTO events (title, description, date_time, university, category, venue, poster_url, organizer_email, organizer_id, approved, approved_by, approved_at, created_at, updated_at, participant_limit)
VALUES
(
  'AI & Machine Learning Summit',
  'A full-day summit exploring the latest breakthroughs in artificial intelligence and machine learning. Industry experts will present on LLMs, computer vision, and real-world deployment challenges.',
  NOW() + INTERVAL '3 days' + INTERVAL '10 hours',
  'FAST NUCES', 'Tech', 'Auditorium Block A',
  '', 'cs@nu.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Web3 & Blockchain Workshop',
  'Hands-on workshop covering Solidity smart contracts, DeFi protocols, and NFT development. Bring your laptop.',
  NOW() + INTERVAL '5 days' + INTERVAL '14 hours',
  'LUMS', 'Workshop', 'CS Lab 3, SBASSE',
  '', 'blockchain@lums.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'HackFest 2026',
  '36-hour hackathon with prizes worth PKR 500,000. Build solutions for healthcare, education, or fintech. Teams of 2-4.',
  NOW() + INTERVAL '7 days' + INTERVAL '9 hours',
  'PUCIT', 'Hackathon', 'Main Hall, PUCIT',
  '', 'hackfest@pucit.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Cybersecurity Seminar',
  'Learn about ethical hacking, penetration testing, and securing modern web applications. Certificate of participation provided.',
  NOW() + INTERVAL '10 days' + INTERVAL '15 hours',
  'UET', 'Seminar', 'Lecture Hall 5, CS Dept',
  '', 'security@uet.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Open Source Contributor Meetup',
  'Monthly meetup for open source enthusiasts. Share your projects, find collaborators, and learn how to contribute to major open source repositories.',
  NOW() + INTERVAL '12 days' + INTERVAL '18 hours',
  'NUST', 'Meetup', 'SEECS Seminar Room',
  '', 'opensource@nust.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Data Science Bootcamp',
  'Intensive 2-day bootcamp covering Python for data science, pandas, matplotlib, and scikit-learn. Build and deploy a real ML model.',
  NOW() + INTERVAL '14 days' + INTERVAL '9 hours',
  'COMSATS', 'Workshop', 'IT Lab B, COMSATS Lahore',
  '', 'datascience@comsats.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Tech Entrepreneurship Conference',
  'Annual conference bringing together student entrepreneurs, VCs, and startup founders. Pitch competition with seed funding prizes.',
  NOW() + INTERVAL '16 days' + INTERVAL '10 hours',
  'LUMS', 'Conference', 'LUMS Auditorium',
  '', 'entrepreneurship@lums.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'RC3 — Riphah Computing Conference',
  'The 3rd Riphah Computing Conference (RC3) is a flagship annual event organized by the Department of Computing at Riphah International University, Lahore.',
  NOW() + INTERVAL '45 days' + INTERVAL '9 hours',
  'Riphah International University', 'Conference', 'Riphah International University, Lahore Campus',
  '', 'computing@riphah.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Competitive Programming Contest',
  'ICPC-style programming contest. 3 hours, 10 problems, individual participation. Top 3 winners receive cash prizes.',
  NOW() + INTERVAL '20 days' + INTERVAL '13 hours',
  'Punjab University', 'Competition', 'Computer Lab, CS Dept',
  '', 'cp@pu.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Cloud Computing & DevOps Seminar',
  'Deep dive into AWS, Docker, Kubernetes, and CI/CD pipelines. Live demo of a full deployment pipeline.',
  NOW() + INTERVAL '22 days' + INTERVAL '11 hours',
  'NUST', 'Seminar', 'SEECS Auditorium',
  '', 'devops@nust.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
),
(
  'Inter-University Hackathon',
  'The biggest hackathon of the year, open to all universities in Lahore. 48 hours to build something amazing. Prizes worth PKR 1,000,000.',
  NOW() + INTERVAL '35 days' + INTERVAL '9 hours',
  'FAST NUCES', 'Hackathon', 'FAST NUCES Main Campus',
  '', 'hackathon@nu.edu.pk', NULL, TRUE, NULL, NOW(), NOW(), NOW(), 0
);

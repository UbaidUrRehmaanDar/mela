import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gstaxxpbsfwzxklstjit.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error('Set SUPABASE_SERVICE_ROLE_KEY environment variable');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function restInsert(table, rows) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text.slice(0, 200)}`);
  }
  return true;
}

const future = (daysFromNow, hour = 14) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const now = new Date().toISOString();

async function run() {
  // ─── 1. Seed scraped/draft events (stored as approved=false in events table) ───
  console.log('1. Seeding draft (scraped) events...');
  const scrapedEvents = [
    {
      title: 'National Robotics Competition 2026',
      description: 'The ultimate battle of bots! Teams from all over Pakistan will compete in Speed Programming, RoboWars, and RoboMaze.',
      date_time: '2026-11-20T09:00:00Z',
      university: 'UET', category: 'Competition',
      venue: 'Main Sports Complex, UET Lahore',
      poster_url: '', organizer_email: '', organizer_id: null,
      approved: false, approved_by: null, approved_at: null,
      created_at: now, updated_at: now, participant_limit: 0,
    },
    {
      title: 'Generative AI Developer Workshop',
      description: 'Learn how to build and deploy GenAI applications using LLMs, LangChain, and vector databases.',
      date_time: '2026-10-15T13:00:00Z',
      university: 'FAST NUCES', category: 'Workshop',
      venue: 'EE Auditorium, FAST Lahore',
      poster_url: '', organizer_email: '', organizer_id: null,
      approved: false, approved_by: null, approved_at: null,
      created_at: now, updated_at: now, participant_limit: 0,
    },
    {
      title: 'Annual Career Fair 2026',
      description: 'Connect with over 100 top companies, secure internship opportunities, and attend resume-building seminars.',
      date_time: '2026-12-05T10:00:00Z',
      university: 'LUMS', category: 'Meetup',
      venue: 'SSE Lawn, LUMS',
      poster_url: '', organizer_email: '', organizer_id: null,
      approved: false, approved_by: null, approved_at: null,
      created_at: now, updated_at: now, participant_limit: 0,
    },
  ];

  try {
    await restInsert('events', scrapedEvents);
    console.log(`   Added ${scrapedEvents.length} draft events`);
  } catch (e) {
    console.log(`   Bulk insert failed, trying individually...`);
    let count = 0;
    for (const e of scrapedEvents) {
      try {
        await restInsert('events', [e]);
        console.log(`   [${++count}/${scrapedEvents.length}] Added: ${e.title}`);
      } catch (err) {
        console.log(`   Skipped: ${e.title} — ${err.message.slice(0, 60)}`);
      }
    }
  }

  // ─── 2. Seed approved events (skip if already exist) ───
  console.log('2. Seeding approved events...');
  const events = [
    { title: 'AI & Machine Learning Summit', description: 'A full-day summit exploring the latest breakthroughs in AI and ML.', date_time: future(3, 10), university: 'FAST NUCES', category: 'Tech', venue: 'Auditorium Block A', organizer_email: 'cs@nu.edu.pk' },
    { title: 'Web3 & Blockchain Workshop', description: 'Hands-on workshop covering Solidity smart contracts, DeFi protocols, and NFT development.', date_time: future(5, 14), university: 'LUMS', category: 'Workshop', venue: 'CS Lab 3, SBASSE', organizer_email: 'blockchain@lums.edu.pk' },
    { title: 'HackFest 2026', description: '36-hour hackathon with prizes worth PKR 500,000.', date_time: future(7, 9), university: 'PUCIT', category: 'Hackathon', venue: 'Main Hall, PUCIT', organizer_email: 'hackfest@pucit.edu.pk' },
    { title: 'Cybersecurity Seminar', description: 'Learn about ethical hacking, penetration testing, and securing modern web applications.', date_time: future(10, 15), university: 'UET', category: 'Seminar', venue: 'Lecture Hall 5, CS Dept', organizer_email: 'security@uet.edu.pk' },
    { title: 'Open Source Contributor Meetup', description: 'Monthly meetup for open source enthusiasts.', date_time: future(12, 18), university: 'NUST', category: 'Meetup', venue: 'SEECS Seminar Room', organizer_email: 'opensource@nust.edu.pk' },
    { title: 'Data Science Bootcamp', description: 'Intensive 2-day bootcamp covering Python for data science, pandas, matplotlib, and scikit-learn.', date_time: future(14, 9), university: 'COMSATS', category: 'Workshop', venue: 'IT Lab B, COMSATS Lahore', organizer_email: 'datascience@comsats.edu.pk' },
    { title: 'Tech Entrepreneurship Conference', description: 'Annual conference bringing together student entrepreneurs, VCs, and startup founders.', date_time: future(16, 10), university: 'LUMS', category: 'Conference', venue: 'LUMS Auditorium', organizer_email: 'entrepreneurship@lums.edu.pk' },
    { title: 'RC3 — Riphah Computing Conference', description: 'The 3rd Riphah Computing Conference (RC3), Lahore.', date_time: future(45, 9), university: 'Riphah International University', category: 'Conference', venue: 'Riphah International University, Lahore Campus', organizer_email: 'computing@riphah.edu.pk' },
    { title: 'Competitive Programming Contest', description: 'ICPC-style programming contest. 3 hours, 10 problems.', date_time: future(20, 13), university: 'Punjab University', category: 'Competition', venue: 'Computer Lab, CS Dept', organizer_email: 'cp@pu.edu.pk' },
    { title: 'Cloud Computing & DevOps Seminar', description: 'Deep dive into AWS, Docker, Kubernetes, and CI/CD pipelines.', date_time: future(22, 11), university: 'NUST', category: 'Seminar', venue: 'SEECS Auditorium', organizer_email: 'devops@nust.edu.pk' },
    { title: 'Inter-University Hackathon', description: 'The biggest hackathon of the year, open to all universities in Lahore.', date_time: future(35, 9), university: 'FAST NUCES', category: 'Hackathon', venue: 'FAST NUCES Main Campus', organizer_email: 'hackathon@nu.edu.pk' },
  ];

  const eventRows = events.map(e => ({
    ...e,
    poster_url: '', organizer_id: null,
    approved: true, approved_by: null, approved_at: now,
    created_at: now, updated_at: now, participant_limit: 0,
  }));

  let count = 0;
  for (const e of eventRows) {
    try {
      await restInsert('events', [e]);
      console.log(`   [${++count}/${events.length}] Added: ${e.title} (${e.university})`);
    } catch (err) {
      console.log(`   Skipped: ${e.title} — ${err.message.slice(0, 60)}`);
    }
  }

  console.log(`\nDone! ${count} approved + 3 draft events seeded.`);
}

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

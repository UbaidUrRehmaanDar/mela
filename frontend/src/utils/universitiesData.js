// University Profiles Data matching UNIVERSITIES in constants.js
// Uses lucide-react icon names instead of emojis

export const UNIVERSITY_PROFILES = [
  {
    id: 'fast-nuces',
    name: 'FAST NUCES',
    icon: 'Zap',
    description: 'National University of Computer and Emerging Sciences. A premier institution renowned for its pioneering role in computer science, software engineering, and technical education in Pakistan.',
    location: 'Lahore Campus, H-12 Islamabad Campus, Karachi, Peshawar, Chiniot-Faisalabad',
    website: 'https://nu.edu.pk',
    registeredOrganizers: ['Computer Science Society (CSS)', 'IEEE Student Branch', 'ACM Student Chapter', 'Media Society']
  },
  {
    id: 'lums',
    name: 'LUMS',
    icon: 'GraduationCap',
    description: 'Lahore University of Management Sciences. A world-class research university offering outstanding education in management, humanities, social sciences, science, and engineering.',
    location: 'DHA Phase 5, Lahore, Pakistan',
    website: 'https://lums.edu.pk',
    registeredOrganizers: ['LUMS Entrepreneurship Society', 'LUMS Media Society (LMS)', 'IEEE LUMS', 'PLUMS (Programming LUMS)']
  },
  {
    id: 'pucit',
    name: 'PUCIT',
    icon: 'Monitor',
    description: 'Punjab University College of Information Technology. One of the oldest and most prestigious IT colleges in the country, producing high-caliber software developers and researchers.',
    location: 'Old Campus (Anarkali) & New Campus (Quaid-e-Azam), Lahore',
    website: 'https://pucit.edu.pk',
    registeredOrganizers: ['PUCIT ACM Chapter', 'PUCIT Gaming Society', 'ACM-W PUCIT', 'Sports Society']
  },
  {
    id: 'uet',
    name: 'UET',
    icon: 'Cog',
    description: 'University of Engineering and Technology. Pakistan\'s oldest engineering institution, offering exceptional education across all engineering fields, architecture, and computer science.',
    location: 'G.T. Road, Lahore, Pakistan',
    website: 'https://uet.edu.pk',
    registeredOrganizers: ['IEEE UET', 'ASME Student Chapter', 'Literary Society', 'IET UET']
  },
  {
    id: 'punjab-university',
    name: 'Punjab University',
    icon: 'Landmark',
    description: 'University of the Punjab. Established in 1882, it is the oldest and largest public sector university in Pakistan, offering diverse academic departments and rich extracurricular programs.',
    location: 'Quaid-i-Azam Campus & Allama Iqbal Campus, Lahore',
    website: 'http://pu.edu.pk',
    registeredOrganizers: ['PU Debating Society', 'Punjab University CS Society', 'PU Art & Culture Society']
  },
  {
    id: 'nust',
    name: 'NUST',
    icon: 'Rocket',
    description: 'National University of Sciences and Technology. A highly prestigious comprehensive university specializing in science, engineering, business, and social sciences with a focus on innovation.',
    location: 'H-12 Sector, Islamabad, Pakistan',
    website: 'https://nust.edu.pk',
    registeredOrganizers: ['NUST Science Club', 'SEECS Developer Circle', 'NUST Media Club', 'ACM NUST']
  },
  {
    id: 'comsats',
    name: 'COMSATS',
    icon: 'Globe',
    description: 'COMSATS University Islamabad. A top-ranked public research university known for its excellent computing, engineering, and mathematics programs across multiple campuses.',
    location: 'Lahore Campus (Defence Road), Islamabad Campus, Abbottabad, Sahiwal, Wah',
    website: 'https://www.comsats.edu.pk',
    registeredOrganizers: ['COMSATS IEEE', 'CS Developer Society', 'COMSATS Literary Society']
  },
  {
    id: 'riphah',
    name: 'Riphah International University',
    icon: 'BookOpen',
    description: 'Riphah International University, Lahore Campus. A prominent private university known for its computing, engineering, and health sciences programs. Host to events like RC3 (Riphah Computing Conference) and CAIDS.',
    location: 'Lahore Campus & Islamabad Campus, Pakistan',
    website: 'https://riphah.edu.pk',
    registeredOrganizers: ['Sir Sameer Sohail (Dept. of Computing)', 'RC3 Organizing Committee', 'CAIDS Conference Team']
  }
];

// Map of icon names to lucide-react components (resolved at render time in components)
import {
  Zap, GraduationCap, Monitor, Cog, Landmark, Rocket, Globe, BookOpen, School
} from 'lucide-react';

export const ICON_MAP = {
  Zap,
  GraduationCap,
  Monitor,
  Cog,
  Landmark,
  Rocket,
  Globe,
  BookOpen,
  School,
};

export const getUniversityProfileByName = (name) => {
  return UNIVERSITY_PROFILES.find(u => u.name.toLowerCase() === name.toLowerCase()) || {
    id: 'other',
    name: name,
    icon: 'School',
    description: 'A participating university ecosystem in MELA discovery network.',
    location: 'Pakistan',
    website: '',
    registeredOrganizers: ['General Student Society']
  };
};

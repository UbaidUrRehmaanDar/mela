// Constants for Mela Application

export const UNIVERSITIES = [
  'FAST NUCES',
  'LUMS',
  'PUCIT',
  'UET',
  'Punjab University',
  'NUST',
  'COMSATS',
  'Riphah International University',
  'Other'
];

export const EVENT_UNIVERSITIES = UNIVERSITIES.filter(u => u !== 'Other');

export const SIGNUP_UNIVERSITY_OPTIONS = [
  '',
  ...UNIVERSITIES,
  'Free / Not in University'
];

export const UNIVERSITY_DOMAINS = {
  'FAST NUCES': ['nu.edu.pk'],
  'LUMS': ['lums.edu.pk'],
  'PUCIT': ['pucit.edu.pk'],
  'UET': ['uet.edu.pk'],
  'Punjab University': ['pu.edu.pk'],
  'NUST': ['nust.edu.pk'],
  'COMSATS': ['comsats.edu.pk'],
  'Riphah International University': ['students.riphah.edu.pk', 'riphah.edu.pk'],
};

export const getEmailDomain = (email) => {
  return email.split('@')[1]?.toLowerCase() || '';
};

export const validateUniversityEmail = (email, university) => {
  if (!university || university === 'Free / Not in University' || university === 'Other') {
    return { valid: true, message: '' };
  }

  const allowedDomains = UNIVERSITY_DOMAINS[university];
  if (!allowedDomains) {
    return { valid: true, message: '' };
  }

  const domain = getEmailDomain(email);
  const matches = allowedDomains.some((d) => domain === d || domain.endsWith('.' + d));

  if (!matches) {
    return {
      valid: false,
      message: `Please use your university email (e.g., @${allowedDomains[0]})`,
    };
  }

  return { valid: true, message: '' };
};

export const CATEGORIES = [
  'Tech',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Meetup',
  'Conference',
  'Competition',
  'Other'
];

export const EVENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const USER_ROLES = {
  STUDENT: 'student',
  ADVISOR: 'advisor',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Category color mapping — MELA Design System v1.0
export const CATEGORY_COLORS = {
  Tech: 'var(--cyan)',
  Workshop: 'var(--blue)',
  Seminar: 'var(--cyan)',
  Hackathon: 'var(--pink)',
  Meetup: 'var(--blue)',
  Conference: 'var(--yellow)',
  Competition: 'var(--pink)',
  Other: 'var(--orange)',
};

export const INTEREST_CATEGORIES = [
  { label: 'Tech', color: 'var(--cyan)', badgeClass: 'badge-tech' },
  { label: 'Business', color: 'var(--yellow)', badgeClass: 'badge-business' },
  { label: 'Arts', color: 'var(--pink)', badgeClass: 'badge-arts' },
  { label: 'Sports', color: 'var(--blue)', badgeClass: 'badge-sports' },
  { label: 'Science', color: 'var(--green)', badgeClass: 'badge-science' },
  { label: 'Other', color: 'var(--orange)', badgeClass: 'badge-other' },
];

const CATEGORY_BADGE_MAP = {
  Tech: 'badge-tech',
  Workshop: 'badge-tech',
  Seminar: 'badge-tech',
  Hackathon: 'badge-arts',
  Meetup: 'badge-business',
  Conference: 'badge-business',
  Competition: 'badge-arts',
  Other: 'badge-other',
};

export const getCategoryBadgeClass = (category) =>
  CATEGORY_BADGE_MAP[category] || 'badge-other';

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

// Utility function to format event date (re-exported from helpers)
export { formatEventDate } from './helpers';

// Validation function for event submission
export const validateEventData = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = 'Event title is required.';
  if (!data.description.trim()) errors.description = 'Description is required.';
  if (!data.dateTime) errors.dateTime = 'Date and time are required.';
  if (!data.university) errors.university = 'University is required.';
  if (!data.category) errors.category = 'Category is required.';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Function to check for valid image file types
export const isValidImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return allowedTypes.includes(file.type);
};

// Function to check for valid file size
export const isFileSizeValid = (file, maxSizeMB = 5) => {
  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};

// Constants for Mela Application

export const UNIVERSITIES = [
  'FAST NUCES',
  'LUMS',
  'PUCIT',
  'UET',
  'Punjab University',
  'NUST',
  'COMSATS',
  'Other'
];

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
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// Category color mapping for UI
export const CATEGORY_COLORS = {
  'Tech': 'var(--mela-yellow)',
  'Workshop': 'var(--mela-pink)',
  'Seminar': 'var(--mela-teal)',
  'Hackathon': 'var(--mela-orange)',
  'Meetup': 'var(--mela-purple)',
  'Conference': 'var(--mela-blue)',
  'Competition': 'var(--mela-green)',
  'Other': 'var(--mela-white)'
};

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};

export const isValidImageFile = (file) => {
  if (!file) return false;
  return UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type);
};

export const isFileSizeValid = (file) => {
  if (!file) return false;
  return file.size <= UPLOAD_CONSTRAINTS.MAX_FILE_SIZE;
};

export const validateEventData = (eventData) => {
  const errors = {};

  if (!eventData.title?.trim()) errors.title = 'Title is required';
  if (!eventData.description?.trim()) errors.description = 'Description is required';
  if (!eventData.dateTime) errors.dateTime = 'Date and time are required';
  if (!eventData.university) errors.university = 'University is required';
  if (!eventData.category) errors.category = 'Category is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Utility function to format event date
export const formatEventDate = (dateTime) => {
  if (!dateTime) return 'Date TBA';
  
  // Handle Firestore Timestamp
  const date = dateTime.toDate ? dateTime.toDate() : new Date(dateTime);
  
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return date.toLocaleDateString('en-US', options);
};

export const formatEventDate = (dateTime) => {
  if (!dateTime) return 'Date TBA';

  const date = new Date(dateTime);

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

export const formatDate = (isoString) => {
  if (!isoString) return '';
  
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};
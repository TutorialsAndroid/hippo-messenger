export function formatMessageTime(timestamp?: number): string {
  if (!timestamp) return '';

  const date = new Date(timestamp);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatLastSeen(timestamp?: number): string {
  if (!timestamp) return 'Offline';

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  return new Date(timestamp).toLocaleDateString();
}
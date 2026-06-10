export function formatChatTime(
  timestamp?: number,
) {
  if (!timestamp) {
    return '';
  }

  const now = Date.now();

  const diff =
    now - timestamp;

  const minute =
    60 * 1000;

  const hour =
    60 * minute;

  const day =
    24 * hour;

  if (diff < hour) {
    return `${Math.max(
      1,
      Math.floor(
        diff / minute,
      ),
    )}m`;
  }

  if (diff < day) {
    return `${Math.floor(
      diff / hour,
    )}h`;
  }

  if (diff < day * 2) {
    return 'Yesterday';
  }

  return new Date(
    timestamp,
  ).toLocaleDateString(
    [],
    {
      weekday: 'short',
    },
  );
}
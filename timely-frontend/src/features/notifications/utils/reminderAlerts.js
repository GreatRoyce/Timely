export const notificationId = (notification) => String(notification._id || notification.id);

export const mergeNotificationChannels = (notifications) => {
  const byReminder = new Map();
  notifications.forEach((item) => {
    const key = String(item.reminderId || notificationId(item));
    if (!byReminder.has(key) || item.channel === "in_app") byReminder.set(key, item);
  });
  return [...byReminder.values()].sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
};

// Seed old history without ringing it again when a dashboard is opened.
export const getNewAlerts = (notifications, seen, startedAt) =>
  notifications.filter((notification) =>
    notification.channel === "in_app" &&
    notification.status === "sent" &&
    !seen.has(notificationId(notification)) &&
    new Date(notification.createdAt).getTime() >= startedAt - 60_000,
  );

export const playReminderChime = (context) => {
  if (context?.state !== "running") return false;
  [660, 880, 660].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.22;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.16, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.21);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  });
  return true;
};

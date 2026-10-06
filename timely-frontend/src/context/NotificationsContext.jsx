import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import NotificationsContext from "./notifications-context";
import { useAuth } from "../hooks/useAuth";
import { getNotifications } from "../lib/notificationsApi";
import { getApiErrorMessage } from "../lib/apiError";
import { getNewAlerts, mergeNotificationChannels, notificationId, playReminderChime } from "../features/notifications/utils/reminderAlerts";

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `timely:seen-reminders:${user._id || user.id || user.email}`;
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [unread, setUnread] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundError, setSoundError] = useState("");
  const audio = useRef(null);
  const sound = useRef(false);
  const seen = useRef(null);
  const startedAt = useRef(null);

  const enableSound = useCallback(async () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error("Sound is unavailable in this browser.");
      audio.current ??= new AudioContext();
      await audio.current.resume();
      if (!playReminderChime(audio.current)) throw new Error("Allow audio in your browser and try again.");
      sound.current = true;
      setSoundEnabled(true);
      setSoundError("");
    } catch (soundFailure) {
      sound.current = false;
      setSoundEnabled(false);
      setSoundError(soundFailure.message);
    }
  }, []);

  const muteSound = useCallback(() => {
    sound.current = false;
    setSoundEnabled(false);
  }, []);
  const markRead = useCallback(() => setUnread([]), []);
  const dismissAlert = useCallback((id) => setAlerts((current) => current.filter((item) => notificationId(item) !== id)), []);

  useEffect(() => {
    startedAt.current ??= Date.now();
    let disposed = false;
    let inFlight = false;
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      seen.current = new Set(Array.isArray(stored) ? stored : []);
    } catch {
      seen.current = new Set();
    }

    const refresh = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const items = await getNotifications({ limit: 100 });
        if (disposed) return;
        // Read storage again to avoid repeating alerts already shown by another tab.
        try {
          const stored = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
          if (Array.isArray(stored)) stored.forEach((id) => seen.current.add(id));
        } catch { /* Alerts still work when browser storage is unavailable. */ }
        const incoming = getNewAlerts(items, seen.current, startedAt.current);
        items.forEach((item) => seen.current.add(notificationId(item)));
        try {
          window.localStorage.setItem(storageKey, JSON.stringify([...seen.current].slice(-500)));
        } catch { /* Keep session deduplication even without persistent storage. */ }
        setNotifications(mergeNotificationChannels(items));
        setError("");
        if (incoming.length) {
          window.dispatchEvent(new Event("timely:reminder-delivered"));
          setAlerts((current) => [...incoming, ...current].slice(0, 5));
          setUnread((current) => [...new Set([...current, ...incoming.map(notificationId)])]);
          if (sound.current && !playReminderChime(audio.current)) {
            sound.current = false;
            setSoundEnabled(false);
            setSoundError("Your browser paused audio. Enable sound again to hear reminders.");
          }
          if (window.Notification?.permission === "granted") {
            incoming.forEach((item) => {
              try {
                const desktop = new window.Notification(item.subject, { body: item.message, tag: notificationId(item) });
                desktop.onclick = () => { window.focus(); desktop.close(); };
              } catch { /* The in-app alert remains available on unsupported devices. */ }
            });
          }
        }
      } catch (requestError) {
        if (!disposed) setError(getApiErrorMessage(requestError, "Reminders could not be refreshed. Retrying automatically."));
      } finally {
        inFlight = false;
        if (!disposed) setLoading(false);
      }
    };

    const timeoutId = window.setTimeout(refresh, 0);
    const intervalId = window.setInterval(refresh, 5000);
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    window.addEventListener("timely:refresh-notifications", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("timely:refresh-notifications", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [storageKey]);

  useEffect(() => () => { audio.current?.close().catch(() => undefined); }, []);

  const value = useMemo(() => ({
    notifications, alerts, unreadCount: unread.length, loading, error,
    soundEnabled, soundError, enableSound, muteSound, markRead, dismissAlert,
  }), [notifications, alerts, unread, loading, error, soundEnabled, soundError, enableSound, muteSound, markRead, dismissAlert]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

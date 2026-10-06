import { useEffect, useState } from "react";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import { H5 } from "../../shared/components/ui/Typography";
import { useNotifications } from "../../hooks/useNotifications";

const NotificationsPage = () => {
  const { notifications, loading, error, unreadCount, markRead, soundEnabled, enableSound, muteSound } = useNotifications();
  const [permission, setPermission] = useState(() => window.Notification?.permission || "unsupported");
  const [permissionError, setPermissionError] = useState("");

  const enableDesktopAlerts = async () => {
    try {
      setPermission(await window.Notification.requestPermission());
      setPermissionError("");
    } catch {
      setPermissionError("Desktop alerts are unavailable in this browser. In-app reminders will still appear.");
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(markRead, 0);
    return () => window.clearTimeout(timeoutId);
  }, [markRead, unreadCount]);

  return (
    <section className="max-w-3xl p-6 lg:p-8">
      <H5 className="opacity-80">Notifications</H5>
      <p className="mb-5 mt-1 text-md text-muted-foreground">
        Recent reminders and task updates. This list refreshes automatically.
      </p>

      <Card className="mb-5">
        <h2 className="font-semibold">Reminder alerts</h2>
        <p className="mt-1 text-sm text-muted-foreground">Keep Timely open to receive sound and desktop alerts. Enable sound again after reopening or reloading the app.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={soundEnabled ? muteSound : enableSound} size="sm" variant="outline">{soundEnabled ? "Mute reminder sound" : "Enable reminder sound"}</Button>
          {soundEnabled && <Button onClick={enableSound} size="sm" variant="ghost">Test sound</Button>}
          {permission === "default" && window.isSecureContext && <Button onClick={enableDesktopAlerts} size="sm" variant="outline">Enable desktop alerts</Button>}
        </div>
        {permission === "granted" && <p className="mt-3 text-sm text-muted-foreground">Desktop alerts are enabled.</p>}
        {permission === "denied" && <p className="mt-3 text-sm text-muted-foreground">Desktop alerts are blocked. You can allow notifications in your browser's site settings.</p>}
        {(permission === "unsupported" || !window.isSecureContext) && <p className="mt-3 text-sm text-muted-foreground">Desktop alerts are unavailable here. In-app reminders and supported sound alerts still work.</p>}
        {permissionError && <p role="status" className="mt-3 text-sm text-danger">{permissionError}</p>}
      </Card>
      {error && <Button onClick={() => window.dispatchEvent(new Event("timely:refresh-notifications"))} size="sm" variant="outline" className="mb-4">Retry notifications</Button>}
        <Card className="divide-y divide-border p-0">
          {notifications.map((notification) => (
            <article className="p-4" key={notification._id || notification.id}>
              <h2 className="text-md font-semibold">{notification.subject || notification.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {notification.message || notification.detail}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
              {notification.channel === "email" && notification.status === "failed" && <p className="mt-2 text-xs text-danger">Email delivery failed.</p>}
            </article>
          ))}
          {!loading && !notifications.length && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No notifications yet.
            </p>
          )}
          {loading && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Loading notifications...
            </p>
          )}
        </Card>
    </section>
  );
};

export default NotificationsPage;

import { useCallback, useEffect, useState } from "react";
import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import { H5 } from "../../shared/components/ui/Typography";
import { getApiErrorMessage } from "../../lib/apiError";
import { getNotifications } from "../../lib/notificationsApi";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      setNotifications(await getNotifications());
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, "Unable to load notifications."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadNotifications, 0);
    return () => window.clearTimeout(timeoutId);
  }, [loadNotifications]);

  return (
    <section className="max-w-3xl p-6 lg:p-8">
      <H5 className="opacity-80">Notifications</H5>
      <p className="mb-5 mt-1 text-md text-muted-foreground">
        Recent reminders and task updates.
      </p>

      {error ? (
        <div className="flex items-center justify-between gap-4 rounded-sm border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <span>{error}</span>
          <Button onClick={loadNotifications} size="sm" variant="outline">Retry</Button>
        </div>
      ) : (
        <Card className="divide-y divide-border p-0">
          {notifications.map((notification) => (
            <article className="p-4" key={notification._id || notification.id}>
              <h2 className="text-md font-semibold">{notification.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {notification.message || notification.detail}
              </p>
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
      )}
    </section>
  );
};

export default NotificationsPage;

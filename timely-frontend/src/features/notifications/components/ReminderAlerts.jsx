import { Link } from "react-router-dom";
import { X } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import { useNotifications } from "../../../hooks/useNotifications";
import { notificationId } from "../utils/reminderAlerts";

export const ReminderSoundPrompt = () => {
  const { soundEnabled, soundError, enableSound, error } = useNotifications();
  return (
    <>
      {!soundEnabled && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white px-6 py-3 text-sm">
          <p className="text-muted-foreground">Hear a chime when a reminder arrives. Keep Timely open for sound alerts.</p>
          <Button onClick={enableSound} size="sm" variant="outline">Enable reminder sound</Button>
          {soundError && <p role="status" className="w-full text-danger">{soundError}</p>}
        </div>
      )}
      {error && <p role="status" className="bg-danger/5 px-6 py-2 text-sm text-danger">{error}</p>}
    </>
  );
};

const ReminderAlerts = () => {
  const { alerts, dismissAlert } = useNotifications();
  return (
    <div aria-live="polite" aria-relevant="additions" className="fixed bottom-4 right-4 z-50 flex max-h-[60vh] w-[calc(100%-2rem)] max-w-sm flex-col gap-3 overflow-y-auto">
      {alerts.map((alert) => (
        <article key={notificationId(alert)} className="rounded-md border border-primary/20 bg-white p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-semibold text-foreground">{alert.subject}</h2>
            <button aria-label={`Dismiss ${alert.subject}`} className="rounded-sm p-1 hover:bg-muted focus-visible:outline focus-visible:outline-primary" onClick={() => dismissAlert(notificationId(alert))} type="button"><X size={16} /></button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-primary underline" to="/dashboard/tasks">View tasks</Link>
        </article>
      ))}
    </div>
  );
};

export default ReminderAlerts;

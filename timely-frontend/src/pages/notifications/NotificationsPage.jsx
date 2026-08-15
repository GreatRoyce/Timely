import Card from "../../shared/components/ui/Card";
import { H5 } from "../../shared/components/ui/Typography";

const notifications = [
  { id: 1, title: "Order #4043 is due now", detail: "Sarah Adelaja · Ankara Gown" },
  { id: 2, title: "Pickup reminder scheduled", detail: "Michael Chinwe · 12:45 PM" },
];

const NotificationsPage = () => (
  <section className="max-w-3xl p-6 lg:p-8">
    <H5 className="opacity-80">Notifications</H5>
    <p className="mb-5 mt-1 text-md text-muted-foreground">Recent reminders and order updates.</p>
    <Card className="divide-y divide-border p-0">
      {notifications.map((notification) => (
        <article className="p-4" key={notification.id}>
          <h2 className="text-md font-semibold">{notification.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{notification.detail}</p>
        </article>
      ))}
    </Card>
  </section>
);

export default NotificationsPage;

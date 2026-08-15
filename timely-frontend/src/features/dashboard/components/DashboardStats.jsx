import {
  PiBellSimpleRingingBold,
  PiClockCountdownBold,
  PiPackageBold,
  PiPackageFill,
} from "react-icons/pi";
import { useOrders } from "../../../hooks/useOrders";
import {
  getOrderDeadline,
  isActiveOrder,
  normalizeOrderStatus,
} from "../../orders/utils/orderUtils";

const DashboardStats = () => {
  const { orders } = useOrders();
  const now = new Date();
  const upcomingCutoff = now.getTime() + 24 * 60 * 60 * 1000;

  const stats = [
    {
      id: "active",
      title: "Active Orders",
      icon: PiPackageBold,
      amount: orders.filter(isActiveOrder).length,
      overview: "Orders currently in your workflow",
    },
    {
      id: "progress",
      title: "In Progress",
      icon: PiClockCountdownBold,
      amount: orders.filter(
        (order) => normalizeOrderStatus(order.status) === "In Progress",
      ).length,
      overview: "Currently being worked on",
    },
    {
      id: "ready",
      title: "Ready for Pickup",
      icon: PiPackageFill,
      amount: orders.filter(
        (order) => normalizeOrderStatus(order.status) === "Ready",
      ).length,
      overview: "Awaiting customer pickup",
    },
    {
      id: "upcoming",
      title: "Due in 24 Hours",
      icon: PiBellSimpleRingingBold,
      amount: orders.filter((order) => {
        const deadline = getOrderDeadline(order)?.getTime();
        return (
          isActiveOrder(order) &&
          deadline >= now.getTime() &&
          deadline <= upcomingCutoff
        );
      }).length,
      overview: "Scheduled within the next day",
    },
  ];

  return (
    <section
      aria-label="Order overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.id}
            className="rounded-md border border-primary/20 bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {item.title}
              </h2>
              <Icon className="rounded-full bg-primary/10 p-1 text-2xl text-primary/60" />
            </div>
            <p className="mt-2 text-4xl font-bold text-foreground">{item.amount}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.overview}</p>
          </article>
        );
      })}
    </section>
  );
};

export default DashboardStats;

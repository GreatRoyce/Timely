import {
  PiBellSimpleRingingBold,
  PiCheckCircleBold,
  PiClockCountdownBold,
  PiListChecksBold,
} from "react-icons/pi";

import { useDashboard } from "../../../hooks/useDashboard";

const DashboardStats = () => {
  const { dashboard, loading, error, refetch } = useDashboard();

  const summary = dashboard?.summary;

  const stats = [
    {
      id: "active",
      title: "Active Tasks",
      icon: PiListChecksBold,
      amount: summary?.activeTasks ?? 0,
      overview: "Tasks currently in your workflow",
    },
    {
      id: "progress",
      title: "In Progress",
      icon: PiClockCountdownBold,
      amount: summary?.inProgressTasks ?? 0,
      overview: "Tasks currently being worked on",
    },
    {
      id: "today",
      title: "Due Today",
      icon: PiCheckCircleBold,
      amount: summary?.dueToday ?? 0,
      overview: "Tasks due today",
    },
    {
      id: "reminders",
      title: "Reminders",
      icon: PiBellSimpleRingingBold,
      amount: summary?.totalReminders ?? 0,
      overview: "Scheduled task reminders",
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-sm border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
        <span>{error}</span>
        <button className="font-semibold underline" onClick={refetch} type="button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label="Task overview"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <article
            key={item.id}
            className="rounded-md border border-primary/20 bg-surface p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-muted-foreground">
                {item.title}
              </h2>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Icon className="text-xl text-primary" />
              </div>
            </div>

            <p className="mt-2 text-4xl font-bold text-foreground">
              {loading ? "—" : item.amount}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {item.overview}
            </p>
          </article>
        );
      })}
    </section>
  );
};

export default DashboardStats;

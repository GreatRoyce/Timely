import { useState } from "react";
import Button from "../../shared/components/ui/Button";
import Table from "../../shared/components/ui/Table";
import { H5 } from "../../shared/components/ui/Typography";
import OrderStatusBadge from "../../features/orders/components/OrderStatusBadge";
import {
  formatOrderDeadline,
  getStatusActionLabel,
} from "../../features/orders/utils/orderUtils";
import { useOrders } from "../../hooks/useOrders";
import TaskReminderModal from "../../features/reminders/components/TaskReminderModal";

const formatReminderTime = (value) =>
  new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

const OrdersPage = () => {
  const {
    orders,
    reminders,
    loading,
    error,
    actionOrderId,
    openCreateOrder,
    advanceOrderStatus,
    refreshOrders,
  } = useOrders();
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = orders.find((task) => task.id === selectedTaskId);
  const getActiveReminder = (taskId) =>
    reminders
      .filter(
        (reminder) => reminder.taskId === taskId && reminder.status === "scheduled",
      )
      .sort(
        (first, second) =>
          new Date(first.remindAt).getTime() - new Date(second.remindAt).getTime(),
      )[0];
  const selectedReminder = selectedTask
    ? getActiveReminder(selectedTask.id)
    : null;

  const columns = [
    { key: "id", label: "Task", render: (order) => `#${order.displayId}` },
    { key: "customerName", label: "Customer" },
    { key: "item", label: "Item" },
    {
      key: "dueDate",
      label: "Due",
      render: (order) => formatOrderDeadline(order),
    },
    {
      key: "status",
      label: "Status",
      render: (order) => <OrderStatusBadge status={order.status} />,
    },
    {
      key: "reminder",
      label: "Reminder",
      render: (order) => {
        const reminder = getActiveReminder(order.id);
        const canManage = !["Completed", "Cancelled"].includes(order.status);

        return (
          <div className="flex min-w-44 items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              {reminder ? formatReminderTime(reminder.remindAt) : "Not set"}
            </span>
            {canManage && (
              <Button
                aria-label={`Manage reminder for task ${order.id}`}
                onClick={() => setSelectedTaskId(order.id)}
                size="sm"
                variant="outline"
              >
                {reminder ? "Manage" : "Set"}
              </Button>
            )}
          </div>
        );
      },
    },
    {
      key: "action",
      label: "Next action",
      render: (order) => {
        const actionLabel = getStatusActionLabel(order.status);

        return actionLabel ? (
          <Button
            aria-label={`${actionLabel} for task ${order.id}`}
            disabled={actionOrderId === order.id}
            onClick={() => advanceOrderStatus(order.id)}
            size="sm"
            variant={order.status === "In Progress" ? "success" : "outline"}
          >
            {actionLabel}
          </Button>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">No action needed</span>
        );
      },
    },
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <H5 className="opacity-80">Tasks</H5>
          <p className="mt-1 text-md text-muted-foreground">
            Manage current and upcoming customer tasks.
          </p>
        </div>
        <Button className="self-start" onClick={openCreateOrder} size="sm">
          NEW TASK +
        </Button>
      </div>
      {error && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-sm border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <span>{error}</span>
          <Button onClick={refreshOrders} size="sm" variant="outline">Retry</Button>
        </div>
      )}
      <Table
        columns={columns}
        emptyMessage={loading ? "Loading tasks..." : "No tasks yet."}
        rows={orders}
      />
      {selectedTask && (
        <TaskReminderModal
          key={`${selectedTask.id}-${selectedReminder?.id || "new"}`}
          onClose={() => setSelectedTaskId(null)}
          reminder={selectedReminder}
          task={selectedTask}
        />
      )}
    </section>
  );
};

export default OrdersPage;

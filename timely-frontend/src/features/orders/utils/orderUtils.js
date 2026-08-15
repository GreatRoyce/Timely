export const ORDER_STATUSES = ["New", "In Progress", "Ready", "Completed"];

const LEGACY_STATUS_MAP = {
  "Due Now": "In Progress",
  "Due in 15m": "In Progress",
  Overdue: "In Progress",
  Received: "New",
  "Ready for Pickup": "Ready",
};

export const normalizeOrderStatus = (status) => {
  const normalized = LEGACY_STATUS_MAP[status] || status;
  return ORDER_STATUSES.includes(normalized) ? normalized : "New";
};

export const getOrderDeadline = (order) => {
  if (!order?.dueDate || !order?.dueTime) return null;

  const [year, month, day] = order.dueDate.split("-").map(Number);
  const [hours, minutes] = order.dueTime.split(":").map(Number);
  const deadline = new Date(year, month - 1, day, hours, minutes);

  return Number.isNaN(deadline.getTime()) ? null : deadline;
};

export const sortByDeadline = (orders) =>
  [...orders].sort((first, second) => {
    const firstDeadline = getOrderDeadline(first)?.getTime() ?? Infinity;
    const secondDeadline = getOrderDeadline(second)?.getTime() ?? Infinity;
    return firstDeadline - secondDeadline;
  });

export const getNextOrderStatus = (status) => {
  const currentIndex = ORDER_STATUSES.indexOf(normalizeOrderStatus(status));
  return currentIndex >= 0 && currentIndex < ORDER_STATUSES.length - 1
    ? ORDER_STATUSES[currentIndex + 1]
    : null;
};

export const getStatusActionLabel = (status) => {
  const nextStatus = getNextOrderStatus(status);
  const labels = {
    "In Progress": "Start order",
    Ready: "Mark ready",
    Completed: "Complete order",
  };

  return nextStatus ? labels[nextStatus] : null;
};

export const getOrderUrgency = (order, now = new Date()) => {
  const deadline = getOrderDeadline(order);
  const referenceDate = now instanceof Date ? now : new Date();

  if (!deadline) {
    return { label: "No deadline", tone: "muted", differenceMs: Infinity };
  }

  const differenceMs = deadline.getTime() - referenceDate.getTime();
  const absoluteMinutes = Math.max(1, Math.round(Math.abs(differenceMs) / 60000));

  if (differenceMs < 0) {
    const label = absoluteMinutes < 60
      ? `${absoluteMinutes}m overdue`
      : `${Math.ceil(absoluteMinutes / 60)}h overdue`;
    return { label, tone: "danger", differenceMs };
  }

  if (differenceMs <= 15 * 60000) {
    return { label: "Due now", tone: "danger", differenceMs };
  }

  if (differenceMs <= 60 * 60000) {
    return {
      label: `Due in ${Math.ceil(differenceMs / 60000)}m`,
      tone: "warning",
      differenceMs,
    };
  }

  return { label: "Upcoming", tone: "muted", differenceMs };
};

export const formatOrderDeadline = (order, now = new Date()) => {
  const deadline = getOrderDeadline(order);
  if (!deadline) return "No deadline";
  const referenceDate = now instanceof Date ? now : new Date();

  const time = new Intl.DateTimeFormat("en-NG", {
    hour: "numeric",
    minute: "2-digit",
  }).format(deadline);

  const startOfToday = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const startOfDeadline = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );
  const dayDifference = Math.round(
    (startOfDeadline.getTime() - startOfToday.getTime()) / 86400000,
  );

  if (dayDifference === 0) return `Today · ${time}`;
  if (dayDifference === 1) return `Tomorrow · ${time}`;

  return new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(deadline);
};

export const isActiveOrder = (order) =>
  normalizeOrderStatus(order.status) !== "Completed";

export const isAttentionOrder = (order, now = new Date()) => {
  if (!isActiveOrder(order)) return false;
  const deadline = getOrderDeadline(order);
  if (!deadline) return false;
  const referenceDate = now instanceof Date ? now : new Date();

  return deadline.getTime() - referenceDate.getTime() <= 2 * 60 * 60 * 1000;
};

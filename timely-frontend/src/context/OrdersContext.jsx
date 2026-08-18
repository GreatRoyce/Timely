import { useCallback, useEffect, useMemo, useState } from "react";
import OrdersContext from "./orders-context";
import { getNextOrderStatus, normalizeOrderStatus } from "../features/orders/utils/orderUtils";
import { createCustomer, getCustomers } from "../lib/customersApi";
import { getApiErrorMessage } from "../lib/apiError";
import {
  cancelReminder,
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from "../lib/remindersApi";
import {
  cancelTask,
  completeTask,
  createTask,
  deleteTask,
  getTasks,
  startTask,
} from "../lib/tasksApi";

export const DATA_CHANGED_EVENT = "timely:data-changed";

const normalizePhone = (phone = "") => phone.replace(/\D/g, "");

const mapCustomer = (customer) => ({
  ...customer,
  id: String(customer._id || customer.id),
});

const mapReminder = (reminder) => ({
  ...reminder,
  id: String(reminder._id || reminder.id),
  taskId: String(reminder.taskId?._id || reminder.taskId),
});

const mapTaskToOrder = (task, customerOverride) => {
  const populatedCustomer =
    task.customerId && typeof task.customerId === "object" ? task.customerId : null;
  const customer = customerOverride || populatedCustomer;
  const id = String(task._id || task.id);

  return {
    ...task,
    id,
    displayId: id.length > 8 ? id.slice(-6).toUpperCase() : id,
    customerId: String(customer?._id || customer?.id || task.customerId || ""),
    customerName: customer?.name || "Unknown customer",
    phone: customer?.phone || "",
    item: task.title,
    dueDate: task.dueDate?.slice(0, 10) || "",
    status: normalizeOrderStatus(task.status),
  };
};

const toOrderPayload = (order, customerId) => ({
  customerId,
  title: order.item,
  dueDate: order.dueDate,
  dueTime: order.dueTime,
  priority:
    { Low: "low", Normal: "medium", High: "high", Urgent: "high" }[
      order.priority
    ] || "medium",
  ...(order.notes?.trim() ? { notes: order.notes.trim() } : {}),
});

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionOrderId, setActionOrderId] = useState(null);
  const [reminderActionId, setReminderActionId] = useState(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksResult, customerResult, reminderResult] = await Promise.all([
        getTasks({ limit: 100 }),
        getCustomers(),
        getReminders(),
      ]);

      setCustomers(customerResult.map(mapCustomer));
      setOrders(tasksResult.tasks.map((task) => mapTaskToOrder(task)));
      setReminders(reminderResult.map(mapReminder));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load tasks."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(refreshOrders, 0);
    return () => window.clearTimeout(timeoutId);
  }, [refreshOrders]);

  const addOrder = useCallback(
    async (order) => {
      setError("");
      let createdTask = null;

      try {
        let customer = customers.find(
          (existingCustomer) =>
            normalizePhone(existingCustomer.phone) === normalizePhone(order.phone),
        );

        if (!customer) {
          customer = mapCustomer(
            await createCustomer({ name: order.customerName, phone: order.phone }),
          );
          setCustomers((current) => [customer, ...current]);
        }

        createdTask = await createTask(toOrderPayload(order, customer.id));
        const scheduledReminder = await createReminder({
          taskId: String(createdTask._id || createdTask.id),
          remindAt: new Date(`${order.dueDate}T${order.dueTime}`).toISOString(),
        });

        const newOrder = mapTaskToOrder(createdTask, customer);
        setOrders((current) => [newOrder, ...current]);
        setReminders((current) => [mapReminder(scheduledReminder), ...current]);
        setIsCreateOrderOpen(false);
        window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
        return newOrder;
      } catch (requestError) {
        let rollbackFailed = false;

        if (createdTask) {
          try {
            await deleteTask(String(createdTask._id || createdTask.id));
          } catch {
            rollbackFailed = true;
          }
        }

        const requestMessage = getApiErrorMessage(
          requestError,
          "Unable to create task and reminder.",
        );
        const message = rollbackFailed
          ? `Task was created, but its reminder failed: ${requestMessage}`
          : requestMessage;
        setError(message);
        throw new Error(message, { cause: requestError });
      }
    },
    [customers],
  );

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const requestByStatus = {
      "In Progress": startTask,
      Completed: completeTask,
      Cancelled: cancelTask,
    };
    const request = requestByStatus[status];
    if (!request) return null;

    setActionOrderId(orderId);
    setError("");

    try {
      const task = await request(orderId);
      let updatedOrder;

      setOrders((current) =>
        current.map((order) => {
          if (order.id !== orderId) return order;
          updatedOrder = mapTaskToOrder(task, {
            _id: order.customerId,
            name: order.customerName,
            phone: order.phone,
          });
          return updatedOrder;
        }),
      );

      window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
      return updatedOrder;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to update task.");
      setError(message);
      return null;
    } finally {
      setActionOrderId(null);
    }
  }, []);

  const advanceOrderStatus = useCallback(
    async (orderId) => {
      const order = orders.find((candidate) => candidate.id === orderId);
      const nextStatus = order ? getNextOrderStatus(order.status) : null;
      return nextStatus ? updateOrderStatus(orderId, nextStatus) : null;
    },
    [orders, updateOrderStatus],
  );

  const scheduleTaskReminder = useCallback(async (taskId, remindAt) => {
    setReminderActionId(taskId);
    setError("");

    try {
      const reminder = mapReminder(
        await createReminder({
          taskId,
          remindAt: new Date(remindAt).toISOString(),
        }),
      );
      setReminders((current) => [reminder, ...current]);
      window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
      return reminder;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to schedule reminder.");
      setError(message);
      throw new Error(message, { cause: requestError });
    } finally {
      setReminderActionId(null);
    }
  }, []);

  const rescheduleTaskReminder = useCallback(async (reminderId, remindAt) => {
    setReminderActionId(reminderId);
    setError("");

    try {
      const reminder = mapReminder(
        await updateReminder(reminderId, {
          remindAt: new Date(remindAt).toISOString(),
        }),
      );
      setReminders((current) =>
        current.map((item) => (item.id === reminderId ? reminder : item)),
      );
      return reminder;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to reschedule reminder.");
      setError(message);
      throw new Error(message, { cause: requestError });
    } finally {
      setReminderActionId(null);
    }
  }, []);

  const cancelTaskReminder = useCallback(async (reminderId) => {
    setReminderActionId(reminderId);
    setError("");

    try {
      const reminder = mapReminder(await cancelReminder(reminderId));
      setReminders((current) =>
        current.map((item) => (item.id === reminderId ? reminder : item)),
      );
      window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
      return reminder;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to cancel reminder.");
      setError(message);
      throw new Error(message, { cause: requestError });
    } finally {
      setReminderActionId(null);
    }
  }, []);

  const removeTaskReminder = useCallback(async (reminderId) => {
    setReminderActionId(reminderId);
    setError("");

    try {
      await deleteReminder(reminderId);
      setReminders((current) =>
        current.filter((reminder) => reminder.id !== reminderId),
      );
      window.dispatchEvent(new Event(DATA_CHANGED_EVENT));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to delete reminder.");
      setError(message);
      throw new Error(message, { cause: requestError });
    } finally {
      setReminderActionId(null);
    }
  }, []);

  const openCreateOrder = useCallback(() => setIsCreateOrderOpen(true), []);
  const closeCreateOrder = useCallback(() => setIsCreateOrderOpen(false), []);
  const clearError = useCallback(() => setError(""), []);

  const value = useMemo(
    () => ({
      orders,
      customers,
      reminders,
      loading,
      error,
      actionOrderId,
      reminderActionId,
      addOrder,
      refreshOrders,
      updateOrderStatus,
      advanceOrderStatus,
      scheduleTaskReminder,
      rescheduleTaskReminder,
      cancelTaskReminder,
      removeTaskReminder,
      isCreateOrderOpen,
      openCreateOrder,
      closeCreateOrder,
      clearError,
    }),
    [
      orders,
      customers,
      reminders,
      loading,
      error,
      actionOrderId,
      reminderActionId,
      addOrder,
      refreshOrders,
      updateOrderStatus,
      advanceOrderStatus,
      scheduleTaskReminder,
      rescheduleTaskReminder,
      cancelTaskReminder,
      removeTaskReminder,
      isCreateOrderOpen,
      openCreateOrder,
      closeCreateOrder,
      clearError,
    ],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

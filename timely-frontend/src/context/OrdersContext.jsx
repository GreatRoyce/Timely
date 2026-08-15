import { useCallback, useEffect, useMemo, useState } from "react";
import OrdersContext from "./orders-context";
import {
  getNextOrderStatus,
  normalizeOrderStatus,
  ORDER_STATUSES,
} from "../features/orders/utils/orderUtils";

const STORAGE_KEY = "timely-orders";

const defaultOrders = [
  {
    id: "4043",
    customerName: "Sarah Adelaja",
    phone: "0803 456 7890",
    item: "Ankara Gown",
    dueDate: "2026-08-12",
    dueTime: "12:30",
    status: "Due Now",
    notes: "Include matching head tie",
    createdAt: "2026-08-12T08:30:00.000Z",
  },
  {
    id: "4093",
    customerName: "Michael Chinwe",
    phone: "0802 111 4200",
    item: "Three-Piece Suit",
    dueDate: "2026-08-12",
    dueTime: "12:45",
    status: "In Progress",
    notes: "",
    createdAt: "2026-08-12T09:15:00.000Z",
  },
];

const loadOrders = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    const loadedOrders = Array.isArray(parsed) ? parsed : defaultOrders;

    return loadedOrders.map((order) => ({
      ...order,
      status: normalizeOrderStatus(order.status),
      updatedAt: order.updatedAt || order.createdAt,
    }));
  } catch {
    return defaultOrders.map((order) => ({
      ...order,
      status: normalizeOrderStatus(order.status),
      updatedAt: order.createdAt,
    }));
  }
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(loadOrders);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const addOrder = useCallback((order) => {
    const newOrder = {
      ...order,
      id: String(Date.now()).slice(-4),
      status: "New",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((current) => [newOrder, ...current]);
    setIsCreateOrderOpen(false);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    if (!ORDER_STATUSES.includes(status)) return;

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  }, []);

  const advanceOrderStatus = useCallback((orderId) => {
    setOrders((current) =>
      current.map((order) => {
        if (order.id !== orderId) return order;
        const nextStatus = getNextOrderStatus(order.status);

        return nextStatus
          ? { ...order, status: nextStatus, updatedAt: new Date().toISOString() }
          : order;
      }),
    );
  }, []);

  const openCreateOrder = useCallback(() => setIsCreateOrderOpen(true), []);
  const closeCreateOrder = useCallback(() => setIsCreateOrderOpen(false), []);

  const value = useMemo(
    () => ({
      orders,
      addOrder,
      updateOrderStatus,
      advanceOrderStatus,
      isCreateOrderOpen,
      openCreateOrder,
      closeCreateOrder,
    }),
    [
      orders,
      addOrder,
      updateOrderStatus,
      advanceOrderStatus,
      isCreateOrderOpen,
      openCreateOrder,
      closeCreateOrder,
    ],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

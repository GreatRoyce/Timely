import { useContext } from "react";
import OrdersContext from "../context/orders-context";

export const useOrders = () => {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error("useOrders must be used within OrdersProvider");
  }

  return context;
};

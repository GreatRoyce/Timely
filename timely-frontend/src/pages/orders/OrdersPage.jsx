import Button from "../../shared/components/ui/Button";
import Table from "../../shared/components/ui/Table";
import { H5 } from "../../shared/components/ui/Typography";
import OrderStatusBadge from "../../features/orders/components/OrderStatusBadge";
import {
  formatOrderDeadline,
  getStatusActionLabel,
} from "../../features/orders/utils/orderUtils";
import { useOrders } from "../../hooks/useOrders";

const OrdersPage = () => {
  const { orders, openCreateOrder, advanceOrderStatus } = useOrders();

  const columns = [
    { key: "id", label: "Order", render: (order) => `#${order.id}` },
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
      key: "action",
      label: "Next action",
      render: (order) => {
        const actionLabel = getStatusActionLabel(order.status);

        return actionLabel ? (
          <Button
            aria-label={`${actionLabel} for order ${order.id}`}
            onClick={() => advanceOrderStatus(order.id)}
            size="sm"
            variant={order.status === "Ready" ? "success" : "outline"}
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
          <H5 className="opacity-80">Orders</H5>
          <p className="mt-1 text-md text-muted-foreground">
            Manage current and upcoming customer orders.
          </p>
        </div>
        <Button className="self-start" onClick={openCreateOrder} size="sm">
          NEW ORDER +
        </Button>
      </div>
      <Table columns={columns} rows={orders} />
    </section>
  );
};

export default OrdersPage;

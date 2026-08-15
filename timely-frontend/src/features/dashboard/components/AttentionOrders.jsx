import { PiWarningCircleFill } from "react-icons/pi";
import { Link } from "react-router-dom";
import { H5 } from "../../../shared/components/ui/Typography";
import Button from "../../../shared/components/ui/Button";
import { useOrders } from "../../../hooks/useOrders";
import {
  formatOrderDeadline,
  getOrderUrgency,
  getStatusActionLabel,
  isAttentionOrder,
  sortByDeadline,
} from "../../orders/utils/orderUtils";

const AttentionOrders = () => {
  const { orders, advanceOrderStatus } = useOrders();
  const attentionOrders = sortByDeadline(
    orders.filter((order) => isAttentionOrder(order)),
  );
  const visibleOrders = attentionOrders.slice(0, 3);

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <H5 className="opacity-80">Needs Your Attention</H5>
        <Link
          className="shrink-0 text-md font-semibold text-primary hover:underline"
          to="/dashboard/orders"
        >
          View all{attentionOrders.length ? ` (${attentionOrders.length})` : ""}
        </Link>
      </div>

      {visibleOrders.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {visibleOrders.map((order) => {
            const urgency = getOrderUrgency(order);
            const isUrgent = urgency.tone === "danger";
            const actionLabel = getStatusActionLabel(order.status);

            return (
              <article
                key={order.id}
                className={`flex min-h-64 flex-col rounded-md border p-4 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-md ${
                  isUrgent
                    ? "border-danger/20 bg-danger/5"
                    : "border-border bg-surface"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <PiWarningCircleFill
                      size={18}
                      className={isUrgent ? "text-danger" : "text-warning"}
                    />
                    <span
                      className={`rounded-full px-2 py-1 text-sm font-semibold tracking-wide ${
                        isUrgent
                          ? "bg-danger text-danger-foreground"
                          : "bg-warning text-warning-foreground"
                      }`}
                    >
                      {urgency.label}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 text-xl font-medium ${
                      isUrgent ? "text-danger" : "text-muted-foreground"
                    }`}
                  >
                    {formatOrderDeadline(order).split(" · ").at(-1)}
                  </span>
                </div>

                <p
                  className={`text-lg font-semibold uppercase tracking-widest ${
                    isUrgent ? "text-danger" : "text-muted-foreground"
                  }`}
                >
                  Order #{order.id}
                </p>
                <h3 className="mt-1 text-md font-semibold">{order.customerName}</h3>
                <hr className="my-3 border-border" />

                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-md text-foreground/80">
                    {order.item || "Order item"}
                  </span>
                  <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-muted px-2 text-xs font-semibold">
                    1
                  </span>
                </div>

                <div className="mt-auto pt-5">
                  <Button
                    disabled={!actionLabel}
                    fullWidth
                    onClick={() => advanceOrderStatus(order.id)}
                    size="sm"
                    variant={isUrgent ? "danger" : "primary"}
                  >
                    {actionLabel || "Completed"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-primary/20 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-foreground/80">You are all caught up.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            No active orders are due within the next two hours.
          </p>
        </div>
      )}
    </section>
  );
};

export default AttentionOrders;

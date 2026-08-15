import { FaPlus } from "react-icons/fa";
import { PiPackageBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { useOrders } from "../../../hooks/useOrders";
import {
  formatOrderDeadline,
  getOrderDeadline,
  isActiveOrder,
  sortByDeadline,
} from "../../orders/utils/orderUtils";

const UpcomingOrders = () => {
  const { orders, openCreateOrder } = useOrders();
  const now = new Date();
  const upcomingOrders = sortByDeadline(
    orders.filter((order) => {
      const deadline = getOrderDeadline(order);
      return isActiveOrder(order) && deadline && deadline >= now;
    }),
  ).slice(0, 5);

  return (
    <aside className="my-6 xl:fixed xl:bottom-6 xl:right-6 xl:top-[86px] xl:z-20 xl:my-0 xl:w-72">
      <div className="flex h-full max-h-[32rem] flex-col rounded-md border border-primary/20 bg-white shadow-sm xl:max-h-none">
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <div>
            <h2 className="text-lg font-semibold">Upcoming Orders</h2>
            <p className="text-sm text-muted-foreground">Next scheduled deadlines</p>
          </div>
          <button
            aria-label="Add new order"
            className="rounded-full border border-primary/20 bg-primary/10 p-2 text-primary transition-all hover:scale-105 hover:bg-primary/20 active:scale-95"
            onClick={openCreateOrder}
            type="button"
          >
            <FaPlus size={12} />
          </button>
        </div>

        <div className="min-h-0 flex-1 divide-y divide-border overflow-y-auto px-2">
          {upcomingOrders.length ? (
            upcomingOrders.map((order) => (
              <article
                key={order.id}
                className="flex items-center gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-foreground/5"
              >
                <div className="rounded-full bg-primary/10 p-2">
                  <PiPackageBold className="text-xl text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-md font-semibold text-foreground/80">
                    {order.customerName} · {order.item || "Order item"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatOrderDeadline(order)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="px-4 py-10 text-center">
              <p className="font-semibold text-foreground/80">No upcoming orders</p>
              <p className="mt-1 text-sm text-muted-foreground">
                New deadlines will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 text-center text-sm">
          <Link
            className="font-semibold tracking-wide text-primary transition-colors hover:underline"
            to="/dashboard/orders"
          >
            SEE ALL ORDERS
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default UpcomingOrders;

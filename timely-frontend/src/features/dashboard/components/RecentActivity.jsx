import { Link } from "react-router-dom";
import { useOrders } from "../../../hooks/useOrders";
import OrderStatusBadge from "../../orders/components/OrderStatusBadge";
import { formatOrderDeadline } from "../../orders/utils/orderUtils";

const RecentActivity = () => {
  const { orders } = useOrders();
  const recentOrders = [...orders]
    .sort(
      (first, second) =>
        new Date(second.updatedAt || second.createdAt).getTime() -
        new Date(first.updatedAt || first.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="mt-8 rounded-md border border-primary/20 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-lg font-semibold opacity-80">Recent Activity</h2>
        <Link
          className="text-md font-medium text-primary hover:underline"
          to="/dashboard/tasks"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-foreground/5 text-sm uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Task</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Due</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/40"
              >
                <td className="px-4 py-4 font-medium">#{order.displayId}</td>
                <td className="px-4 py-4">{order.customerName}</td>
                <td className="px-4 py-4">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {formatOrderDeadline(order)}
                </td>
                <td className="px-4 py-4 text-center">
                  <Link
                    className="font-semibold text-primary hover:underline"
                    to="/dashboard/tasks"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {!recentOrders.length && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-muted-foreground"
                  colSpan="5"
                >
                  No task activity yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentActivity;

import PropTypes from "prop-types";
import { normalizeOrderStatus } from "../utils/orderUtils";

const statusStyles = {
  New: "bg-info/10 text-info",
  "In Progress": "bg-warning/10 text-warning",
  Ready: "bg-success/10 text-success",
  Completed: "bg-foreground/10 text-muted-foreground",
};

const OrderStatusBadge = ({ status }) => {
  const normalizedStatus = normalizeOrderStatus(status);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${statusStyles[normalizedStatus]}`}
    >
      {normalizedStatus}
    </span>
  );
};

OrderStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default OrderStatusBadge;

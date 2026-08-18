import PropTypes from "prop-types";
import { normalizeOrderStatus } from "../utils/orderUtils";

const statusStyles = {
  New: "bg-info/10 text-info",
  "In Progress": "bg-warning/10 text-warning",
  Completed: "bg-foreground/10 text-muted-foreground",
  Cancelled: "bg-danger/10 text-danger",
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

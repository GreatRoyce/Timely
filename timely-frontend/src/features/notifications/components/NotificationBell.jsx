import { FaRegBell } from "react-icons/fa";
import { useNotifications } from "../../../hooks/useNotifications";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();
  return (
    <div className="relative mr-1 cursor-pointer rounded-full p-2 opacity-75 transition-all duration-200 hover:bg-primary/10 hover:opacity-100">
      <FaRegBell />
      {unreadCount > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 text-xs text-white">{unreadCount}</span>}
      <span className="sr-only">{unreadCount} new reminders</span>
    </div>
  );
};

export default NotificationBell;

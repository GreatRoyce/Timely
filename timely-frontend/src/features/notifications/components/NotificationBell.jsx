import { FaRegBell } from "react-icons/fa";

const NotificationBell = () => {
  return (
    <div className="mr-1 cursor-pointer rounded-full p-2 opacity-75 transition-all duration-200 hover:bg-primary/10 hover:opacity-100">
      <FaRegBell />
    </div>
  );
};

export default NotificationBell;

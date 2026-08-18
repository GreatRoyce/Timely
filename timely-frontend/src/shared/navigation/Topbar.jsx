import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { H5 } from "../components/ui/Typography";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import NotificationBell from "../../features/notifications/components/NotificationBell";
import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";

const Topbar = ({ onMenuOpen }) => {
  const { user } = useAuth();
  const { openCreateOrder } = useOrders();
  const firstName = (user?.ownerName || user?.fullName)?.split(" ")[0] || "there";

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-border bg-white shadow-sm md:left-56">
      <div className="flex h-full items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            aria-label="Open navigation"
            className="rounded-sm p-2 text-foreground/70 hover:bg-muted md:hidden"
            onClick={onMenuOpen}
            type="button"
          >
            <Menu size={20} />
          </button>
          <H5 className="truncate opacity-80">Good Morning, {firstName}</H5>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button className="hidden sm:inline-flex" onClick={openCreateOrder} size="sm">
            NEW TASK +
          </Button>
          <SearchInput />
          <Link aria-label="Notifications" to="/dashboard/notifications">
            <NotificationBell />
          </Link>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  onMenuOpen: PropTypes.func.isRequired,
};

export default Topbar;

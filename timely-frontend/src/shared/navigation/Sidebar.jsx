import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { H5 } from "../components/ui/Typography";
import Logo from "../components/ui/Logo";
import { CiGrid42, CiSettings } from "react-icons/ci";
import { PiNotepadBold } from "react-icons/pi";
import { IoMdPeople } from "react-icons/io";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const sidebarNav =
  "flex items-center justify-start border-l-2 border-transparent px-3 py-2.5 gap-3 duration-300 transition-all cursor-pointer opacity-70 hover:opacity-100 hover:border-primary rounded-sm hover:bg-foreground/10";

const navItems = [
  { label: "Home", path: "/dashboard", icon: CiGrid42, end: true },
  { label: "Tasks", path: "/dashboard/tasks", icon: PiNotepadBold },
  { label: "Customers", path: "/dashboard/customers", icon: IoMdPeople },
  { label: "Settings", path: "/dashboard/settings", icon: CiSettings },
];

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
    navigate("/home");
  };

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/35 md:hidden"
          onClick={onClose}
          type="button"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 border-r border-primary/10 bg-white shadow-sm transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center">
              <Logo className="h-10" />
              <H5>Timely</H5>
            </div>
            <button
              aria-label="Close navigation"
              className="rounded-sm p-2 text-muted-foreground hover:bg-muted md:hidden"
              onClick={onClose}
              type="button"
            >
              <X size={18} />
            </button>
          </div>
          <hr className="border-border" />

          <nav
            aria-label="Dashboard navigation"
            className="mt-4 flex flex-1 flex-col space-y-1 text-md"
          >
            {navItems.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                className={({ isActive }) =>
                  `${sidebarNav} ${isActive ? "border-primary bg-primary/10 text-primary opacity-100" : ""}`
                }
                end={end}
                key={path}
                onClick={onClose}
                to={path}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className={`mt-auto w-full text-foreground ${sidebarNav}`}
              type="button"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;

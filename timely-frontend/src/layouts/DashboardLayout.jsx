import { useState } from "react";
import { Outlet } from "react-router-dom";
import CreateOrderModal from "../features/orders/components/CreateOrderModal";
import Sidebar from "../shared/navigation/Sidebar";
import Topbar from "../shared/navigation/Topbar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
  <div className="h-screen overflow-hidden bg-primary/5">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex h-screen min-w-0 flex-col pt-16 md:pl-56">
        <Topbar onMenuOpen={() => setIsSidebarOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <CreateOrderModal />
    </div>
  );
};

export default DashboardLayout;

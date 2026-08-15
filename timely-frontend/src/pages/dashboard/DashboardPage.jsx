import DashboardStats from "../../features/dashboard/components/DashboardStats";
import AttentionOrders from "../../features/dashboard/components/AttentionOrders";
import RecentActivity from "../../features/dashboard/components/RecentActivity";
import UpcomingOrders from "../../features/dashboard/components/UpcomingOrders";
import Button from "../../shared/components/ui/Button";
import { useOrders } from "../../hooks/useOrders";

const DashboardPage = () => {
  const { openCreateOrder } = useOrders();

  return (
    <section className="min-h-full bg-primary/5 p-4 sm:p-6 lg:p-8 xl:pr-80">
      <div className="mb-4 sm:hidden">
        <Button fullWidth onClick={openCreateOrder} size="sm">
          NEW ORDER +
        </Button>
      </div>
      <DashboardStats />
      <UpcomingOrders />
      <AttentionOrders />
      <RecentActivity />
    </section>
  );
};

export default DashboardPage;

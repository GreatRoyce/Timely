import Card from "../../shared/components/ui/Card";
import Button from "../../shared/components/ui/Button";
import { H5 } from "../../shared/components/ui/Typography";
import { useOrders } from "../../hooks/useOrders";

const CustomersPage = () => {
  const { customers, orders, loading, error, refreshOrders } = useOrders();

  return (
    <section className="p-6 lg:p-8">
      <H5 className="opacity-80">Customers</H5>
      <p className="mb-5 mt-1 text-md text-muted-foreground">
        Customers are saved in your workspace and reused for future tasks.
      </p>

      {error && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-sm border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <span>{error}</span>
          <Button onClick={refreshOrders} size="sm" variant="outline">Retry</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => {
          const customerOrders = orders.filter(
            (order) => order.customerId === customer.id,
          );

          return (
            <Card key={customer.id}>
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold">{customer.name}</h2>
              <p className="text-md text-muted-foreground">{customer.phone}</p>
              <p className="mt-3 text-sm text-primary">
                {customerOrders.length} {customerOrders.length === 1 ? "task" : "tasks"}
              </p>
            </Card>
          );
        })}
      </div>

      {!loading && !customers.length && !error && (
        <div className="rounded-md border border-dashed border-primary/20 bg-white px-5 py-10 text-center">
          <p className="font-semibold text-foreground/80">No customers yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your first customer will be saved when you create a task.
          </p>
        </div>
      )}
    </section>
  );
};

export default CustomersPage;

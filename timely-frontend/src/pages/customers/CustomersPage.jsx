import Card from "../../shared/components/ui/Card";
import { H5 } from "../../shared/components/ui/Typography";
import { useOrders } from "../../hooks/useOrders";

const CustomersPage = () => {
  const { orders } = useOrders();
  const customers = Array.from(
    new Map(orders.map((order) => [order.phone, order])).values(),
  );

  return (
    <section className="p-6 lg:p-8">
      <H5 className="opacity-80">Customers</H5>
      <p className="mb-5 mt-1 text-md text-muted-foreground">
        Customer details are collected automatically from your orders.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <Card key={customer.phone}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
              {customer.customerName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-lg font-semibold">{customer.customerName}</h2>
            <p className="text-md text-muted-foreground">{customer.phone}</p>
            <p className="mt-3 text-sm text-primary">Latest: Order #{customer.id}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default CustomersPage;

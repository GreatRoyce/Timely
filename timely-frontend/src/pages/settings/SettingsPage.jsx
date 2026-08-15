import Card from "../../shared/components/ui/Card";
import { H5 } from "../../shared/components/ui/Typography";
import { useAuth } from "../../hooks/useAuth";

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <section className="max-w-3xl p-6 lg:p-8">
      <H5 className="opacity-80">Settings</H5>
      <p className="mb-5 mt-1 text-md text-muted-foreground">Your Timely account and business profile.</p>
      <Card>
        <dl className="grid gap-4 text-md sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Full name</dt>
            <dd className="mt-1 font-semibold">{user?.fullName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Business</dt>
            <dd className="mt-1 font-semibold">{user?.businessName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email address</dt>
            <dd className="mt-1 font-semibold">{user?.email}</dd>
          </div>
        </dl>
      </Card>
    </section>
  );
};

export default SettingsPage;

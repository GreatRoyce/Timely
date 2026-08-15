import { Link } from "react-router-dom";
import { PiWarningCircleFill, PiHouseBold } from "react-icons/pi";
import Button from "../../shared/components/ui/Button";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-100/30 via-background to-primary/5 px-6">
      <div className="w-full max-w-xl rounded-xl border border-primary/20 bg-surface p-10 text-center shadow-lg">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10">
          <PiWarningCircleFill
            size={42}
            className="text-danger"
          />
        </div>

        {/* 404 */}
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-semibold text-foreground">
          Oops! This page doesn't exist.
        </h2>

        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          The page you're looking for may have been moved, deleted,
          or the link you followed is incorrect.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Link to="/">
            <Button
              leftIcon={PiHouseBold}
              size="md"
            >
              Back to Home
            </Button>
          </Link>

          <Link to="/login">
            <Button
              variant="outline"
              size="md"
            >
              Go to Login
            </Button>
          </Link>
        </div>

        <div className="mt-10 border-t border-border pt-5">
          <p className="text-xs tracking-wide text-muted-foreground">
            Timely • Organize orders. Deliver on time.
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
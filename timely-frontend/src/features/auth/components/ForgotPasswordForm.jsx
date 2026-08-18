import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Logo from "../../../shared/components/ui/Logo";
import { getApiErrorMessage } from "../../../lib/apiError";
import { requestPasswordReset } from "../../../lib/authApi";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await requestPasswordReset(email);

      if (result.resetToken) {
        navigate(`/reset-password?token=${encodeURIComponent(result.resetToken)}`);
        return;
      }

      setMessage(result.message);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to request a reset."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary/5 p-4">
      <section className="w-full max-w-md rounded-md border border-primary/20 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logo className="h-8" />
          <span className="text-lg font-semibold text-primary">Timely</span>
        </div>
        <h1 className="text-center text-2xl font-semibold">Reset your password</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Enter your account email to continue.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            autoFocus
            id="reset-email"
            label="Email address"
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          {message && <p className="text-sm text-success">{message}</p>}
          <Button disabled={isSubmitting} fullWidth type="submit">
            {isSubmitting ? "Sending..." : "Continue"}
          </Button>
        </form>

        <Link className="mt-5 block text-center text-sm font-medium text-primary hover:underline" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
};

export default ForgotPasswordForm;

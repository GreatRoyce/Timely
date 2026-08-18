import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Logo from "../../../shared/components/ui/Logo";
import { getApiErrorMessage } from "../../../lib/apiError";
import { resetPassword } from "../../../lib/authApi";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await resetPassword({ token, password, confirmPassword });
      navigate("/login", { replace: true });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to reset password."));
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
        <h1 className="text-center text-2xl font-semibold">Choose a new password</h1>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!searchParams.get("token") && (
            <Input
              id="reset-token"
              label="Reset token"
              onChange={(event) => setToken(event.target.value)}
              required
              value={token}
            />
          )}
          <Input
            id="new-password"
            label="New password"
            minLength="8"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <Input
            id="confirm-new-password"
            label="Confirm new password"
            minLength="8"
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            type="password"
            value={confirmPassword}
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button disabled={isSubmitting} fullWidth type="submit">
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>

        <Link className="mt-5 block text-center text-sm font-medium text-primary hover:underline" to="/login">
          Back to sign in
        </Link>
      </section>
    </main>
  );
};

export default ResetPasswordForm;

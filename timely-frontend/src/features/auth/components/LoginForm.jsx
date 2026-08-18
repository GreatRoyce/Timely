import { useState } from "react";
import Logo from "../../../shared/components/ui/Logo";
import { H5, H3 } from "../../../shared/components/ui/Typography";
import { LockIcon, MailIcon } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import loginImg from "/images/loginImg.png";

const inputDiv = "border rounded-xs flex space-x-2 items-center w-full p-1";
const forInput = "w-full outline-none border-0";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="h-screen ">
      <div className="mx-auto flex mt-16 w-3/5 h-3/4 ">
        {/* left */}
        <div className="h-full bg-gradient-to-r from-primary/20 to-primary-200/20 w-1/2 mx-10 rounded-b-md p-6">
          <div className="flex items-center justify-start">
            <Logo className="h-14" />
            <H5>Timely</H5>
          </div>
          <div className="flex flex-col justify-center space-y-3 pt-4">
            <H3 className="text-4xl text-center leading-9">
              Stay ahead of every task
            </H3>
            <p className="opacity-70 text-lg">
              Built to simplify task management, automate reminders, and help
              small businesses grow with confidence.
            </p>
          </div>
          <div
            className=" h-40 text-shade bg-no-repeat mt-8 mx-auto"
            style={{
              backgroundImage: `url(${loginImg})`,
              backgroundSize: "contain ",
              backgroundPosition: "center",
            }}
          ></div>
        </div>

        {/* right */}
        <div className="h-full w-1/2 p-4 rounded-t-md border-2 border-primary/30 ">
          <div className="items-center justify-center text-center space-y-2 flex flex-col">
            <div className="flex items-center justify-start">
              <Logo className="h-5" />
              <p className="text-sm">Timely</p>
            </div>
            <p>Welcome back</p>
            <p className="text-sm">
              Sign in to continue managing your customer tasks.{" "}
            </p>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-6 justify-start px-2 pt-6"
          >
            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Email Address</p>
              <div className={inputDiv}>
                <MailIcon size={16} className="opacity-60" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  className={forInput}
                  placeholder="abiodunemail@mymail.com"
                />
              </div>
            </div>

            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Password</p>
              <div className={inputDiv}>
                <LockIcon size={16} className="opacity-60" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  className={forInput}
                  placeholder="********"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center pl-1 gap-4 justify-between ">
              <div className="flex space-x-3">
                <input type="checkbox" />
                <p className="opacity-60">Remember me</p>
              </div>
              <Link
                className="text-blue-700 opacity-60 hover:opacity-100"
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex items-center pl-1 gap-4 justify-between ">
              <Button disabled={isSubmitting} variant="primary" type="submit" className="w-full">
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </div>

            <div className="flex items-center pl-1 gap-1 ">
              <p className="opacity-60">Don't have an account?</p>

              <Link to="/register">
                <button className="text-primary hover:opacity-80">
                  Create an Account
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

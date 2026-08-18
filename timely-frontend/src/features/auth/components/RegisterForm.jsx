import { useState } from "react";
import Logo from "../../../shared/components/ui/Logo";
import { H2 } from "../../../shared/components/ui/Typography";
import { MailIcon } from "lucide-react";
import Button from "../../../shared/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaShop } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { PiBell } from "react-icons/pi";
import { MdOutlineDevices } from "react-icons/md";
import { useAuth } from "../../../hooks/useAuth";
import { FaCalendar } from "react-icons/fa";

const inputDiv = "border rounded-xs flex space-x-2 items-center w-full p-1";
const forInput = "w-full outline-none border-0 px-1";

const RegisterForm = () => {
  const [businessName, setBusinessName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = await register({
      businessName,
      fullName,
      email,
      password,
      confirmPassword,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="h-screen ">
      <div className="mx-auto flex mt-16 w-3/5 h-[86vh] ">
        {/* left */}
        <div className="h-full w-1/2 mx-10 rounded-b-md bg-gradient-to-br from-primary-100/40 via-primary/10 to-background p-8 shadow-xl shadow-primary/5">
          {/* Badge */}
          <div className="flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
            <FaShop size={12} />
            <small className="text-sm font-medium">
              Built for Small Businesses
            </small>
          </div>

          {/* Heading */}
          <div className="flex flex-col space-y-4 pt-5">
            <H2 className="leading-10">Start completing every task on time</H2>

            <p className="text-md font-light leading-relaxed opacity-70">
              Join thousands of vendors, tailors, and boutiques managing tasks,
              customers, and deadlines from one simple workspace.
            </p>
          </div>

          {/* Illustration */}
          <div className="relative mx-auto h-80 w-11/12 rounded-xl mt-4 backdrop-blur-sm">
            {/* Today's Tasks */}
            <div className="absolute left-0 top-2 h-20 w-44 -rotate-6 rounded-md border border-white/50 bg-white/70 p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <p className="text-foreground/70">Today's Tasks</p>

                <p className="flex h-6 items-center justify-center rounded-full bg-success px-2 text-xs text-success-foreground">
                  Live
                </p>
              </div>

              <hr className="mb-1 h-2 w-5/6 rounded-md bg-foreground/20" />
              <hr className="h-2 w-2/3 rounded-md bg-foreground/20" />
            </div>

            {/* Upcoming */}
            <div className="absolute left-32 top-24 h-20 w-44 rotate-6 rounded-md border border-white/50 bg-white/70 p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold">
                <p className="text-foreground/70">Upcoming</p>

                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <FaCalendar size={12} />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_4fr] items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-foreground/20" />

                <div className="flex flex-col gap-1">
                  <hr className="h-2 w-5/6 rounded-md bg-foreground/20" />
                  <hr className="h-2 w-2/3 rounded-md bg-foreground/20" />
                </div>
              </div>
            </div>

            {/* Reminder */}
            <div className="absolute left-0 top-48 w-fit -rotate-3 rounded-md border border-white/50 bg-white/70 p-3 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-danger/15 text-danger">
                  <FaBell size={10} />
                </div>

                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">
                    Deadline reminders stay visible
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Automatic task alerts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid absolute items-center justify-between bottom-12 grid-cols-3 gap-6 text-xs">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <PiBell size={18} />
              </div>

              <p className="leading-tight text-foreground">
                Smart Task Reminders
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <TbTruckDelivery size={18} />
              </div>

              <p className="leading-tight text-foreground">
                Fast Task Tracking
              </p>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <MdOutlineDevices size={18} />
              </div>

              <p className="leading-tight text-foreground">Works Everywhere</p>
            </div>
          </div>
        </div>

        {/* right */}
        <div className="h-full w-1/2 p-4 rounded-t-md border-2 border-primary/30 ">
          <div className="items-center justify-center text-center flex flex-col">
            <div className="flex items-center justify-start">
              <Logo className="h-5" />
              <p className="text-primary text-md">Timely</p>
            </div>
            <p>Create your account</p>
            <p className="text-[12px]">
              it only takes a few minutes to get started.
            </p>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2 justify-start px-2 pt-6"
          >
            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Business Name</p>
              <div className={inputDiv}>
                <input
                  type="text"
                  value={businessName}
                  onChange={(event) => {
                    setBusinessName(event.target.value);
                    setError("");
                  }}
                  className={forInput}
                  placeholder="e.g Amber Feetz "
                />
              </div>
            </div>

            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Owner's Full Name</p>
              <div className={inputDiv}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => {
                    setFullName(event.target.value);
                    setError("");
                  }}
                  className={forInput}
                  placeholder="Fabregas Lillian"
                />
              </div>
            </div>

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
                  placeholder="amberfeetz@gmail.com"
                />
              </div>
            </div>

            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Password</p>
              <div className={inputDiv}>
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

            <div className="flex flex-col space-x-1">
              <p className="opacity-60">Confirm Password</p>
              <div className={inputDiv}>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError("");
                  }}
                  className={forInput}
                  placeholder="********"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center pl-1 pt-2 gap-4 justify-between ">
              <Button disabled={isSubmitting} variant="primary" type="submit" className="w-full">
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </div>

            <div className="flex mx-auto pl-1 gap-1 ">
              <p className="opacity-60">Already have an account?</p>

              <Link to="/login">
                <button className="text-primary hover:opacity-80">
                  Sign In
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

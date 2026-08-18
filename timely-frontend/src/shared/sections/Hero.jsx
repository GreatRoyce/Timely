import { ArrowBigRightIcon } from "lucide-react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdOutlineDevices } from "react-icons/md";
import { PiBellSimpleRingingBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import heroBg from "../../assets/images/Hero-Bg.jpg";
import Button from "../components/ui/Button";
import { H1 } from "../components/ui/Typography";

const benefits = [
  { label: "Easy to Use", icon: IoIosCheckmarkCircleOutline },
  { label: "Smart Notifications", icon: PiBellSimpleRingingBold },
  { label: "Mobile & Desktop", icon: MdOutlineDevices },
];

const Hero = () => (
  <section
    className="bg-cover bg-center pt-24 sm:pt-28"
    style={{ backgroundImage: `url(${heroBg})` }}
  >
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8 lg:pb-20">
      <div className="flex flex-col items-start">
        <H1 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Manage Your Time. Delight Your Clients.
        </H1>

        <div className="mt-5 max-w-xl space-y-2 text-lg leading-relaxed text-foreground/75 sm:text-xl">
          <p>Stop juggling notebooks, chats, and forgotten tasks.</p>
          <p>
            Timely brings your tasks, customers, reminders, and deadlines into
            one intelligent workspace, so nothing slips through the cracks.
          </p>
        </div>

        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <Link className="w-full sm:w-auto" to="/register">
            <Button className="w-full px-6 sm:w-auto" rightIcon={ArrowBigRightIcon} size="lg">
              Get Started
            </Button>
          </Link>
          <a className="w-full sm:w-auto" href="#Features">
            <Button className="w-full px-6 sm:w-auto" size="lg" variant="outline">
              Learn More
            </Button>
          </a>
        </div>

        <div className="mt-7 grid w-full grid-cols-1 gap-3 text-md sm:grid-cols-3 sm:gap-4">
          {benefits.map(({ label, icon: Icon }) => (
            <div className="flex items-center gap-2" key={label}>
              <Icon className="shrink-0 text-primary" />
              <p className="text-foreground/80">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/10 p-2 shadow-xl sm:p-3">
        <img
          alt="Timely task management dashboard"
          className="h-auto w-full rounded-lg object-cover"
          src="/images/timely-dashboard.png"
        />
      </div>
    </div>
  </section>
);

export default Hero;

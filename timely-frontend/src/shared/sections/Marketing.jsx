import { H3, H4 } from "../components/ui/Typography";

const Marketing = () => {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
        <H3 className="text-2xl sm:text-3xl">Designed for busy business owners.</H3>
        <H4 className="text-foreground/80 text-lg font-normal mt-2 ">
          A dashboard that gives you a bird-eye view of your entire operation instantly.
        </H4>
      </div>
      <div className="mt-10 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 p-2 shadow-xl sm:p-4">
        <img
          alt="Timely business dashboard overview"
          className="h-auto w-full rounded-md object-cover"
          loading="lazy"
          src="/images/timely-dashboard2.png"
        />
      </div>
      </div>
    </section>
  );
};

export default Marketing;

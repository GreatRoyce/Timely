import { H3, H4 } from "../components/ui/Typography";
import { HowItWorksData } from "../../data/howItWorks";

const HowItWorks = () => {
  return (
    <section id="Howitworks" className="scroll-mt-16 bg-primary/5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <H3 className="text-2xl sm:text-3xl">How It Works</H3>
          <H4 className="text-foreground/80 text-lg font-normal mt-2 ">
            Four steps to absolute order management clarity
          </H4>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HowItWorksData.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.id} className="flex flex-col items-center rounded-md bg-white p-6 text-center shadow-sm">
                <Icon className="text-4xl p-2 border-2 border-primary text-primary rounded-full mb-4" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-md">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

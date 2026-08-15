import { H3, H4 } from "../components/ui/Typography";
import { FeaturesData } from "../../data/features";

const Features = () => {
  return (
    <section id="Features" className="scroll-mt-16 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-4 text-center text-foreground">
        <H3 className="text-2xl sm:text-3xl">Everything you need to stay on schedule</H3>
        <H4 className="text-foreground/80 text-lg font-normal mt-2 ">
          A streamlined toolkit designed specifically to eliminate forgotten
          deadlines and messy order books.
        </H4>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {FeaturesData.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className="hoverfeature rounded-md bg-primary/10 p-5 shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg sm:p-6"
            >
              <Icon className="Icon mb-4 text-4xl border-2 border-primary p-2 rounded-full text-primary" />

              <h3 className=" mb-2 text-xl font-semibold">{feature.title}</h3>

              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};

export default Features;

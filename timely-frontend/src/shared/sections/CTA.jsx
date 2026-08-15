import { H3, H4 } from "../components/ui/Typography";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";


const CTA = () => {
  return (
    <section className="bg-primary/20 px-4 py-14 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 text-center">
        <H3 className="text-2xl sm:text-3xl">Stay ahead of every order</H3>
        <H4 className="text-foreground/80 text-lg font-normal mt-2 ">
          A dashboard that gives you a bird-eye view of your entire operation
          instantly.
        </H4>
        <Link to="/register">
          <Button className="px-6" variant="primary" size="lg">
            Create Your Account
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CTA;

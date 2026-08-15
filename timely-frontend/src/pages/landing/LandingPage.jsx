import Navbar from "../../shared/sections/Navbar";
import Hero from "../../shared/sections/Hero";
import Features from "../../shared/sections/Features";
import HowItWorks from "../../shared/sections/HowItWorks";
import Marketing from "../../shared/sections/Marketing";
import CTA from "../../shared/sections/CTA";
import Footer from "../../shared/sections/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Marketing />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;

import Logo from "../components/ui/Logo";
import { H5 } from "../components/ui/Typography";
import {
  FaCopyright,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const footlinks =
  "opacity-50 hover:opacity-80 cursor-pointer transition-all duration-300";
const headerlinks = "flex flex-col space-y-1";

const Footer = () => {
  return (
    <footer className="pt-14 sm:pt-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[2fr_3fr] lg:px-8">
        {/* first */}
        <div className="flex flex-col">
          <div className="flex items-center justify-start gap-2">
            <Logo className="h-14 w-auto" />
            <H5>Timely</H5>
          </div>
          <p className="max-w-md text-foreground/80">
            Organize orders, manage customers, automate reminders, and deliver
            every order on time.
          </p>
          <div className="mt-4 flex items-center justify-start space-x-6">
            <FaFacebook
              className={`hover:text-blue-500 ${footlinks}`}
              size={20}
            />
            <FaXTwitter className={footlinks} size={20} />
            <FaInstagram
              className={`hover:text-red-700 ${footlinks}`}
              size={20}
            />
            <FaLinkedinIn
              className={`hover:text-blue-700 ${footlinks}`}
              size={20}
            />
          </div>
        </div>
        {/* second */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className={headerlinks}>
            <p>Product</p>
            <a href="#Features" className={footlinks}>
              Features
            </a>
            <a href="#Howitworks" className={footlinks}>
              How it works
            </a>
          </div>
          {/* third */}
          <div className={headerlinks}>
            <p>Resources</p>
            <a href="/faq" className={footlinks}>
              FAQ
            </a>
            <a href="/contact" className={footlinks}>
              Contact
            </a>
            <a href="/support" className={footlinks}>
              Support
            </a>
          </div>
          {/* fourth */}
          <div className={headerlinks}>
            <p>Legal</p>
            <a href="/privacy" className={footlinks}>
              Privacy Policy
            </a>
            <a href="/terms" className={footlinks}>
              Terms and Agreement
            </a>
          </div>
        </div>
      </div>

      <hr className="mx-auto mt-12 w-full max-w-7xl border-gray-300" />
      <div className="flex justify-between items-center">
        <div className="mx-auto flex max-w-7xl items-center justify-start space-x-1 px-4 py-4 opacity-50 sm:px-6 lg:px-8">
          <FaCopyright />
          <small>2026 Timely. All rights reserved.</small>
        </div>
        <p className="opacity-5 text-black/30">Built by Okoh Chukwudi</p>
      </div>
    </footer>
  );
};

export default Footer;

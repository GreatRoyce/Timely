import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { H5 } from "../components/ui/Typography";
import Button from "../components/ui/Button";
import Logo from "../components/ui/Logo";

const navLinkStyle =
  "font-semibold text-muted-foreground transition-colors duration-250 hover:text-foreground";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2" onClick={closeMenu} to="/">
          <Logo className="h-11 w-auto" />
          <H5>Timely</H5>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a className={navLinkStyle} href="#Features">
            Features
          </a>
          <a className={navLinkStyle} href="#Howitworks">
            How It Works
          </a>
          <Link to="/login">
            <Button size="sm" variant="ghost">Log In</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" variant="primary">Get Started</Button>
          </Link>
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="rounded-sm p-2 text-foreground transition-colors hover:bg-muted md:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 shadow-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <a className={`${navLinkStyle} rounded-sm px-2 py-2`} href="#Features" onClick={closeMenu}>
              Features
            </a>
            <a className={`${navLinkStyle} rounded-sm px-2 py-2`} href="#Howitworks" onClick={closeMenu}>
              How It Works
            </a>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link onClick={closeMenu} to="/login">
                <Button fullWidth size="sm" variant="outline">Log In</Button>
              </Link>
              <Link onClick={closeMenu} to="/register">
                <Button fullWidth size="sm" variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

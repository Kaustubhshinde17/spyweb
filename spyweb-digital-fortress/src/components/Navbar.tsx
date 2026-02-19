import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/spyweb-logo.png";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="SPYWEB" className="h-10 w-10 rounded-full" />
          <span className="font-display text-xl font-bold text-primary neon-text">
            SPYWEB
          </span>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <Link 
              to="/client/login"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-300 flex items-center gap-1"
            >
              Login
            </Link>
          </li>
        </ul>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-5 py-2 rounded-md bg-primary text-primary-foreground font-display text-xs font-semibold tracking-wider glow-button"
        >
          Get Started
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-t border-border overflow-hidden"
          >
            <ul className="flex flex-col items-center gap-6 py-8 px-6">
              {navLinks.map((link) => (
                <li key={link.href} className="w-full text-center">
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
               <li className="w-full text-center">
                  <Link
                    to="/client/login"
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-xl font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Client Login
                  </Link>
               </li>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center mt-4 px-6 py-4 rounded-md bg-primary text-primary-foreground font-display text-lg font-semibold tracking-wider hover:bg-primary/90 transition-colors"
              >
                Get Started
              </a>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

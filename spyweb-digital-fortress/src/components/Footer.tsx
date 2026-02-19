import logo from "@/assets/spyweb-logo.png";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-8 md:py-12">
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid sm:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="SPYWEB" className="h-8 w-8 rounded-full" />
            <span className="font-display text-lg font-bold text-primary">SPYWEB</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Secure, smart digital solutions for the modern world.
          </p>
        </div>

        <div>
          <h4 className="font-display text-xs tracking-widest text-foreground uppercase mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {["Home", "Services", "About", "Projects", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-xs tracking-widest text-foreground uppercase mb-4">Services</h4>
          <ul className="space-y-2">
            {["Web Development", "UI/UX Design", "Cyber Security", "Cloud Solutions"].map((s) => (
              <li key={s} className="text-sm text-muted-foreground">{s}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SPYWEB. All rights reserved.
          </p>
          <Link 
            to="/admin/login" 
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
          >
            <Lock size={12} className="group-hover:text-primary transition-colors" />
            <span>Admin Access</span>
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

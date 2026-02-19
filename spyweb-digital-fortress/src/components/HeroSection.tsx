import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden cyber-grid-bg"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10 pt-20 pb-16 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-4 md:mb-6"
        >
          <Shield className="text-primary" size={16} />
          <span className="text-[10px] md:text-xs font-display tracking-[0.3em] text-primary uppercase">
            Digital Security & Solutions
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-4 md:mb-6"
        >
          <span className="text-foreground">Secure. Smart.</span>
          <br />
          <span className="text-primary neon-text">Digital.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg mb-8 md:mb-10 px-4 md:px-0"
        >
          We build cutting-edge digital solutions — from secure web platforms to
          intelligent applications — empowering businesses to thrive in the
          digital era.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md bg-primary text-primary-foreground font-display text-sm font-semibold tracking-wider glow-button transition-transform hover:scale-105"
          >
            Get Started <ArrowRight size={16} />
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-md border border-border text-foreground font-display text-sm font-semibold tracking-wider hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            Our Services
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Zap, Users, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com';

interface AboutData {
  description: string;
  mission: string;
  vision: string;
  values: string;
  leadership: { name: string; role: string }[];
}

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/about`);
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="about" className="py-24 relative cyber-grid-bg">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />
        <div className="container mx-auto px-6 relative z-10 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return null;
  }

  return (
    <section id="about" className="py-16 md:py-24 relative cyber-grid-bg">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-[10px] md:text-xs font-display tracking-[0.3em] text-primary uppercase">Who We Are</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">About SPYWEB</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {aboutData.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6"
          >
            {[
              { icon: Target, title: "Our Mission", text: aboutData.mission },
              { icon: Eye, title: "Our Vision", text: aboutData.vision },
              { icon: Zap, title: "Our Values", text: aboutData.values },
            ].map((item, i) => (
              <div
                key={item.title}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card/50 hover:border-primary/40 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-display text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Leadership Team Section */}
        {aboutData.leadership && aboutData.leadership.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 md:mt-20"
          >
            <div className="text-center mb-8 md:mb-10">
              <span className="text-[10px] md:text-xs font-display tracking-[0.3em] text-primary uppercase">Our Leadership</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold mt-3 text-foreground">Company Ownership</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {aboutData.leadership.map((leader, i) => (
                <motion.div
                  key={leader.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative p-6 rounded-lg border border-border bg-card/50 hover:border-primary/60 hover:bg-card/70 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Users className="text-primary" size={28} />
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-foreground">{leader.name}</h4>
                      <p className="text-sm text-primary font-medium mt-1">{leader.role}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Palette, ShoppingCart, Smartphone, ShieldCheck, Cloud, Shield, Code, Lock, Zap, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Icon mapping for dynamic services
const iconMap: Record<string, any> = {
  Globe,
  Palette,
  ShoppingCart,
  Smartphone,
  ShieldCheck,
  Cloud,
  Shield,
  Code,
  Lock,
  Zap,
};

interface Service {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-[10px] md:text-xs font-display tracking-[0.3em] text-primary uppercase">What We Do</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">Our Services</h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const IconComponent = iconMap[s.icon] || Shield;
              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-300 neon-border-hover cursor-default"
                >
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="text-primary" size={24} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;

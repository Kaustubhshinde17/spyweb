import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com';

interface Project {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
}

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/api/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-[10px] md:text-xs font-display tracking-[0.3em] text-primary uppercase">Our Work</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mt-3 text-foreground">Featured Projects</h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 neon-border-hover"
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-display tracking-widest text-primary uppercase">
                    {p.technologies.slice(0, 2).join(', ')}
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground mt-1 mb-2 flex items-center gap-2">
                    {p.title}
                    <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                  {p.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.technologies.map((tech, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;

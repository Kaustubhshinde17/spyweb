import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  User,
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  Menu,
  MessageSquare,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ClientDashboard = () => {
  const [client, setClient] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/client/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Client Profile
        const profileRes = await fetch(`${API_URL}/api/clients/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileRes.json();
        setClient(profileData);

        // Fetch Client Projects
        const projectsRes = await fetch(`${API_URL}/api/projects/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        localStorage.removeItem("clientToken");
        navigate("/client/login");
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientInfo");
    navigate("/client/login");
    toast({ title: "Logged out", description: "See you soon!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/30 backdrop-blur-sm fixed h-full">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {client?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">{client?.company || 'My Company'}</h2>
            <p className="text-xs text-muted-foreground">Client Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/client/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-md bg-primary/10 text-primary font-medium">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/client/settings" className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group">
            <User size={20} className="group-hover:text-primary transition-colors" />
            Profile Settings
          </Link>
          <Link to="/client/support" className="flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors group">
            <MessageSquare size={20} className="group-hover:text-primary transition-colors" />
            Support
          </Link>
          <div className="px-4 py-3 text-sm text-muted-foreground">
            Projects ({projects.length})
          </div>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center">
        <span className="font-display font-bold text-primary">SPYWEB Client</span>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-20 px-6">
          <nav className="space-y-4">
            <Link to="/client/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 bg-primary/10 rounded-md text-primary">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/client/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 text-muted-foreground hover:bg-secondary rounded-md">
              <User size={20} /> Profile Settings
            </Link>
            <Link to="/client/support" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-3 text-muted-foreground hover:bg-secondary rounded-md">
              <MessageSquare size={20} /> Support
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-destructive w-full">
              <LogOut size={20} /> Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 pt-24 md:p-6 md:pt-6">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
            Hello, {client?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Here's what's happening with your projects today.
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="p-4 md:p-6 rounded-lg bg-card border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-blue-500/10 text-blue-500"><Briefcase size={20} /></div>
              <span className="text-2xl font-bold">{projects.length}</span>
            </div>
            <h3 className="text-muted-foreground text-sm">Active Projects</h3>
          </div>
          <div className="p-4 md:p-6 rounded-lg bg-card border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-yellow-500/10 text-yellow-500"><Clock size={20} /></div>
              <span className="text-2xl font-bold">
                {projects.filter(p => p.status !== 'Completed').length}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm">In Progress</h3>
          </div>
          <div className="p-4 md:p-6 rounded-lg bg-card border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-green-500/10 text-green-500"><CheckCircle size={20} /></div>
              <span className="text-2xl font-bold">
                {projects.filter(p => p.status === 'Completed').length}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm">Completed</h3>
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-display font-bold mb-4 md:mb-6 flex items-center gap-2">
          <LayoutDashboard className="text-primary" size={20} />
          Project Progress
        </h2>

        {projects.length === 0 ? (
          <div className="text-center py-12 md:py-20 border border-dashed border-border rounded-lg bg-card/30">
            <Briefcase className="mx-auto text-muted-foreground mb-4" size={32} />
            <h3 className="text-base md:text-lg font-medium">No Projects Yet</h3>
            <p className="text-sm md:text-base text-muted-foreground px-4">Your assigned projects will appear here once started.</p>
            <Link to="/#contact" className="mt-4 inline-block text-primary hover:underline text-sm md:text-base">Contact Support</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {projects.map((project) => (
              <Link to={`/client/projects/${project._id}`} key={project._id} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 md:p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="pr-2">
                      <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 mt-2 text-[10px] md:text-xs rounded-full
                                    ${project.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                          project.status === 'Planning' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-blue-500/20 text-blue-500'}`}>
                        {project.status || 'Active'}
                      </span>
                    </div>
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold text-primary">{project.progress || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} className="text-[10px] md:text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] md:text-xs px-2 py-1 bg-secondary rounded text-muted-foreground">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ClientDashboard;

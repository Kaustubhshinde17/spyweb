import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Lock, 
  Save, 
  Loader2, 
  ArrowLeft,
  LayoutDashboard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ClientSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      navigate("/client/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/clients/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            company: data.company || "",
            address: data.address || "",
          }));
        } else {
             localStorage.removeItem("clientToken");
             navigate("/client/login");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("clientToken");

    try {
      const response = await fetch(`${API_URL}/api/clients/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            address: formData.address,
            ...(formData.password ? { password: formData.password } : {})
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage if token changed (implied on password change often, but logic in backend re-issues token)
        if (data.token) {
            localStorage.setItem("clientToken", data.token);
            localStorage.setItem("clientInfo", JSON.stringify(data));
        }
        
        toast({ title: "Profile updated", description: "Your changes have been saved." });
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      } else {
        toast({
          title: "Update failed",
          description: data.message || "Could not update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Server error. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden cyber-grid-bg">
       <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />
       
       <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10">
          <div className="max-w-3xl mx-auto">
             <div className="mb-6 md:mb-8 flex items-center justify-between">
                <div>
                    <Link to="/client/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-2 transition-colors text-sm md:text-base">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Profile Settings</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage your account information</p>
                </div>
             </div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/80 backdrop-blur border border-border rounded-lg p-4 md:p-6 shadow-xl"
             >
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Full Name</label>
                           <div className="relative">
                               <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                               <input
                                   type="text"
                                   name="name"
                                   value={formData.name}
                                   onChange={handleChange}
                                   className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                               />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Email Address</label>
                           <div className="relative">
                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                               <input
                                   type="email"
                                   name="email"
                                   value={formData.email}
                                   onChange={handleChange}
                                   className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                               />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Phone Number</label>
                           <div className="relative">
                               <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                               <input
                                   type="text"
                                   name="phone"
                                   value={formData.phone}
                                   onChange={handleChange}
                                   className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                               />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Company Name</label>
                           <div className="relative">
                               <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                               <input
                                   type="text"
                                   name="company"
                                   value={formData.company}
                                   onChange={handleChange}
                                   className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                               />
                           </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                           <label className="text-sm font-medium text-foreground">Address</label>
                           <div className="relative">
                               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                               <input
                                   type="text"
                                   name="address"
                                   value={formData.address}
                                   onChange={handleChange}
                                   className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                                   placeholder="123 Cyber Avenue, Tech City"
                               />
                           </div>
                    </div>

                    <div className="border-t border-border pt-6 mt-6">
                        <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-primary"/> Security
                        </h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-foreground">New Password (Optional)</label>
                               <input
                                   type="password"
                                   name="password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                                   placeholder="Leave blank to keep current"
                                   minLength={6}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                               <input
                                   type="password"
                                   name="confirmPassword"
                                   value={formData.confirmPassword}
                                   onChange={handleChange}
                                   className="w-full px-4 py-3 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground transition-colors text-sm md:text-base"
                                   placeholder="Confirm new password"
                                   minLength={6}
                               />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full md:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Save Changes
                        </button>
                    </div>
                </form>
             </motion.div>
          </div>
       </div>
    </div>
  );
};

export default ClientSettings;

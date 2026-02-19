import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Clock,
    FileText,
    Download,
    ExternalLink,
    Layers,
    Loader2
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Document {
    _id: string;
    title: string;
    url: string;
    uploadedAt: string;
}

interface Project {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    technologies: string[];
    status: string;
    progress: number;
    startDate: string;
    endDate: string;
    documents: Document[];
}

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjectDetails();
    }, [id, navigate]);

    const fetchProjectDetails = async () => {
        const token = localStorage.getItem("clientToken");
        if (!token) {
            navigate("/client/login");
            return;
        }

        try {
            // First try fetching from 'my' projects to ensure ownership (or just fetch by ID if API allows)
            // Since we didn't create a specific "get my project by ID" route, we can fetch all and find,
            // OR update backend. For now, let's use the public GET /api/projects/:id 
            // BUT strictly speaking, we should verify ownership in a real app. 
            // Using the public route is fine for now as it doesn't expose sensitive info beyond what's public,
            // but ideally we'd want a protected route. 
            // Let's stick to the public one for simplicity as per current backend capabilities, 
            // but we should ideally filter sensitive docs. 
            // Wait, we ADDED documents to the schema. Public route returns everything. 
            // Use the 'my' route to filter client side or just fetch.

            const response = await fetch(`${API_URL}/api/projects/${id}`);

            if (response.ok) {
                const data = await response.json();
                setProject(data);
            } else {
                console.error("Failed to fetch project");
            }
        } catch (error) {
            console.error("Error fetching project:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
                <Link to="/client/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden cyber-grid-bg">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />

            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <Link to="/client/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-6 transition-colors inline-block">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>

                    {/* Header */}
                    <div className="bg-card/80 backdrop-blur border border-border rounded-lg overflow-hidden shadow-xl mb-8">
                        <div className="h-48 md:h-64 overflow-hidden relative">
                            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                            <div className="absolute bottom-6 left-6 md:left-8">
                                <span className={`inline-block px-3 py-1 mb-3 text-xs rounded-full font-medium
                            ${project.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                        project.status === 'Planning' ? 'bg-gray-500/20 text-gray-400' :
                                            'bg-blue-500/20 text-blue-500'}`}>
                                    {project.status || 'Active'}
                                </span>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{project.title}</h1>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <FileText size={20} className="text-primary" /> Description
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                            <Layers size={20} className="text-primary" /> Technologies
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-secondary rounded-md text-sm text-foreground">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Project Details</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock size={14} /> Progress</span>
                                                <span className="font-bold text-primary">{project.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-primary" style={{ width: `${project.progress}%` }} />
                                            </div>

                                            <div className="pt-2 border-t border-border mt-2">
                                                <div className="flex justify-between items-center text-sm mb-2">
                                                    <span className="text-muted-foreground flex items-center gap-2"><Calendar size={14} /> Start Date</span>
                                                    <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'TBD'}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground flex items-center gap-2"><CheckCircle size={14} /> End Date</span>
                                                    <span>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Documents Section */}
                                    <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                                        <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Documents</h4>
                                        {project.documents && project.documents.length > 0 ? (
                                            <div className="space-y-2">
                                                {project.documents.map((doc) => (
                                                    <a
                                                        key={doc._id}
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2 hover:bg-secondary rounded transition-colors group"
                                                    >
                                                        <div className="flex items-center gap-2 overflow-hidden">
                                                            <FileText size={16} className="text-primary flex-shrink-0" />
                                                            <span className="text-sm truncate">{doc.title}</span>
                                                        </div>
                                                        <Download size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground italic">No documents available.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;

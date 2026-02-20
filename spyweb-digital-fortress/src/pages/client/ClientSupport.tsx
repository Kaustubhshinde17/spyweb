import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Send,
    MessageSquare,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com';

interface Message {
    _id: string;
    subject: string;
    content: string;
    status: string;
    createdAt: string;
    isAdminReply: boolean;
}

const ClientSupport = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [formData, setFormData] = useState({
        subject: "",
        content: ""
    });

    useEffect(() => {
        fetchMessages();
    }, [navigate]);

    const fetchMessages = async () => {
        const token = localStorage.getItem("clientToken");
        if (!token) {
            navigate("/client/login");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            } else {
                if (response.status === 401) {
                    localStorage.removeItem("clientToken");
                    navigate("/client/login");
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        const token = localStorage.getItem("clientToken");

        try {
            const response = await fetch(`${API_URL}/api/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({ title: "Message sent", description: "Support team will reply shortly." });
                setFormData({ subject: "", content: "" });
                fetchMessages(); // Refresh list
            } else {
                toast({
                    title: "Error",
                    description: "Failed to send message.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden cyber-grid-bg">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--hero-gradient)" }} />

            <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6 md:mb-8">
                        <Link to="/client/dashboard" className="text-muted-foreground hover:text-primary flex items-center gap-2 mb-2 transition-colors text-sm md:text-base">
                            <ArrowLeft size={16} /> Back to Dashboard
                        </Link>
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Client Support</h1>
                                <p className="text-sm md:text-base text-muted-foreground">Contact us for any project-related queries</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* New Message Form */}
                        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-6 shadow-xl h-fit">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Send size={20} className="text-primary" /> New Ticket
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground block mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                                        placeholder="e.g., Update on Project X"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-foreground block mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-2 bg-secondary/50 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground resize-none"
                                        placeholder="Describe your issue or request..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    Submit Ticket
                                </button>
                            </form>
                        </div>

                        {/* Message History */}
                        <div className="bg-card/80 backdrop-blur border border-border rounded-lg p-6 shadow-xl h-[600px] flex flex-col">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MessageSquare size={20} className="text-primary" /> Ticket History
                            </h2>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" size={32} /></div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                                        <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>No support tickets yet.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <motion.div
                                            key={msg._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 rounded-lg bg-secondary/30 border border-border"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-foreground text-sm">{msg.subject}</h3>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${msg.status === 'Resolved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                                    }`}>
                                                    {msg.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{msg.content}</p>
                                            <div className="text-xs text-muted-foreground/50 text-right">
                                                {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSupport;

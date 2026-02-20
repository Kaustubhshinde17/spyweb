import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface Ticket {
    _id: string;
    subject: string;
    content: string;
    status: 'New' | 'In Progress' | 'Resolved';
    createdAt: string;
    client: {
        _id: string;
        name: string;
        email: string;
        company: string;
    };
    adminReply?: string;
    replyDate?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com';

const ManageSupport = () => {
    const { toast } = useToast();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await fetch(`${API_URL}/api/messages/admin/all`);
            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
            toast({
                title: "Error",
                description: "Failed to load support tickets",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!selectedTicket || !reply.trim()) return;

        setSending(true);
        try {
            const response = await fetch(`${API_URL}/api/messages/${selectedTicket._id}/reply`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reply,
                    status: "Resolved"
                }),
            });

            if (response.ok) {
                toast({ title: "Reply sent", description: "Ticket updated and client notified." });
                setReply("");
                setSelectedTicket(null);
                fetchTickets(); // Refresh list
            } else {
                throw new Error("Failed to send reply");
            }
        } catch (error) {
            console.error("Error replying:", error);
            toast({
                title: "Error",
                description: "Failed to send reply",
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-500 hover:bg-blue-600';
            case 'In Progress': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Resolved': return 'bg-green-500 hover:bg-green-600';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-display font-bold">Support Desk</h2>
                <p className="text-muted-foreground mt-1">Manage and resolve client support tickets</p>
            </div>

            <div className="border rounded-lg bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Status</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8">
                                    <Loader2 className="animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket._id}>
                                    <TableCell>
                                        <Badge className={getStatusColor(ticket.status)}>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{ticket.client?.name || 'Unknown'}</span>
                                            <span className="text-xs text-muted-foreground">{ticket.client?.company}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            View / Reply
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Reply Modal */}
            <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Ticket Details</DialogTitle>
                        <DialogDescription>
                            Review the client's issue and send a response.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedTicket && (
                        <div className="space-y-4">
                            <div className="bg-secondary/30 p-4 rounded-lg border">
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-sm">{selectedTicket.client?.name}</span>
                                    <span className="text-xs text-muted-foreground">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                                </div>
                                <h4 className="font-bold mb-2">{selectedTicket.subject}</h4>
                                <p className="text-sm">{selectedTicket.content}</p>
                            </div>

                            {selectedTicket.adminReply && (
                                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                                        <CheckCircle size={14} /> Previous Reply
                                    </div>
                                    <p className="text-sm">{selectedTicket.adminReply}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Sent: {selectedTicket.replyDate ? new Date(selectedTicket.replyDate).toLocaleString() : 'N/A'}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Your Reply</label>
                                <Textarea
                                    placeholder="Type your response here..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    This will resolve the ticket and email the client.
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" onClick={() => setSelectedTicket(null)}>Cancel</Button>
                                <Button onClick={handleReply} disabled={sending || !reply.trim()}>
                                    {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reply & Resolve
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageSupport;

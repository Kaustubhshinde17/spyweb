import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Shield, Code, Smartphone, Cloud, Lock, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface Service {
  _id?: string;
  icon: string;
  title: string;
  description: string;
}

const iconMap: Record<string, any> = {
  Shield,
  Code,
  Smartphone,
  Cloud,
  Lock,
  Zap,
};

const ManageServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({ icon: 'Shield', title: '', description: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentService(null);
    setFormData({ icon: 'Shield', title: '', description: '' });
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentService(service);
    setFormData({ icon: service.icon, title: service.title, description: service.description });
    setDialogOpen(true);
  };

  const handleDelete = (service: Service) => {
    setCurrentService(service);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentService || !currentService._id) return;

    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/services/${currentService._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');

      setServices(services.filter(s => s._id !== currentService._id));
      toast({ title: 'Service deleted successfully' });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
      setCurrentService(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (currentService && currentService._id) {
        // Update existing
        const response = await fetch(`${API_URL}/api/services/${currentService._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update service');

        const updatedService = await response.json();
        setServices(services.map(s => s._id === currentService._id ? updatedService : s));
        toast({ title: 'Service updated successfully' });
      } else {
        // Add new
        const response = await fetch(`${API_URL}/api/services`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to add service');

        const newService = await response.json();
        setServices([...services, newService]);
        toast({ title: 'Service added successfully' });
      }

      setDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save service',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold">Manage Services</h2>
          <p className="text-muted-foreground mt-1">Add, edit, or remove service offerings</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus size={16} className="mr-2" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Services List</CardTitle>
          <CardDescription>All service offerings displayed on the website</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="ml-3 text-muted-foreground">Loading services...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                        No services found
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service, index) => {
                      const IconComponent = iconMap[service.icon] || Shield;
                      return (
                        <motion.tr
                          key={service._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-border"
                        >
                          <TableCell>
                            <IconComponent className="text-primary" size={20} />
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">{service.title}</TableCell>
                          <TableCell className="text-muted-foreground min-w-[200px]">{service.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                                <Pencil size={14} />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(service)}>
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            <DialogDescription>
              {currentService ? 'Update the service details' : 'Create a new service offering'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                className="w-full px-3 py-2 rounded-md border border-input bg-background"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                disabled={saving}
              >
                {Object.keys(iconMap).map(iconName => (
                  <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Service title"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Service description"
                disabled={saving}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{currentService?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={16} />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageServices;

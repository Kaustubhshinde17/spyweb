import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com';

interface AboutData {
  _id?: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
  leadership: { name: string; role: string }[];
}

const ManageAbout = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aboutData, setAboutData] = useState<AboutData>({
    description: '',
    mission: '',
    vision: '',
    values: '',
    leadership: [],
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/about`);
      if (!response.ok) throw new Error('Failed to fetch about data');
      const data = await response.json();
      setAboutData(data);
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load about data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/api/about`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData),
      });

      if (!response.ok) throw new Error('Failed to update about section');

      const updatedData = await response.json();
      setAboutData(updatedData);
      toast({ title: 'About section updated successfully' });
    } catch (error: any) {
      console.error('Error saving about data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLeadershipChange = (index: number, field: 'name' | 'role', value: string) => {
    const newLeadership = [...aboutData.leadership];
    newLeadership[index][field] = value;
    setAboutData({ ...aboutData, leadership: newLeadership });
  };

  const handleAddLeader = () => {
    setAboutData({
      ...aboutData,
      leadership: [...aboutData.leadership, { name: '', role: '' }]
    });
  };

  const handleRemoveLeader = (index: number) => {
    const newLeadership = [...aboutData.leadership];
    newLeadership.splice(index, 1);
    setAboutData({ ...aboutData, leadership: newLeadership });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
        <span className="ml-3 text-muted-foreground">Loading about data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold">Manage About Section</h2>
        <p className="text-muted-foreground mt-1">Update company information and leadership team</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Description</CardTitle>
          <CardDescription>Main description shown in the About section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={aboutData.description}
              onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
              rows={5}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mission, Vision & Values</CardTitle>
          <CardDescription>Core company statements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={aboutData.mission}
              onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
              rows={2}
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={aboutData.vision}
              onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
              rows={2}
              disabled={saving}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="values">Core Values</Label>
            <Textarea
              id="values"
              value={aboutData.values}
              onChange={(e) => setAboutData({ ...aboutData, values: e.target.value })}
              rows={2}
              disabled={saving}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Leadership Team</CardTitle>
            <CardDescription>Company ownership and leadership</CardDescription>
          </div>
          <Button onClick={handleAddLeader} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Leader
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutData.leadership.map((leader, index) => (
            <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-border rounded-lg group">
              <div className="space-y-2">
                <Label htmlFor={`leader-name-${index}`}>Name</Label>
                <Input
                  id={`leader-name-${index}`}
                  value={leader.name}
                  onChange={(e) => handleLeadershipChange(index, 'name', e.target.value)}
                  disabled={saving}
                  placeholder="Enter name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`leader-role-${index}`}>Role</Label>
                <div className="flex gap-2">
                  <Input
                    id={`leader-role-${index}`}
                    value={leader.role}
                    onChange={(e) => handleLeadershipChange(index, 'role', e.target.value)}
                    disabled={saving}
                    placeholder="Enter role (e.g. Founder)"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveLeader(index)}
                    disabled={saving}
                    className="shrink-0"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={16} />
              Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ManageAbout;

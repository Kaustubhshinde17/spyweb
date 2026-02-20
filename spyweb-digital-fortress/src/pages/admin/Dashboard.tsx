import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, FolderKanban, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    {
      title: 'Total Services',
      value: '0',
      icon: Briefcase,
      description: 'Active service offerings',
      color: 'text-blue-500',
    },
    {
      title: 'Total Projects',
      value: '0',
      icon: FolderKanban,
      description: 'Completed projects',
      color: 'text-green-500',
    },
    {
      title: 'Total Clients',
      value: '0',
      icon: Users,
      description: 'Active clients',
      color: 'text-purple-500',
    },
    {
      title: 'Growth Rate',
      value: '+15%', // Placeholder as valid calculation would require historical data
      icon: TrendingUp,
      description: 'Month over month',
      color: 'text-primary',
    },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [servicesRes, projectsRes, clientsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com'}/api/services`),
          fetch(`${import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com'}/api/projects`),
          fetch(`${import.meta.env.VITE_API_URL || 'https://spyweb-3.onrender.com'}/api/clients`)
        ]);

        const services = await servicesRes.json();
        const projects = await projectsRes.json();
        const clients = await clientsRes.json();

        setStats(prev => [
          { ...prev[0], value: services.length.toString() },
          { ...prev[1], value: projects.length.toString() },
          { ...prev[2], value: clients.length.toString() },
          prev[3]
        ]);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Welcome back to SPYWEB Admin Panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={stat.color} size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/admin/clients')}
                className="text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/40 transition-all"
              >
                <p className="font-medium text-sm">Add New Client</p>
                <p className="text-xs text-muted-foreground">Create a new client profile</p>
              </button>
              <button
                onClick={() => navigate('/admin/projects')}
                className="text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/40 transition-all"
              >
                <p className="font-medium text-sm">Add New Project</p>
                <p className="text-xs text-muted-foreground">Showcase your latest work</p>
              </button>
              <button
                onClick={() => navigate('/admin/services')}
                className="text-left p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/40 transition-all"
              >
                <p className="font-medium text-sm">Update Services</p>
                <p className="text-xs text-muted-foreground">Manage service offerings</p>
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Client added', time: '2 hours ago', user: 'Admin' },
                { action: 'Project updated', time: '5 hours ago', user: 'Admin' },
                { action: 'Service modified', time: '1 day ago', user: 'Admin' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time} • by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

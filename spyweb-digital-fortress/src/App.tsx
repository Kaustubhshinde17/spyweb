import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ManageServices from "./pages/admin/ManageServices";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageAbout from "./pages/admin/ManageAbout";
import ManageClients from "./pages/admin/ManageClients";
import ManageContacts from "./pages/admin/ManageContacts";
import ManageSupport from "./pages/admin/ManageSupport";
import ClientLogin from "./pages/client/ClientLogin";
import ClientSignup from "./pages/client/ClientSignup";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientSettings from "./pages/client/ClientSettings";
import ClientSupport from "./pages/client/ClientSupport";
import ProjectDetails from "./pages/client/ProjectDetails";
import ChatWidget from "./components/ChatWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Client Routes */}
            <Route path="/client/login" element={<ClientLogin />} />
            <Route path="/client/signup" element={<ClientSignup />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/settings" element={<ClientSettings />} />
            <Route path="/client/support" element={<ClientSupport />} />
            <Route path="/client/projects/:id" element={<ProjectDetails />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="services" element={<ManageServices />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="about" element={<ManageAbout />} />
              <Route path="clients" element={<ManageClients />} />
              <Route path="contacts" element={<ManageContacts />} />
              <Route path="support" element={<ManageSupport />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ChatWidget />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

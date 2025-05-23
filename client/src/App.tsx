import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import UserProfile from "@/pages/UserProfile";
import Dashboard from "@/pages/DashboardNew";
import NewCampaign from "@/pages/NewCampaign";
import MyCampaigns from "@/pages/MyCampaigns";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { setupGameTables } from "./utils/setupGameTables";

// Componente para redirecionar usuários autenticados para o dashboard
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading && user) {
      setLocation('/dashboard');
    }
  }, [user, isLoading, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // Se já estiver autenticado, não renderiza nada (o redirect acontece no useEffect)
  if (user) {
    return null;
  }
  
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Rotas públicas */}
      <Route path="/">
        <PublicRoute>
          <Home />
        </PublicRoute>
      </Route>
      <Route path="/register">
        <PublicRoute>
          <Register />
        </PublicRoute>
      </Route>
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      
      {/* Rotas protegidas - apenas para criadores */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      </Route>
      
      <Route path="/campaigns/new">
        <ProtectedRoute>
          <NewCampaign />
        </ProtectedRoute>
      </Route>
      
      <Route path="/campaigns/my">
        <ProtectedRoute>
          <MyCampaigns />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Inicializar tabelas do sistema de gamificação quando o aplicativo iniciar
  useEffect(() => {
    setupGameTables()
      .then(success => {
        if (success) {
          console.log('✅ Sistema de gamificação inicializado com sucesso');
        } else {
          console.warn('⚠️ O sistema de gamificação pode não estar totalmente configurado');
        }
      })
      .catch(error => {
        console.error('❌ Erro ao inicializar sistema de gamificação:', error);
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

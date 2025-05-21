import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DetailPage from "@/pages/DetailPage";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import UserProfile from "@/pages/UserProfile";
import { AuthProvider } from "@/components/auth/AuthProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/detalhes/:id" component={DetailPage} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/perfil" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
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

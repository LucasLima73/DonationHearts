import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getCurrentUser, UserData } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: UserData | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user on initial load
    loadUser();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          loadUser();
          toast({
            title: "Login bem-sucedido!",
            description: "Bem-vindo(a) ao MIMO.",
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadUser() {
    setIsLoading(true);
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      const currentUserId = user?.id;
      
      await supabase.auth.signOut();
      setUser(null);
      
      // Limpar dados específicos do usuário do localStorage quando fizer logout
      if (currentUserId) {
        const welcomeShownKey = `doeaqui-welcome-shown-${currentUserId}`;
        localStorage.removeItem(welcomeShownKey);
      }
      
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair da sua conta.",
        variant: "destructive",
      });
    }
  }

  const value = {
    user,
    isLoading,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
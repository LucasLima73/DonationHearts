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
    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          loadUser();

          // Verifica se o toast já foi exibido
          const toastShown = localStorage.getItem("mimo-welcome-toast-shown");
          if (!toastShown) {
            toast({
              title: "Login bem-sucedido!",
              description: "Bem-vindo(a) ao MIMO.",
            });

            // Marca como exibido
            localStorage.setItem("mimo-welcome-toast-shown", "true");
          }

        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("mimo-welcome-toast-shown"); // Limpa ao sair
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
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("mimo-welcome-toast-shown");

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

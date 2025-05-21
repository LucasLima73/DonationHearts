import { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useLocation } from 'wouter';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation(redirectTo);
    }
  }, [user, isLoading, redirectTo, setLocation]);

  // Mostra um loader enquanto verifica a autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada
  // (o redirecionamento acontece no useEffect)
  if (!user) {
    return null;
  }

  // Se estiver autenticado, renderiza os filhos
  return <>{children}</>;
}
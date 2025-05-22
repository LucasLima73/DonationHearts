import { useState } from 'react';
// Importações não usadas removidas
// import { Auth } from '@supabase/auth-ui-react';
// import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupabaseAuthProps {
  redirectTo?: string;
  view?: 'sign_in' | 'sign_up';
  showLinks?: boolean;
}

export default function SupabaseAuth({ 
  redirectTo = '/',
  view = 'sign_in',
  showLinks = true
}: SupabaseAuthProps) {
  const [, setLocation] = useLocation();
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up'>(view);
  
  // Customizar o tema para combinar com nosso design escuro e moderno
  const customTheme = {
    default: {
      colors: {
        brand: 'hsl(var(--primary))',
        brandAccent: 'hsl(var(--secondary))',
        brandButtonText: 'white',
        inputBackground: 'hsla(0, 0%, 100%, 0.05)',
        inputBorder: 'hsla(0, 0%, 100%, 0.1)',
        inputText: 'white',
        inputPlaceholder: 'hsla(0, 0%, 100%, 0.5)',
        messageText: 'hsl(var(--secondary))',
        messageTextDanger: 'hsl(var(--destructive))',
        anchorTextColor: 'hsl(var(--primary))',
        anchorTextHoverColor: 'hsl(var(--primary) / 0.8)',
      },
      space: {
        buttonPadding: '12px 15px',
        inputPadding: '12px 15px',
      },
      borderWidths: {
        buttonBorderWidth: '0px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '8px',
        buttonBorderRadius: '8px',
        inputBorderRadius: '8px',
      },
      fontSizes: {
        baseBodySize: '15px',
        baseInputSize: '15px',
        baseButtonSize: '15px',
      },
      fonts: {
        bodyFontFamily: 'var(--font-body)',
        buttonFontFamily: 'var(--font-heading)',
        inputFontFamily: 'var(--font-body)',
      },
    },
  };

  return (
    <div className="flex flex-col items-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card border-0 neon-border shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                {authView === 'sign_in' ? 'Entre na sua conta' : 'Crie sua conta'}
              </h2>
              <p className="text-sm text-gray-400">
                {authView === 'sign_in' 
                  ? 'Faça login para continuar sua jornada de solidariedade' 
                  : 'Junte-se à comunidade MIMO e comece a fazer a diferença'}
              </p>
            </div>
            
            {/* Botão de login Google */}
            <button
              onClick={() => supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo }
              })}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuar com Google
            </button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-gray-400">ou continue com e-mail</span>
              </div>
            </div>
            
            {/* Formulário de login tradicional - simplificado */}
            {authView === 'sign_in' ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">E-mail</label>
                  <input 
                    id="email" 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">Senha</label>
                    <a href="#" className="text-xs text-primary hover:text-primary/80">Esqueceu a senha?</a>
                  </div>
                  <input 
                    id="password" 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 btn-glow"
                  onClick={() => {
                    const email = (document.getElementById('email') as HTMLInputElement)?.value;
                    const password = (document.getElementById('password') as HTMLInputElement)?.value;
                    
                    if (email && password) {
                      supabase.auth.signInWithPassword({ email, password });
                    }
                  }}
                >
                  Entrar
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Nome</label>
                  <input 
                    id="name" 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-gray-200 mb-1">E-mail</label>
                  <input 
                    id="register-email" 
                    type="email" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-200 mb-1">Senha</label>
                  <input 
                    id="register-password" 
                    type="password" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                <button 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 btn-glow"
                  onClick={() => {
                    const name = (document.getElementById('name') as HTMLInputElement)?.value;
                    const email = (document.getElementById('register-email') as HTMLInputElement)?.value;
                    const password = (document.getElementById('register-password') as HTMLInputElement)?.value;
                    
                    if (email && password) {
                      supabase.auth.signUp({
                        email,
                        password,
                        options: {
                          data: {
                            name
                          }
                        }
                      });
                    }
                  }}
                >
                  Criar conta
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showLinks && (
          <div className="mt-6 text-center border-t border-white/10 pt-6">
            <p className="text-gray-300">
              {authView === 'sign_in' ? (
                <>
                  Não tem uma conta?{" "}
                  <button 
                    onClick={() => setAuthView('sign_up')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem uma conta?{" "}
                  <button 
                    onClick={() => setAuthView('sign_in')}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Entrar
                  </button>
                </>
              )}
            </p>
          </div>
        )}
      </motion.div>
      
      <div className="mt-6 text-center">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/")}
          className="text-gray-300 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para página inicial
        </Button>
      </div>
    </div>
  );
}
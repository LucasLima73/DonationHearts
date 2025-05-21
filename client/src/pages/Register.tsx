import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Eye, EyeOff } from "lucide-react";
import Logo from "@/components/Logo";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nome deve ter pelo menos 3 caracteres",
  }),
  email: z.string().email({
    message: "E-mail inválido",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Registrando usuário:", data.email);
      
      // Registrar usuário no Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Verifique seu email para confirmar o cadastro antes de fazer login.",
        duration: 6000
      });
      
      // Mostrar mensagem de confirmação
      setIsSubmitting(false);
      
      // Criar div com mensagem de verificação de email
      const emailVerificationMessage = document.createElement("div");
      emailVerificationMessage.innerHTML = `
        <div class="mt-6 p-4 rounded-lg bg-blue-500/20 border border-blue-500/30 text-white">
          <h3 class="text-lg font-semibold mb-2">Verifique seu email</h3>
          <p class="text-sm text-gray-200">
            Enviamos um link de confirmação para <strong>${data.email}</strong>.<br>
            Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.
          </p>
        </div>
      `;
      
      // Adicionar mensagem ao DOM
      const formElement = document.querySelector("form");
      if (formElement) {
        formElement.appendChild(emailVerificationMessage);
      }
      
      // Redirecionar para a home após alguns segundos
      setTimeout(() => {
        setLocation("/login");
      }, 8000);
      
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Ocorreu um erro ao tentar criar sua conta. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Helmet>
        <title>Cadastre-se | DoeAqui</title>
        <meta 
          name="description" 
          content="Crie sua conta na plataforma DoeAqui e comece a compartilhar seus sonhos ou ajudar pessoas a realizarem os delas."
        />
      </Helmet>
      
      <div className="min-h-screen relative flex items-center justify-center grid-background">
        {/* Decorative background elements */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/40 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/40 -ml-20 -mb-20"></div>
          <div className="absolute top-1/2 left-1/3 w-60 h-60 blur-[100px] rounded-full bg-accent/30"></div>
        </div>
        
        <div className="container px-4 py-16 md:py-20 relative">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Logo />
            </motion.div>
            
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card border-0 neon-border shadow-2xl rounded-2xl p-8"
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-white">Crie sua conta</h1>
                  <p className="text-gray-300 mt-2">Comece sua jornada de solidariedade</p>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Nome completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu nome" 
                              {...field} 
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-primary/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">E-mail</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Digite seu e-mail" 
                              type="email"
                              {...field} 
                              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-primary/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Digite sua senha" 
                                type={showPassword ? "text" : "password"}
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 pr-10"
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={toggleShowPassword}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Confirmar senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="Confirme sua senha" 
                                type={showConfirmPassword ? "text" : "password"}
                                {...field} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 pr-10"
                              />
                              <button 
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                onClick={toggleShowConfirmPassword}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 btn-glow mt-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Criar conta
                          <Check className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
                
                <div className="mt-6 text-center">
                  <p className="text-gray-300">
                    Já tem uma conta?{" "}
                    <Link href="/login">
                      <a className="text-primary hover:text-primary/80 font-medium">
                        Entrar
                      </a>
                    </Link>
                  </p>
                </div>
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
          </div>
        </div>
      </div>
    </>
  );
}
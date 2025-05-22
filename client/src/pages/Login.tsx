import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Logo from "@/components/Logo";
import SupabaseAuth from "@/components/auth/SupabaseAuth";

export default function Login() {
  const [, setLocation] = useLocation();

  return (
    <>
      <Helmet>
        <title>Entrar | MIMO</title>
        <meta 
          name="description" 
          content="Faça login na plataforma MIMO e continue a sua jornada de solidariedade."
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
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white">Bem-vindo(a) de volta</h1>
                <p className="text-gray-300 mt-2">Acesse sua conta para continuar</p>
              </div>
              
              <SupabaseAuth 
                redirectTo={window.location.origin} 
                view="sign_in" 
                showLinks={true} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
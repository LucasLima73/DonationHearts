import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Trophy, User, LogOut } from "lucide-react";
import Logo from "./Logo";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSignOut = async () => {
    await signOut();
    setLocation("/");
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "glass-panel shadow-lg py-2" : "backdrop-blur-sm bg-black/40 py-3"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo />

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Menu" 
              onClick={toggleMenu}
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/">
              <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium">Início</div>
            </Link>
            <Link href="#how-it-works">
              <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium">Como Funciona</div>
            </Link>
            
            {!user && !isLoading ? (
              <>
                <Link href="/register">
                  <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium">Cadastre-se</div>
                </Link>
                <Link href="/login">
                  <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium">Entrar</div>
                </Link>
              </>
            ) : null}
            
            {user && (
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white font-heading rounded-md btn-glow neon-border"
              >
                <Link href="/dashboard">
                  <div>Dashboard</div>
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 text-primary hover:text-primary/80 hover:bg-primary/10"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center ml-2 gap-2 cursor-pointer group">
                    <Avatar className="h-9 w-9 border-2 border-primary/30 group-hover:border-primary transition-colors duration-200">
                      {user.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user.name || 'Usuário'} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {/* Indicador de gamificação */}
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center -ml-3 -mt-4 border border-background group-hover:bg-primary/20 transition-colors duration-200">
                      <Trophy size={10} className="text-primary" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-card border-0 neon-border shadow-xl">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">{user.name || 'Usuário'}</p>
                      <p className="text-xs leading-none text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 focus:bg-primary/10 focus:text-primary"
                    onClick={() => setLocation("/perfil")}
                  >
                    <Trophy size={16} />
                    <span>Meu Perfil & Conquistas</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 focus:bg-primary/10 focus:text-primary"
                  >
                    <User size={16} />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden py-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-4">
                <Link href="/">
                  <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Início</div>
                </Link>
                <Link href="#explore">
                  <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Explorar</div>
                </Link>
                <Link href="#how-it-works">
                  <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Como Funciona</div>
                </Link>
                
                {!user && !isLoading ? (
                  <>
                    <Link href="/register">
                      <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Cadastre-se</div>
                    </Link>
                    <Link href="/login">
                      <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Entrar</div>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/perfil">
                      <div className="font-heading text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center" onClick={() => setIsMenuOpen(false)}>
                        <Trophy size={16} className="mr-2 text-primary" />
                        Meu Perfil & Conquistas
                      </div>
                    </Link>
                    <div 
                      className="font-heading text-destructive hover:text-destructive/80 transition-colors duration-200 font-medium flex items-center cursor-pointer" 
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sair
                    </div>
                  </>
                )}
                
                <Button 
                  asChild 
                  className="bg-secondary hover:bg-secondary/90 text-white font-heading rounded-md w-full btn-glow" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="#request">
                    <div>Faça seu Pedido</div>
                  </Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

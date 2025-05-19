import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white/90 py-3"}`}>
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
              <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium">Início</a>
            </Link>
            <Link href="#explore">
              <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium">Explorar</a>
            </Link>
            <Link href="#how-it-works">
              <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium">Como Funciona</a>
            </Link>
            <Link href="#register">
              <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium">Cadastre-se</a>
            </Link>
            <Link href="#login">
              <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium">Entrar</a>
            </Link>
            <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-heading rounded-full">
              <Link href="#request">
                <a>Faça seu Pedido</a>
              </Link>
            </Button>
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
                  <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Início</a>
                </Link>
                <Link href="#explore">
                  <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Explorar</a>
                </Link>
                <Link href="#how-it-works">
                  <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Como Funciona</a>
                </Link>
                <Link href="#register">
                  <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Cadastre-se</a>
                </Link>
                <Link href="#login">
                  <a className="font-heading text-foreground hover:text-primary transition duration-200 font-medium" onClick={() => setIsMenuOpen(false)}>Entrar</a>
                </Link>
                <Button asChild className="bg-secondary hover:bg-secondary/90 text-white font-heading rounded-full w-full" onClick={() => setIsMenuOpen(false)}>
                  <Link href="#request">
                    <a>Faça seu Pedido</a>
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

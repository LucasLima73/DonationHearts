import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-24 lg:pt-32 relative overflow-hidden grid-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-10 lg:mb-0 z-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              Crie e gerencie suas <br />
              <span className="text-gradient">campanhas</span> facilmente
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              A plataforma definitiva para criadores de conteúdo gerenciarem suas campanhas de arrecadação. Profissional, intuitiva e completa.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild 
                className="bg-primary hover:bg-primary/90 text-white font-heading rounded-md btn-glow"
                size="lg"
              >
                <Link href="/register">
                  <div className="flex items-center">
                    Comece a Criar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 font-heading rounded-md"
                size="lg"
              >
                <Link href="#how-it-works">
                  <div>Como Funciona</div>
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2 z-10"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative neon-border rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 mix-blend-overlay z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1545911825-6bfa5b0c34a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Mulher feliz celebrando" 
                className="w-full h-auto object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -z-0 top-0 right-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/40 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/40 -ml-20 -mb-20"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 blur-[100px] rounded-full bg-accent/30"></div>
      </div>
    </section>
  );
}

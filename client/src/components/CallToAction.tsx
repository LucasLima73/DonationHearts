import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Star, ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-4.0.3&auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white rounded-full opacity-10"></div>
      <div className="absolute -top-10 -right-10 w-60 h-60 bg-white rounded-full opacity-10"></div>
      <Star className="absolute top-20 left-1/4 text-white opacity-20 w-12 h-12" />
      <Star className="absolute bottom-16 right-1/3 text-white opacity-20 w-8 h-8" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.h2 
          className="font-bold text-3xl md:text-5xl mb-6 text-white"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Realize seu sonho <span className="italic">hoje</span>
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Milhares de pessoas estão prontas para ajudar você a atingir seu próximo objetivo.
          Crie sua história e conecte-se com a nossa comunidade de apoiadores.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            asChild 
            className="bg-white text-primary hover:bg-white/90 font-heading rounded-md shadow-xl btn-glow"
            size="lg"
          >
            <Link href="#request">
              <div className="flex items-center px-6">
                Faça seu Pedido
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white/10 font-heading rounded-md shadow-lg"
            size="lg"
          >
            <Link href="#help">
              <div className="px-6">Quero Ajudar</div>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

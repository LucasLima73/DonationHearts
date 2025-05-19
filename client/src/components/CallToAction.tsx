import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-24 gradient-bg text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2 
          className="font-bold text-3xl md:text-4xl mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Pronto para fazer a diferença?
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Junte-se a milhares de pessoas que estão realizando sonhos e mudando vidas todos os dias.
        </motion.p>
        <motion.div 
          className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            asChild 
            className="bg-white text-primary hover:bg-white/90 font-heading rounded-full"
            size="lg"
          >
            <Link href="#request">
              <a>Faça seu Pedido</a>
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            className="border-2 border-white text-white hover:bg-white hover:text-primary font-heading rounded-full"
            size="lg"
          >
            <Link href="#help">
              <a>Quero Ajudar</a>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

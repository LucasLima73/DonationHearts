import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="pt-24 lg:pt-32 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            className="lg:w-1/2 mb-10 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl leading-tight mb-4">
              Realize sonhos.<br />
              <span className="text-primary">Conecte corações.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Uma plataforma onde pessoas ajudam pessoas, um desejo de cada vez.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                asChild 
                className="bg-secondary hover:bg-secondary/90 text-white font-heading rounded-full"
                size="lg"
              >
                <Link href="#request">
                  <a>Faça seu Pedido</a>
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary hover:text-white font-heading rounded-full"
                size="lg"
              >
                <Link href="#help">
                  <a>Quero Ajudar</a>
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80" 
              alt="Pessoas felizes recebendo presentes" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary -ml-20 -mb-20"></div>
      </div>
    </section>
  );
}

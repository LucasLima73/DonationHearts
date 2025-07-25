import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Camera, Sparkles, Rocket } from "lucide-react";
import { Link } from "wouter";

const steps = [
  {
    id: 1,
    title: "Crie sua campanha",
    description: "Monte sua campanha com fotos, descrição e meta. Nossa interface intuitiva torna o processo simples e rápido.",
    icon: Camera,
    color: "from-primary to-accent"
  },
  {
    id: 2,
    title: "Gerencie tudo em um só lugar",
    description: "Acompanhe doações, analise métricas e mantenha controle total das suas campanhas no dashboard completo.",
    icon: Sparkles,
    color: "from-secondary to-primary"
  },
  {
    id: 3,
    title: "Alcance seus objetivos",
    description: "Use nossas ferramentas de análise e gamificação para otimizar suas campanhas e atingir suas metas.",
    icon: Rocket,
    color: "from-accent to-secondary"
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Como <span className="text-gradient">Funciona</span>
          </motion.h2>
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Três passos simples para gerenciar suas campanhas como um profissional
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="card-hover glass-card text-center h-full border-0 shadow-2xl overflow-hidden neon-border">
                <div className={`h-1 w-full bg-gradient-to-r ${step.color}`}></div>
                <CardContent className="p-8 backdrop-blur-md">
                  <div 
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mx-auto mb-6 transform -translate-y-1 rotate-3`}
                    style={{
                      boxShadow: "0 0 15px rgba(150, 60, 250, 0.4), 0 0 30px rgba(220, 50, 120, 0.2)"
                    }}
                  >
                    <step.icon className="text-white h-10 w-10" />
                  </div>
                  <h3 className="font-bold text-xl mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            asChild
            className="bg-primary hover:bg-primary/90 text-white font-heading rounded-md btn-glow"
            size="lg"
          >
            <Link href="/register">Crie sua conta grátis</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

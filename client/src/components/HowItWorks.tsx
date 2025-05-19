import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Edit, Heart, Smile } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "1. Conte sua história",
    description: "Compartilhe seu pedido conosco, explicando sua necessidade e como a ajuda fará diferença em sua vida.",
    icon: Edit
  },
  {
    id: 2,
    title: "2. Receba doações",
    description: "Pessoas generosas de todo o Brasil conhecerão sua história e poderão contribuir para realizar seu desejo.",
    icon: Heart
  },
  {
    id: 3,
    title: "3. Realize seu sonho",
    description: "Quando a meta for atingida, você receberá o valor para realizar seu desejo e poderá compartilhar sua alegria.",
    icon: Smile
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-neutral">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Como Funciona
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Três passos simples para conectar quem precisa com quem pode ajudar.
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
              <Card className="card-hover text-center bg-white h-full">
                <CardContent className="p-8">
                  <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6">
                    <step.icon className="text-white h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-xl mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
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
            className="bg-primary hover:bg-primary/90 text-white font-heading rounded-full"
            size="lg"
          >
            <a href="#">Comece agora mesmo</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

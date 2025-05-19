import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Story data
const stories = [
  {
    id: 1,
    name: "Ana Silva",
    title: "Material escolar para faculdade",
    image: "https://images.unsplash.com/photo-1517256673644-36ad11246d21?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 750,
    goal: 1000,
    progress: 75,
    story: "Estou prestes a realizar meu sonho de ser a primeira da família a cursar faculdade. Preciso de ajuda com os materiais do curso."
  },
  {
    id: 2,
    name: "Carlos Oliveira",
    title: "Equipamento médico especial",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 1350,
    goal: 3000,
    progress: 45,
    story: "Após 40 anos trabalhando, preciso de um equipamento especial para melhorar minha qualidade de vida que não é coberto pelo plano de saúde."
  },
  {
    id: 3,
    name: "Mariana Costa",
    title: "Tratamento médico especial",
    image: "https://images.unsplash.com/photo-1498940757830-82f7813bf178?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 4250,
    goal: 5000,
    progress: 85,
    story: "Tenho 9 anos e preciso de um tratamento especial que não está disponível na minha cidade. Com sua ajuda, posso ter uma vida normal."
  },
  {
    id: 4,
    name: "Família Rodrigues",
    title: "Reforma emergencial na casa",
    image: "https://images.unsplash.com/photo-1581952976147-5a2d15560349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 2100,
    goal: 6000,
    progress: 35,
    story: "Após as últimas chuvas, nossa casa teve danos estruturais e precisamos de ajuda para fazer reparos urgentes para garantir a segurança dos nossos filhos."
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function InspiringStories() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Histórias que Inspiram
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Conheça algumas pessoas que estão prestes a realizar seus sonhos graças à generosidade da nossa comunidade.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {stories.map((story) => (
            <motion.div key={story.id} variants={item} className="h-full">
              <Card className="story-card card-hover bg-white rounded-xl overflow-hidden relative h-full">
                <img 
                  src={story.image} 
                  alt={`${story.name} buscando apoio para ${story.title}`} 
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-1">{story.name}</h3>
                  <p className="text-gray-600 mb-3">{story.title}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${story.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600">R$ {story.raised} arrecadados</span>
                    <span className="font-medium">{story.progress}%</span>
                  </div>
                  
                  <Button 
                    asChild
                    variant="link" 
                    className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                  >
                    <a href="#">Ajudar {story.name}</a>
                  </Button>
                
                  {/* Overlay that appears on hover */}
                  <div className="story-overlay absolute inset-0 bg-gradient-to-t from-primary/90 to-primary/70 p-6 flex flex-col justify-end text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="mb-4">"{story.story}"</p>
                    <Button 
                      asChild
                      className="bg-white text-primary hover:bg-white/90 rounded-full"
                    >
                      <a href="#">Conheça minha história</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button 
            asChild
            variant="link" 
            className="text-primary text-lg font-medium hover:text-primary/80"
          >
            <a href="#" className="flex items-center">
              Ver todas as histórias
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

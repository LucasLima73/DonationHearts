import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Story data
const stories = [
  {
    id: 1,
    name: "Amanda Oliveira",
    title: "Intercâmbio em Paris",
    image: "https://images.unsplash.com/photo-1541943181603-d8fe267a5dcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 4750,
    goal: 6000,
    progress: 78,
    story: "Ganhei uma bolsa parcial para um intercâmbio em moda na França, mas preciso de ajuda com os custos restantes para realizar meu sonho.",
    highlight: "Tendência",
    featured: true
  },
  {
    id: 2,
    name: "Carla Mendes",
    title: "Ensaio fotográfico profissional",
    image: "https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 1350,
    goal: 2000,
    progress: 67,
    story: "Sou modelo iniciante e preciso de um book profissional para conseguir melhores oportunidades. Ajude-me a dar este passo na minha carreira!",
    highlight: "Novo"
  },
  {
    id: 3,
    name: "Julia Santos",
    title: "Festival de música internacional",
    image: "https://images.unsplash.com/photo-1527736947477-2790e28f3443?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 3250,
    goal: 5000,
    progress: 65,
    story: "Fui convidada para me apresentar em um festival na Europa, uma chance única para minha carreira como cantora. Preciso de ajuda com passagens e estadia.",
    highlight: "Últimos dias"
  },
  {
    id: 4,
    name: "Natália Ferreira",
    title: "Equipamento para estúdio",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 5100,
    goal: 8000,
    progress: 63,
    story: "Estou expandindo meu estúdio de design e preciso de equipamentos novos para atender grandes clientes. Este investimento mudará minha carreira!",
    featured: true
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
    <section className="py-16 md:py-24" id="explore">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-gradient">Inspire-se</span> com Histórias Reais
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Conheça mulheres incríveis que estão transformando seus sonhos em realidade com a ajuda da nossa comunidade.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {stories.map((story) => (
            <motion.div key={story.id} variants={item} className="h-full">
              <Card className="story-card card-hover bg-white rounded-lg overflow-hidden relative h-full border-0 shadow-md group">
                <div className="relative overflow-hidden">
                  <img 
                    src={story.image} 
                    alt={`${story.name} buscando apoio para ${story.title}`} 
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {story.highlight && (
                    <Badge className="absolute top-3 right-3 bg-secondary text-white border-0 font-medium">
                      {story.highlight}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 relative">
                  <h3 className="font-semibold text-lg mb-1">{story.name}</h3>
                  <p className="text-gray-600 mb-3 font-medium">{story.title}</p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                    <div 
                      className={`${story.featured ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-primary'} h-2.5 rounded-full`}
                      style={{ width: `${story.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600">R$ {story.raised} arrecadados</span>
                    <span className="font-medium">{story.progress}%</span>
                  </div>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <Button 
                      asChild
                      variant="link" 
                      className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                    >
                      <div className="flex items-center">
                        Saber mais
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </div>
                    </Button>
                    
                    <Button 
                      asChild
                      variant="ghost" 
                      className="p-0 h-auto font-medium text-secondary hover:text-secondary/80"
                    >
                      <div className="flex items-center">
                        Doar
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </Button>
                  </div>
                
                  {/* Overlay that appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-secondary/90 to-accent/80 p-6 flex flex-col justify-end text-white opacity-0 transition-all duration-300 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0">
                    <p className="mb-4 text-sm">"{story.story}"</p>
                    <Button 
                      asChild
                      className="bg-white text-primary hover:bg-white/90 rounded-md"
                    >
                      <div>Apoiar {story.name.split(' ')[0]}</div>
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
            variant="outline" 
            className="text-primary border-primary hover:bg-primary hover:text-white text-lg font-medium"
          >
            <div className="flex items-center">
              Ver todas as histórias
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}

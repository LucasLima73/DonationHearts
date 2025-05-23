import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Camila Torres",
    role: "Criadora de Conteúdo",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    quote: "O MIMO revolucionou como gerencio minhas campanhas. O dashboard completo e as métricas detalhadas me ajudaram a aumentar minha arrecadação em 300%!",
    stars: 5
  },
  {
    id: 2,
    name: "Mariana Duarte",
    role: "Youtuber",
    image: "https://images.unsplash.com/photo-1619855544858-e05e1e2e9da5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    quote: "Finalmente uma plataforma feita para criadores! As ferramentas de análise e o sistema de gamificação tornaram o processo muito mais profissional e engajante.",
    stars: 5
  },
  {
    id: 3,
    name: "Sofia Lima",
    role: "Streamer",
    image: "https://images.unsplash.com/photo-1598550880863-4e8aa3d0edb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    quote: "Antes eu usava várias plataformas diferentes. Agora centralizo tudo no MIMO - desde a criação até o acompanhamento das campanhas. Simplificou minha vida!",
    stars: 5
  },
  {
    id: 4,
    name: "Larissa Mendonça",
    role: "Podcaster",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80",
    quote: "O suporte do MIMO é excepcional. Eles realmente entendem as necessidades de criadores e estão sempre evoluindo a plataforma baseado no nosso feedback.",
    stars: 5
  }
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    skipSnaps: false
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    
    // Auto-scroll
    const autoplayInterval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (index: number) => emblaApi && emblaApi.scrollTo(index);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden grid-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 mix-blend-overlay"></div>
      
      {/* Decorative blobs */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-[80px] mix-blend-screen"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-[100px] mix-blend-screen"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Criadores <span className="text-gradient">Satisfeitos</span>
          </motion.h2>
          <motion.p 
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Veja como o MIMO está ajudando criadores de conteúdo a profissionalizarem suas campanhas e atingirem seus objetivos.
          </motion.p>
        </div>

        <div className="relative">
          <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div className="flex-[0_0_100%] min-w-0 px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]" key={testimonial.id}>
                  <Card className="card-hover glass-card rounded-xl h-full border-0 shadow-2xl overflow-hidden neon-border">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
                    <CardContent className="p-8 backdrop-blur-md">
                      <Quote className="h-10 w-10 text-secondary/30 mb-4 -ml-1" />
                      <p className="text-gray-200 italic mb-6">"{testimonial.quote}"</p>
                      
                      <div className="flex items-center">
                        <Avatar 
                          className="h-14 w-14 ring-2 ring-secondary/40"
                          style={{
                            boxShadow: "0 0 10px rgba(220, 50, 120, 0.3)"
                          }}
                        >
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <h4 className="font-semibold text-lg text-white">{testimonial.name}</h4>
                          <p className="text-secondary font-medium">{testimonial.role}</p>
                          
                          <div className="flex mt-1">
                            {[...Array(testimonial.stars)].map((_, i) => (
                              <svg 
                                key={i}
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="w-4 h-4 text-yellow-500"
                              >
                                <path 
                                  fillRule="evenodd" 
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                                  clipRule="evenodd" 
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Slider controls */}
          <Button
            onClick={scrollPrev}
            size="icon"
            variant="secondary"
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white shadow-md text-primary z-10 md:left-4 focus:ring-2 focus:ring-primary hover:bg-white/90"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={scrollNext}
            size="icon"
            variant="secondary"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-white shadow-md text-primary z-10 md:right-4 focus:ring-2 focus:ring-primary hover:bg-white/90"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === selectedIndex 
                    ? 'bg-secondary w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => scrollTo(index)}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    id: 1,
    name: "Luísa Mendes",
    role: "Donatária",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Graças ao DoeAqui consegui comprar os equipamentos para iniciar meu pequeno negócio. A generosidade das pessoas mudou completamente minha vida."
  },
  {
    id: 2,
    name: "Roberto Almeida",
    role: "Doador",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Doar através do DoeAqui me permitiu ver o impacto direto da minha contribuição. Receber o agradecimento e ver a alegria das pessoas não tem preço."
  },
  {
    id: 3,
    name: "Carolina Santos",
    role: "Donatária",
    image: "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    quote: "O tratamento médico do meu filho seria impossível sem a ajuda que recebi. Hoje ele está recuperado e feliz, e isso não tem preço. Gratidão eterna!"
  },
  {
    id: 4,
    name: "Pedro Gomes",
    role: "Doador",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80",
    quote: "Como doador regular, posso dizer que o DoeAqui é a plataforma mais transparente que já utilizei. Cada centavo vai realmente para quem precisa."
  }
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
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
            Depoimentos
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Veja o que dizem as pessoas que já participaram da nossa comunidade.
          </motion.p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]" key={testimonial.id}>
                  <Card className="card-hover bg-white rounded-xl h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                          <p className="text-gray-600">{testimonial.role}</p>
                        </div>
                      </div>
                      <Quote className="h-8 w-8 text-primary/20 mb-2" />
                      <p className="text-gray-700">"{testimonial.quote}"</p>
                      <div className="flex mt-4">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5 text-yellow-500"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        ))}
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
            className="absolute top-1/2 left-0 -translate-y-1/2 rounded-full bg-white shadow-md text-primary z-10 md:left-4 focus:ring-2 focus:ring-primary"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button
            onClick={scrollNext}
            size="icon"
            variant="secondary"
            className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full bg-white shadow-md text-primary z-10 md:right-4 focus:ring-2 focus:ring-primary"
            aria-label="Próximo"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${index === selectedIndex ? 'bg-primary' : 'bg-gray-300'}`}
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

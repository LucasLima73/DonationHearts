import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Heart, Share2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Helmet } from "react-helmet";

// Dados simulados da história
const stories = [
  {
    id: "1",
    name: "Amanda Oliveira",
    title: "Intercâmbio em Paris",
    image: "https://images.unsplash.com/photo-1541943181603-d8fe267a5dcf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 4750,
    goal: 6000,
    progress: 78,
    story: "Ganhei uma bolsa parcial para um intercâmbio em moda na França, mas preciso de ajuda com os custos restantes para realizar meu sonho.",
    highlight: "Tendência",
    featured: true,
    fullStory: "Olá! Meu nome é Amanda e sempre sonhei em estudar moda no exterior. Recentemente, ganhei uma bolsa parcial para estudar design de moda em uma das escolas mais renomadas de Paris. Este é um grande passo para minha carreira, mas ainda preciso arrecadar o restante do valor para cobrir hospedagem, transporte e materiais.\n\nEsta oportunidade mudará completamente meu futuro profissional e me permitirá trazer novas técnicas e conhecimentos para o Brasil. Qualquer ajuda será fundamental para tornar este sonho realidade!",
    galleryImages: [
      "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1534126511673-b6899657816a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    ]
  },
  {
    id: "2",
    name: "Carla Mendes",
    title: "Ensaio fotográfico profissional",
    image: "https://images.unsplash.com/photo-1541845157-a6d2d100c931?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 1350,
    goal: 2000,
    progress: 67,
    story: "Sou modelo iniciante e preciso de um book profissional para conseguir melhores oportunidades. Ajude-me a dar este passo na minha carreira!",
    highlight: "Novo",
    fullStory: "Meu nome é Carla e sou modelo há 1 ano. Para avançar na minha carreira e conseguir contratos com agências maiores, preciso de um portfólio profissional de alta qualidade. Este investimento é fundamental para me destacar em um mercado tão competitivo.\n\nCom sua ajuda, poderei contratar um fotógrafo renomado, alugar estúdio e produção completa para criar imagens que realmente mostrem meu potencial. Cada contribuição me aproxima mais de realizar este sonho e abrir portas para oportunidades incríveis!",
    galleryImages: [
      "https://images.unsplash.com/photo-1596902852634-c81c1e733e59?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1564022683952-7ad3908e3245?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1630016492102-8e105f5b570a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    ]
  },
  {
    id: "3",
    name: "Julia Santos",
    title: "Festival de música internacional",
    image: "https://images.unsplash.com/photo-1527736947477-2790e28f3443?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 3250,
    goal: 5000,
    progress: 65,
    story: "Fui convidada para me apresentar em um festival na Europa, uma chance única para minha carreira como cantora. Preciso de ajuda com passagens e estadia.",
    highlight: "Últimos dias",
    fullStory: "Olá! Sou Julia, cantora independente, e recebi um convite incrível para me apresentar em um festival de música alternativa na Europa. Esta é uma oportunidade única que pode abrir muitas portas para minha carreira internacional.\n\nPreciso arrecadar fundos para passagem aérea, hospedagem e transporte de equipamentos. Sua contribuição não apenas me ajudará a participar deste evento importante, mas também representará a música brasileira em um palco internacional. Serei eternamente grata por qualquer apoio nessa jornada!",
    galleryImages: [
      "https://images.unsplash.com/photo-1501364766547-d2db565ca8bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1496449903678-68ddcb189a24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    ]
  },
  {
    id: "4",
    name: "Natália Ferreira",
    title: "Equipamento para estúdio",
    image: "https://images.unsplash.com/photo-1547153760-18fc86324498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
    raised: 5100,
    goal: 8000,
    progress: 63,
    story: "Estou expandindo meu estúdio de design e preciso de equipamentos novos para atender grandes clientes. Este investimento mudará minha carreira!",
    featured: true,
    fullStory: "Sou Natália, designer gráfica com 5 anos de experiência, e finalmente abri meu próprio estúdio! Para poder atender clientes maiores e oferecer serviços de alta qualidade, preciso investir em equipamentos profissionais como um computador potente, tablet gráfico de última geração e softwares especializados.\n\nEste investimento é essencial para o crescimento do meu negócio e me permitirá contratar assistentes, multiplicando o impacto positivo dessa contribuição. Cada pessoa que apoia este sonho se torna parte da construção de uma empresa criativa com potencial para transformar o mercado de design no Brasil.",
    galleryImages: [
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1487611459768-bd414656ea10?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80"
    ]
  }
];

export default function DetailPage() {
  const [location, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const storyId = params.id;
  
  // Encontrar a história com base no ID
  const story = stories.find(s => s.id === storyId);
  
  const [donationAmount, setDonationAmount] = useState(50);
  const [selectedTab, setSelectedTab] = useState<"historia" | "galeria">("historia");
  
  // Se a história não for encontrada
  if (!story) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold">História não encontrada</h1>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
        </Button>
      </div>
    );
  }

  const handleDonationClick = (value: number) => {
    setDonationAmount(value);
  };

  return (
    <>
      <Helmet>
        <title>{story.name} - {story.title} | DoeAqui</title>
        <meta 
          name="description" 
          content={`Ajude ${story.name} a ${story.title}. ${story.story}`}
        />
      </Helmet>
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Botão voltar */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="text-primary hover:text-primary/80 hover:bg-primary/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a página inicial
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Coluna da esquerda - Foto e Informações */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Imagem principal */}
              <div className="relative h-80 lg:h-96 w-full">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                />
                {story.highlight && (
                  <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {story.highlight}
                  </div>
                )}
              </div>
              
              {/* Informações principais */}
              <div className="p-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{story.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{story.name}</p>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Progresso */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">R$ {story.raised} arrecadados</span>
                    <span className="text-secondary font-medium">{story.progress}%</span>
                  </div>
                  <Progress 
                    value={story.progress} 
                    className="h-2 bg-gray-100" 
                    indicatorClassName={story.featured ? "bg-gradient-to-r from-primary to-secondary" : "bg-primary"}
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Meta: R$ {story.goal}
                  </div>
                </div>
                
                {/* Botões de ação */}
                <div className="flex space-x-3 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-200 hover:bg-gray-50"
                  >
                    <Heart className="mr-1.5 h-4 w-4" /> Salvar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-gray-200 hover:bg-gray-50"
                  >
                    <Share2 className="mr-1.5 h-4 w-4" /> Compartilhar
                  </Button>
                </div>
                
                {/* Navegação entre abas */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-6">
                    <button 
                      className={`pb-3 font-medium ${selectedTab === "historia" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-900"}`}
                      onClick={() => setSelectedTab("historia")}
                    >
                      História
                    </button>
                    <button 
                      className={`pb-3 font-medium ${selectedTab === "galeria" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-900"}`}
                      onClick={() => setSelectedTab("galeria")}
                    >
                      Galeria
                    </button>
                  </div>
                </div>
                
                {/* Conteúdo da aba */}
                <div>
                  {selectedTab === "historia" ? (
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line">{story.fullStory}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {story.galleryImages.map((img, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt={`${story.name} - imagem ${index + 1}`} 
                            className="w-full h-60 object-cover transition-all hover:scale-105 duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Doação */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold mb-6">Faça sua doação</h2>
              
              {/* Valores pré-definidos */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[20, 50, 100].map((value) => (
                  <Button 
                    key={value}
                    variant={donationAmount === value ? "default" : "outline"}
                    className={`${donationAmount === value ? "bg-secondary hover:bg-secondary/90" : "border-gray-200"} rounded-md h-14`}
                    onClick={() => handleDonationClick(value)}
                  >
                    R$ {value}
                  </Button>
                ))}
              </div>
              
              {/* Valor customizado */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Outro valor</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    R$
                  </span>
                  <input 
                    type="number" 
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    min={10}
                  />
                </div>
              </div>
              
              {/* Botão de doação */}
              <Button 
                className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-medium rounded-md btn-glow"
              >
                <DollarSign className="mr-2 h-5 w-5" /> Doar R$ {donationAmount}
              </Button>
              
              {/* Informações adicionais */}
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2">✓ Pagamento 100% seguro</p>
                <p className="mb-2">✓ Recebemos todos os cartões de crédito</p>
                <p>✓ Também aceitamos Pix</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
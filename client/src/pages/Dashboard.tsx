import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserLevel } from '@/components/gamification/UserLevel';
import { Link } from 'wouter';
import { 
  HeartIcon, 
  Award, 
  User, 
  Calendar, 
  TrendingUp,
  Search,
  History,
  Filter,
  ChevronRight,
  PlusCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AchievementUnlock } from '@/components/gamification/AchievementUnlock';
import { predefinedAchievements } from '@shared/achievements';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { OnboardingController } from '@/components/onboarding/OnboardingController';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideDonationValues, setHideDonationValues] = useState(false);
  const [hideCampaignValues, setHideCampaignValues] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Para demonstração do tour de onboarding
  const resetOnboarding = () => {
    localStorage.removeItem('doeaqui-onboarding-completed');
    localStorage.removeItem('doeaqui-onboarding-dismissed');
    window.location.reload();
  };
  
  // Toggle para mostrar/esconder valores de doações
  const toggleHideDonationValues = () => {
    setHideDonationValues(!hideDonationValues);
  };
  
  // Toggle para mostrar/esconder valores de campanhas
  const toggleHideCampaignValues = () => {
    setHideCampaignValues(!hideCampaignValues);
  };
  
  // Verificar se é a primeira vez do usuário e mostrar mensagem de boas-vindas
  useEffect(() => {
    if (!isLoading && user) {
      // Verificar se é a primeira visita do usuário
      const isFirstVisit = localStorage.getItem(`doeaqui-user-welcomed-${user.id}`) === null;
      
      if (isFirstVisit) {
        console.log("Primeira visita do usuário:", user.name || user.email);
        setIsFirstTimeUser(true);
        setShowWelcomeMessage(true);
        
        // Marcar que o usuário já recebeu as boas-vindas
        localStorage.setItem(`doeaqui-user-welcomed-${user.id}`, 'true');
      }
    }
  }, [user, isLoading]);
  
  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [user, isLoading, setLocation]);
  
  // Dados simulados para demonstração
  const mockUserPoints = 750;
  const mockDonationCount = 8;
  const mockTotalDonated = 1250;
  const mockTotalReceived = 2750;
  const mockReceivedDonationCount = 12;
  
  // Campanhas recentes de exemplo
  const recentCampaigns = [
    {
      id: 1,
      title: "Ajude Maria a custear seu tratamento",
      category: "Saúde",
      imageUrl: "https://images.unsplash.com/photo-1579154392429-40ce9a4ff5e7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGF0aWVudHxlbnwwfHwwfHx8MA%3D%3D",
      progress: 75,
      goal: 5000,
      raised: 3750,
      daysLeft: 12
    },
    {
      id: 2,
      title: "Abrigo para animais abandonados",
      category: "Animais",
      imageUrl: "https://images.unsplash.com/photo-1593871075120-982e042088d8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9nJTIwcmVzY3VlfGVufDB8fDB8fHww",
      progress: 45,
      goal: 10000,
      raised: 4500,
      daysLeft: 20
    },
    {
      id: 3,
      title: "Reformar casa da Dona Joana",
      category: "Moradia",
      imageUrl: "https://images.unsplash.com/photo-1607247098789-5c8945a84268?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9tZSUyMHJlcGFpcnxlbnwwfHwwfHx8MA%3D%3D",
      progress: 60,
      goal: 7000,
      raised: 4200,
      daysLeft: 8
    }
  ];
  
  // Histórico de atividades
  const activityHistory = [
    { 
      id: 1, 
      type: 'donation', 
      description: 'Você doou R$150 para "Ajude Maria a custear seu tratamento"', 
      points: 30, 
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 horas atrás
    },
    { 
      id: 2, 
      type: 'achievement', 
      description: 'Você desbloqueou a conquista "Coração Generoso"', 
      points: 50, 
      date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 horas atrás
    },
    { 
      id: 3, 
      type: 'sharing', 
      description: 'Você compartilhou a campanha "Abrigo para animais abandonados"', 
      points: 10, 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 dia atrás
    }
  ];
  
  // Para demonstração - mostra uma conquista após 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewAchievement(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return null; // Redirecionamento já acontece no useEffect

  return (
    <>
      <Helmet>
        <title>Área do Doador | DoeAqui</title>
        <meta 
          name="description" 
          content="Sua área pessoal na plataforma DoeAqui. Gerencie suas doações, acompanhe seu progresso e conquistas."
        />
      </Helmet>
      
      {/* Controlador do tour de onboarding */}
      <OnboardingController />
      
      {/* Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar */}
      <div id="sidebar-nav">
        <DashboardSidebar sidebarOpen={sidebarOpen} />
      </div>
      
      {/* Main Content */}
      <div className="min-h-screen grid-background pt-16 w-full">
        {/* Efeitos de background */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
        </div>
        
        <div className="lg:pl-64 transition-all duration-300">
          <div className="container mx-auto w-full max-w-[1200px] px-4 py-8">
            
            {/* Mensagem de boas-vindas personalizada para primeira visita */}
            {showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="mb-8 glass-card border border-primary/20 rounded-xl p-6 relative overflow-hidden"
              >
                {/* Fundo decorativo */}
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-secondary/10 blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/30 text-white p-3 rounded-lg">
                      <Award className="w-8 h-8" />
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                        Bem-vindo(a) ao DoeAqui, {user?.name || 'amigo(a)'}!
                      </h2>
                      <p className="text-gray-300 mb-3">
                        É com grande alegria que recebemos você em nossa plataforma. Sua jornada de solidariedade começa agora!
                      </p>
                      <div className="text-sm text-gray-300 mb-4">
                        <ul className="space-y-1">
                          <li className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-primary mr-1" />
                            Crie sua primeira campanha ou faça uma doação
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-primary mr-1" />
                            Acompanhe o impacto das suas ações
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-primary mr-1" />
                            Ganhe conquistas e suba de nível
                          </li>
                        </ul>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={() => setShowWelcomeMessage(false)}
                          className="bg-gradient-to-r from-primary to-secondary hover:brightness-110 text-white"
                        >
                          Entendi, vamos começar!
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Cabeçalho de boas-vindas padrão */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
              id="dashboard-welcome"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Olá, {user?.name || 'Doador'}! 👋
              </h1>
              <p className="text-gray-300">
                {isFirstTimeUser 
                  ? "Vamos começar sua jornada de solidariedade! Explore as opções abaixo."
                  : "Bem-vindo(a) de volta à sua área pessoal. Continue sua jornada de solidariedade!"
                }
              </p>
            </motion.div>
            
            {/* Cards de estatísticas */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4" id="donations-made-section">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Minhas Doações</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleHideDonationValues}
                    className="h-8 w-8 p-0 hover:bg-white/5"
                    title={hideDonationValues ? "Mostrar valores" : "Esconder valores"}
                  >
                    {hideDonationValues ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </Button>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
              >
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total de Pontos</p>
                      <h3 className="text-2xl font-bold text-white">{mockUserPoints}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-primary/20 text-primary hover:bg-primary/10"
                      onClick={() => setLocation('/perfil')}
                    >
                      Ver conquistas
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Doações Realizadas</p>
                      <h3 className="text-2xl font-bold text-white">{mockDonationCount}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <HeartIcon className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-secondary/20 text-secondary hover:bg-secondary/10"
                    >
                      Ver histórico
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Doado</p>
                      <h3 className="text-2xl font-bold text-white">
                        {hideDonationValues ? 
                          "R$ ••••••" : 
                          `R$ ${mockTotalDonated.toFixed(2)}`
                        }
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-accent/20 text-accent hover:bg-accent/10"
                    >
                      Ver impacto
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex items-center justify-between mb-4" id="campaigns-created-section">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">Minhas Campanhas</h2>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleHideCampaignValues}
                    className="h-8 w-8 p-0 hover:bg-white/5"
                    title={hideCampaignValues ? "Mostrar valores" : "Esconder valores"}
                  >
                    {hideCampaignValues ? 
                      <EyeOff className="h-4 w-4 text-gray-400" /> : 
                      <Eye className="h-4 w-4 text-gray-400" />
                    }
                  </Button>
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
              >
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Campanhas Criadas</p>
                      <h3 className="text-2xl font-bold text-white">3</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-green-500/20 text-green-500 hover:bg-green-500/10"
                    >
                      Gerenciar campanhas
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Doações Recebidas</p>
                      <h3 className="text-2xl font-bold text-white">{mockReceivedDonationCount}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-purple-500/20 text-purple-500 hover:bg-purple-500/10"
                    >
                      Ver doadores
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Recebido</p>
                      <h3 className="text-2xl font-bold text-white">
                        {hideCampaignValues ? 
                          "R$ ••••••" : 
                          `R$ ${mockTotalReceived.toFixed(2)}`
                        }
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-blue-500/20 text-blue-500 hover:bg-blue-500/10"
                    >
                      Ver detalhes
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Progresso de nível */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
              id="achievements-section"
            >
              <UserLevel totalPoints={mockUserPoints} />
            </motion.div>
            
            {/* Botão de criar campanha */}
            <div className="mb-6 flex justify-end">
              <Button 
                id="create-campaign-button"
                variant="default" 
                size="default"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setLocation('/nova-campanha')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            </div>
              
            {/* Abas de conteúdo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Tabs defaultValue="campaigns" className="w-full">
                <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-3 bg-transparent">
                  <TabsTrigger 
                    value="campaigns" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md data-[state=active]:shadow-none"
                  >
                    <Calendar size={16} className="mr-2" />
                    Campanhas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="activity" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md data-[state=active]:shadow-none"
                  >
                    <History size={16} className="mr-2" />
                    Atividades
                  </TabsTrigger>
                  <TabsTrigger 
                    value="explore" 
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md data-[state=active]:shadow-none"
                  >
                    <Search size={16} className="mr-2" />
                    Explorar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="campaigns" className="mt-0">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Campanhas em Andamento</h2>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <Filter size={14} />
                      Filtrar
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentCampaigns.map((campaign) => (
                      <div key={campaign.id} className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                        <div className="relative h-48">
                          <img 
                            src={campaign.imageUrl} 
                            alt={campaign.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {campaign.category}
                          </div>
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {campaign.title}
                          </h3>
                          
                          <div className="mt-3 mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Progresso</span>
                              <span className="text-primary font-medium">{campaign.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${campaign.progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                              <span className="text-gray-400">
                                {hideCampaignValues 
                                  ? "R$ •••••" 
                                  : `R$ ${campaign.raised.toLocaleString('pt-BR')}`
                                }
                              </span>
                              <span className="text-gray-400">
                                {hideCampaignValues 
                                  ? "R$ •••••" 
                                  : `R$ ${campaign.goal.toLocaleString('pt-BR')}`
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="text-xs text-gray-400">
                              {campaign.daysLeft} dias restantes
                            </div>
                            <Button 
                              asChild 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 font-medium"
                            >
                              <Link href={`/detalhes/${campaign.id}`}>
                                <div>Ajudar</div>
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      className="border-white/10 hover:bg-white/5"
                    >
                      Ver todas as campanhas
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="activity" className="mt-0">
                  <h2 className="text-xl font-bold text-white mb-4">Histórico de Atividades</h2>
                  
                  <div className="space-y-4">
                    {activityHistory.map((activity) => (
                      <div 
                        key={activity.id}
                        className="glass-card p-4 rounded-xl border border-white/5 flex items-center gap-4"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'donation' ? 'bg-primary/20 text-primary' :
                          activity.type === 'achievement' ? 'bg-secondary/20 text-secondary' :
                          'bg-accent/20 text-accent'
                        }`}>
                          {activity.type === 'donation' ? <HeartIcon size={18} /> :
                           activity.type === 'achievement' ? <Award size={18} /> :
                           <User size={18} />}
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white">{activity.description}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(activity.date).toLocaleString('pt-BR', { 
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-primary font-medium">+{activity.points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline" 
                      className="border-white/10 hover:bg-white/5"
                    >
                      Ver histórico completo
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="explore" className="mt-0">
                  <div className="glass-card p-8 rounded-xl border border-white/5 text-center">
                    <Search className="w-16 h-16 mx-auto mb-4 text-primary opacity-40" />
                    <h3 className="text-xl font-bold text-white mb-2">Encontre causas para apoiar</h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Busque campanhas por categoria, localização ou palavras-chave para 
                      encontrar causas que combinam com seus valores e interesses.
                    </p>
                    
                    <div className="flex gap-4 flex-wrap justify-center">
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Saúde
                      </Button>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Educação
                      </Button>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Animais
                      </Button>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Meio Ambiente
                      </Button>
                      <Button variant="outline" className="border-white/10 hover:bg-white/5">
                        Pessoas Vulneráveis
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Modal de conquista desbloqueada - apenas demonstração */}
      {showNewAchievement && (
        <AchievementUnlock 
          achievement={predefinedAchievements[2]} // "Coração Generoso"
          onClose={() => setShowNewAchievement(false)}
        />
      )}
    </>
  );
}
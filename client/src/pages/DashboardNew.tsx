import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLocation } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserLevel } from '@/components/gamification/UserLevel';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';
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
  EyeOff,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AchievementUnlock } from '@/components/gamification/AchievementUnlock';
import { predefinedAchievements } from '@shared/achievements';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { OnboardingController } from '@/components/onboarding/OnboardingController';
import { CreatorAnalytics } from '@/components/dashboard/CreatorAnalytics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentCampaigns } from '@/components/dashboard/RecentCampaigns';

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showNewAchievement, setShowNewAchievement] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hideDonationValues, setHideDonationValues] = useState(false);
  const [hideCampaignValues, setHideCampaignValues] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Estados para armazenar os dados reais
  const [userPoints, setUserPoints] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [receivedDonationCount, setReceivedDonationCount] = useState(0);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
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
    if (!isLoading && user?.id) {
      const welcomeKey = `doeaqui-user-welcomed-${user.id}`;
      const hasBeenWelcomed = localStorage.getItem(welcomeKey);
      
      if (hasBeenWelcomed === null) {
        setIsFirstTimeUser(true);
        setShowWelcomeMessage(true);
        // Marcar que o usuário já foi recebido
        localStorage.setItem(welcomeKey, 'true');
      } else {
        setIsFirstTimeUser(false);
        setShowWelcomeMessage(false);
      }
    }
  }, [user?.id, isLoading]);
  
  // Carregar dados reais de doações
  useEffect(() => {
    if (!isLoading && user) {
      const fetchDonationStats = async () => {
        setIsLoadingStats(true);
        try {
          // 1. Buscar total doado pelo usuário
          const { data: userDonations, error: donationsError } = await supabase
            .from('donations')
            .select('amount')
            .eq('user_id', user.id);
          
          if (donationsError) throw donationsError;
          
          // Calcular total doado e contagem de doações
          let totalAmount = 0;
          if (userDonations && userDonations.length > 0) {
            totalAmount = userDonations.reduce((sum: number, donation: any) => sum + donation.amount, 0);
          }
          setTotalDonated(totalAmount);
          setDonationCount(userDonations ? userDonations.length : 0);
          
          // 2. Buscar campanhas do usuário
          const { data: userCampaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id, raised')
            .eq('user_id', user.id);
          
          if (campaignsError) throw campaignsError;
          
          // 3. Para cada campanha, buscar doações recebidas
          let totalRaised = 0;
          let totalDonationsReceived = 0;
          
          if (userCampaigns && userCampaigns.length > 0) {
            // Somar os valores arrecadados de todas as campanhas do usuário
            totalRaised = userCampaigns.reduce((sum: number, campaign: any) => sum + (campaign.raised || 0), 0);
            
            // Contar o número total de doações recebidas
            const campaignIds = userCampaigns.map((campaign: any) => campaign.id);
            if (campaignIds.length > 0) {
              const { data: receivedDonations, error: receivedError } = await supabase
                .from('donations')
                .select('id')
                .in('campaign_id', campaignIds);
              
              if (!receivedError && receivedDonations) {
                totalDonationsReceived = receivedDonations.length;
              }
            }
          }
          
          setTotalReceived(totalRaised);
          setReceivedDonationCount(totalDonationsReceived);
          
          // 4. Definir pontos do usuário (podemos calcular baseado em atividades)
          const userPointsValue = totalDonationsReceived * 20 + (userDonations ? userDonations.length : 0) * 50;
          setUserPoints(userPointsValue);
          
        } catch (err) {
          console.error('Erro ao carregar estatísticas:', err);
        } finally {
          setIsLoadingStats(false);
        }
      };
      
      fetchDonationStats();
    }
  }, [user, isLoading]);
  
  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
    }
  }, [user, isLoading, setLocation]);
  
  // Campanhas recentes de exemplo

  
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
                      <h3 className="text-2xl font-bold text-white">
                        {isLoadingStats ? "-" : userPoints}
                      </h3>
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
                      <h3 className="text-2xl font-bold text-white">
                        {isLoadingStats ? "-" : donationCount}
                      </h3>
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
                        {isLoadingStats ? "-" : (
                          hideDonationValues ? 
                          "R$ ••••••" : 
                          `R$ ${totalDonated.toFixed(2)}`
                        )}
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
                <Button 
                  onClick={() => setLocation('/campanhas/nova')}
                  className="bg-gradient-to-r from-primary to-secondary hover:brightness-110"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
              >
                <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Doações Recebidas</p>
                      <h3 className="text-2xl font-bold text-white">
                        {isLoadingStats ? "-" : receivedDonationCount}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <HeartIcon className="h-6 w-6 text-purple-500" />
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
                        {isLoadingStats ? "-" : (
                          hideCampaignValues ? 
                          "R$ ••••••" : 
                          `R$ ${totalReceived.toFixed(2)}`
                        )}
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
            
            {/* Tabs de Campanhas e Atividades */}
            <Tabs defaultValue="campaigns" className="w-full">
              <TabsList className="mb-4 grid grid-cols-3 max-w-md glass-card rounded-lg border border-white/5">
                <TabsTrigger value="campaigns">
                  <Calendar className="w-4 h-4 mr-2" />
                  Campanhas
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-2" />
                  Atividades
                </TabsTrigger>
                <TabsTrigger value="search">
                  <Search className="w-4 h-4 mr-2" />
                  Descobrir
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="campaigns" className="space-y-4">
                <RecentCampaigns />
              </TabsContent>
              
              <TabsContent value="history" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Histórico de Atividades</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/10 hover:bg-white/5"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {activityHistory.map((activity) => (
                    <div 
                      key={activity.id}
                      className="glass-card p-4 rounded-xl border border-white/5 flex items-start gap-3"
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center shrink-0
                        ${activity.type === 'donation' ? 'bg-secondary/20' : ''}
                        ${activity.type === 'achievement' ? 'bg-primary/20' : ''}
                        ${activity.type === 'sharing' ? 'bg-blue-500/20' : ''}
                      `}>
                        {activity.type === 'donation' && <HeartIcon className="w-5 h-5 text-secondary" />}
                        {activity.type === 'achievement' && <Award className="w-5 h-5 text-primary" />}
                        {activity.type === 'sharing' && <Share className="w-5 h-5 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-300 mb-1">{activity.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <span className="text-xs font-medium text-primary">
                            +{activity.points} pontos
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    className="border-white/10 hover:bg-white/5"
                  >
                    Ver histórico completo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="search" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Campanhas Recomendadas</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-white/10 hover:bg-white/5"
                    onClick={() => setLocation('/campanhas')}
                  >
                    Ver todas
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                
                <div className="glass-card p-6 rounded-xl border border-white/5 text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Descubra causas incríveis</h3>
                  <p className="text-gray-300 mb-6 max-w-md mx-auto">
                    Encontre campanhas que se alinham com seus valores e interesses. Faça a diferença apoiando causas que você se importa.
                  </p>
                  <Button
                    onClick={() => setLocation('/campanhas')}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Explorar campanhas
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Níveis e Conquistas */}
            <div className="mt-12 mb-16">
              <h2 className="text-xl font-bold text-white mb-6">Seu Progresso</h2>
              
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Nível de Impacto</h3>
                    <UserLevel totalPoints={userPoints} showDetails />
                    
                    <div className="mt-6 text-sm text-gray-300 space-y-2">
                      <p>Ganhe pontos para subir de nível e desbloquear benefícios:</p>
                      <ul className="space-y-1 pl-5 list-disc">
                        <li>Fazer doações (+50 pontos)</li>
                        <li>Receber doações (+20 pontos)</li>
                        <li>Compartilhar campanhas (+10 pontos)</li>
                        <li>Completar suas campanhas (+100 pontos)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Conquistas Recentes</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLocation('/perfil')}
                        className="text-xs hover:bg-white/5"
                      >
                        Ver todas
                        <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      {predefinedAchievements.slice(0, 3).map((achievement) => (
                        <div 
                          key={achievement.name}
                          className="glass-card p-4 rounded-lg border border-white/10 text-center hover:border-primary/30 transition-colors duration-200"
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                            <span className="text-xl">{achievement.icon}</span>
                          </div>
                          <h4 className="text-sm font-medium text-white mb-1">{achievement.name}</h4>
                          <p className="text-xs text-gray-400">{achievement.category}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de nova conquista */}
      {showNewAchievement && (
        <AchievementUnlock 
          achievement={predefinedAchievements[0]} 
          autoClose
          onClose={() => setShowNewAchievement(false)}
        />
      )}
    </>
  );
}
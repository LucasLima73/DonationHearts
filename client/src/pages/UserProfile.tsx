import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';
import { UserLevel } from '@/components/gamification/UserLevel';
import { AchievementUnlock } from '@/components/gamification/AchievementUnlock';
import { predefinedAchievements, AchievementCategory, type PointHistory } from '@shared/achievements';
import { createGamificationTables } from '@/migrations/createGameTables';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy,
  History,
  User as UserIcon,
  Settings,
  Heart,
  Gift
} from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDemo, setShowDemo] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);
  
  // Estados para armazenar dados reais do usuário
  const [userPoints, setUserPoints] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [userLevel, setUserLevel] = useState({ level: 1, progress: 0, totalPoints: 0 });
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Busca dados do usuário do banco de dados
  // Função para lidar com os casos em que as tabelas não existem
  async function handleGamificationData() {
    // Ajusta os valores para manter a interface funcionando mesmo sem as tabelas
    setUserLevel({ level: 1, progress: 0, totalPoints: 0 });
    setUserPoints(0);
    setDonationCount(0);
    setTotalDonated(0);
    setUserAchievements([]);
    setActivityHistory([]);
  }
  
  // Efeito para garantir que o usuário tenha dados de gamificação
  useEffect(() => {
    if (!user?.id) return;
    
    async function fetchUserData() {
      setIsLoading(true);
      try {
        // Tentar carregar os dados do usuário
        // Se ocorrer um erro relacionado a tabelas ausentes, usar handleGamificationData
        
        try {
          // Tentar criar as tabelas necessárias primeiro
          const tablesCreated = await createGamificationTables();
          console.log('Tabelas criadas com sucesso?', tablesCreated);
        } catch (createError) {
          console.error('Erro ao criar tabelas:', createError);
        }
        
        // 1. Buscar nível do usuário
        const { data: levelData, error: levelError } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', user?.id || '')
          .single();
          
        if (levelError) {
          console.error('Erro ao buscar nível do usuário:', levelError);
          
          if (levelError.code === '42P01' || levelError.message?.includes('does not exist')) {
            // Tabela não existe, configurar dados padrão
            await handleGamificationData();
            setIsLoading(false);
            return; // Interromper a execução para não continuar com outras consultas
          } else if (levelError.code !== 'PGRST116') {
            toast({
              title: "Erro ao carregar dados",
              description: "Não foi possível carregar o nível do usuário",
              variant: "destructive"
            });
          }
        }
        
        // Se o usuário não tem nível registrado, cria um nível inicial
        if (!levelData) {
          // Calcular pontos com base nas doações e inserir nível inicial
          const { data: donationsData } = await supabase
            .from('donations')
            .select('amount')
            .eq('user_id', user.id);
            
          const { data: receivedDonations } = await supabase
            .from('donations')
            .select('id')
            .in('campaign_id', 
              // Subconsulta para obter IDs de campanhas do usuário
              supabase
                .from('campaigns')
                .select('id')
                .eq('creator_id', user.id)
            );
            
          // Calcular pontos totais: 50 por doação feita + 20 por doação recebida
          const donationsMade = donationsData?.length || 0;
          const donationsReceived = receivedDonations?.length || 0;
          const calculatedPoints = (donationsMade * 50) + (donationsReceived * 20);
          
          // Inserir registro de nível
          const { data: newLevel, error: insertError } = await supabase
            .from('user_levels')
            .insert({
              user_id: user.id,
              total_points: calculatedPoints,
              level: calculateLevel(calculatedPoints),
              progress: calculateProgress(calculatedPoints)
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Erro ao criar nível do usuário:', insertError);
          } else if (newLevel) {
            setUserLevel(newLevel);
            setUserPoints(newLevel.total_points);
          }
        } else {
          // Usar dados existentes
          setUserLevel(levelData);
          setUserPoints(levelData.total_points);
        }
        
        // 2. Buscar total de doações feitas pelo usuário
        const { data: userDonations, error: donationsError } = await supabase
          .from('donations')
          .select('amount')
          .eq('user_id', user.id);
          
        if (donationsError) {
          console.error('Erro ao buscar doações do usuário:', donationsError);
        } else if (userDonations) {
          setDonationCount(userDonations.length);
          // Somar os valores das doações
          const total = userDonations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
          setTotalDonated(total);
        }
        
        // 3. Buscar conquistas do usuário
        const { data: achievements, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);
          
        if (achievementsError) {
          console.error('Erro ao buscar conquistas do usuário:', achievementsError);
        } else if (achievements) {
          setUserAchievements(achievements);
        }
        
        // 4. Buscar histórico de pontos/atividades
        const { data: history, error: historyError } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (historyError) {
          console.error('Erro ao buscar histórico de atividades:', historyError);
        } else if (history) {
          // Mapear histórico para o formato esperado pelo componente
          const formattedHistory = history.map(item => ({
            id: item.id,
            type: item.category,
            description: item.description,
            points: item.points,
            date: item.created_at
          }));
          setActivityHistory(formattedHistory);
        }
        
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Ocorreu um erro ao buscar seus dados. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserData();
  }, [user, toast]);
  
  // Função para calcular o nível com base nos pontos
  function calculateLevel(points: number): number {
    const levelDefinitions = [
      { level: 1, pointsRequired: 0 },
      { level: 2, pointsRequired: 100 },
      { level: 3, pointsRequired: 250 },
      { level: 4, pointsRequired: 500 },
      { level: 5, pointsRequired: 1000 },
      { level: 6, pointsRequired: 2000 },
      { level: 7, pointsRequired: 4000 },
      { level: 8, pointsRequired: 7000 },
      { level: 9, pointsRequired: 10000 },
      { level: 10, pointsRequired: 15000 },
    ];
    
    // Encontrar o nível correspondente aos pontos
    const currentLevel = [...levelDefinitions].reverse().find(
      level => points >= level.pointsRequired
    );
    
    return currentLevel?.level || 1;
  }
  
  // Função para obter o título do nível
  function getLevelTitle(level: number): string {
    const titles = {
      1: "Iniciante",
      2: "Apoiador",
      3: "Colaborador",
      4: "Benfeitor",
      5: "Filantropo",
      6: "Humanitário",
      7: "Altruísta",
      8: "Benemérito",
      9: "Visionário",
      10: "Lenda"
    };
    
    return titles[level as keyof typeof titles] || "Iniciante";
  }
  
  // Função para calcular o progresso percentual para o próximo nível
  function calculateProgress(points: number): number {
    const levelDefinitions = [
      { level: 1, pointsRequired: 0 },
      { level: 2, pointsRequired: 100 },
      { level: 3, pointsRequired: 250 },
      { level: 4, pointsRequired: 500 },
      { level: 5, pointsRequired: 1000 },
      { level: 6, pointsRequired: 2000 },
      { level: 7, pointsRequired: 4000 },
      { level: 8, pointsRequired: 7000 },
      { level: 9, pointsRequired: 10000 },
      { level: 10, pointsRequired: 15000 },
    ];
    
    // Encontrar nível atual e próximo nível
    const currentLevelData = [...levelDefinitions].reverse().find(
      level => points >= level.pointsRequired
    ) || levelDefinitions[0];
    
    const nextLevelIndex = levelDefinitions.findIndex(
      level => level.level === currentLevelData.level
    ) + 1;
    
    const nextLevelData = nextLevelIndex < levelDefinitions.length 
      ? levelDefinitions[nextLevelIndex] 
      : null;
    
    // Se já está no nível máximo, retorna 100%
    if (!nextLevelData) return 100;
    
    // Calcular progresso percentual
    const currentLevelPoints = currentLevelData.pointsRequired;
    const nextLevelPoints = nextLevelData.pointsRequired;
    const pointsRange = nextLevelPoints - currentLevelPoints;
    const userPointsInRange = points - currentLevelPoints;
    
    return Math.min(100, Math.round((userPointsInRange / pointsRange) * 100));
  }
  
  // Mostra o modal de conquista desbloqueada após 1 segundo - apenas para demonstração
  useEffect(() => {
    if (showDemo) {
      const timer = setTimeout(() => {
        setSelectedAchievement(3); // ID da conquista para mostrar
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [showDemo]);
  
  return (
    <>
      <Helmet>
        <title>Meu Perfil | DoeAqui</title>
        <meta 
          name="description" 
          content="Veja suas conquistas, estatísticas de doações e gerencia seu perfil na plataforma DoeAqui."
        />
      </Helmet>
      
      <div className="min-h-screen grid-background w-full">
        {/* Efeitos de background */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
        </div>
        
        <div className="container mx-auto w-full max-w-[1200px] px-4 py-20">
          {/* Cabeçalho do perfil */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-primary/30 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900">
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user?.name || 'Usuário'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <UserIcon size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-3 -right-3 bg-primary text-white text-xs font-bold rounded-full h-8 w-8 flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-background">
                  <Trophy size={14} />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-end gap-4 mb-2">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {user?.name || 'Usuário DoeAqui'}
                    </h1>
                    <p className="text-gray-400">Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'recentemente'}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Trophy size={12} className="mr-1" /> Nível {userLevel.level}: {getLevelTitle(userLevel.level)}
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      <Heart size={12} className="mr-1" /> {donationCount} Doações
                    </Badge>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      <Gift size={12} className="mr-1" /> {userAchievements.length} Conquistas
                    </Badge>
                  </div>
                </div>
                
                {/* Resumo dos pontos e conquistas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Total de Pontos</h3>
                    <p className="text-xl font-bold text-white">{isLoading ? "..." : userPoints}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Campanhas Apoiadas</h3>
                    <p className="text-xl font-bold text-white">{isLoading ? "..." : donationCount}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Total Doado</h3>
                    <p className="text-xl font-bold text-white">
                      {isLoading ? "..." : `R$ ${totalDonated.toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Botão para demonstração do sistema de conquistas - apenas para protótipo */}
          {!showDemo && (
            <div className="mb-8">
              <button
                onClick={() => setShowDemo(true)}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg px-4 py-2 text-sm"
              >
                Demonstrar Sistema de Conquistas
              </button>
            </div>
          )}
          
          {/* Nível de usuário */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <UserLevel totalPoints={userPoints} />
          </motion.div>
          
          {/* Conteúdo em abas */}
          <Tabs defaultValue="achievements">
            <TabsList className="w-full max-w-md mx-auto mb-8 grid grid-cols-3">
              <TabsTrigger value="achievements" className="data-[state=active]:text-primary">
                <Trophy size={16} className="mr-2" />
                Conquistas
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:text-primary">
                <History size={16} className="mr-2" />
                Atividades
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:text-primary">
                <Settings size={16} className="mr-2" />
                Configurações
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="achievements" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AchievementGrid 
                  achievements={predefinedAchievements}
                  userAchievements={userAchievements}
                  showLockedAchievements={true}
                  showSecretAchievements={false}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="history" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 max-w-3xl mx-auto"
              >
                <h2 className="text-xl font-bold text-white mb-4">Histórico de Atividades</h2>
                
                {activityHistory.map((activity) => (
                  <div 
                    key={activity.id}
                    className="glass-card p-4 rounded-lg border border-white/5 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'donation' ? 'bg-primary/20 text-primary' :
                      activity.type === 'achievement' ? 'bg-secondary/20 text-secondary' :
                      activity.type === 'sharing' ? 'bg-accent/20 text-accent' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {activity.type === 'donation' ? <Heart size={18} /> :
                       activity.type === 'achievement' ? <Trophy size={18} /> :
                       activity.type === 'sharing' ? <Gift size={18} /> :
                       <UserIcon size={18} />}
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
              </motion.div>
            </TabsContent>
            
            <TabsContent value="settings" className="focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-xl font-bold text-white mb-6">Configurações de Gamificação</h2>
                
                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Notificações de Conquistas</h3>
                        <p className="text-sm text-gray-400">Receba notificações quando desbloquear novas conquistas</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="notifications" className="peer sr-only" defaultChecked />
                        <label 
                          htmlFor="notifications" 
                          className="flex w-11 h-6 bg-gray-600 rounded-full cursor-pointer peer-checked:bg-primary transition-colors duration-300"
                        >
                          <span className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 peer-checked:left-[calc(100%-21px)] transition-all duration-300"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Mostrar Conquistas no Perfil Público</h3>
                        <p className="text-sm text-gray-400">Permite que outros usuários vejam suas conquistas</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="public_achievements" className="peer sr-only" defaultChecked />
                        <label 
                          htmlFor="public_achievements" 
                          className="flex w-11 h-6 bg-gray-600 rounded-full cursor-pointer peer-checked:bg-primary transition-colors duration-300"
                        >
                          <span className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 peer-checked:left-[calc(100%-21px)] transition-all duration-300"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Mostrar Conquistas Secretas</h3>
                        <p className="text-sm text-gray-400">Exibe conquistas secretas não desbloqueadas</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" id="show_secret" className="peer sr-only" />
                        <label 
                          htmlFor="show_secret" 
                          className="flex w-11 h-6 bg-gray-600 rounded-full cursor-pointer peer-checked:bg-primary transition-colors duration-300"
                        >
                          <span className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 peer-checked:left-[calc(100%-21px)] transition-all duration-300"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Modal de conquista desbloqueada */}
      {selectedAchievement !== null && (
        <AchievementUnlock 
          achievement={predefinedAchievements.find(a => a.id === selectedAchievement) || predefinedAchievements[0]}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
}
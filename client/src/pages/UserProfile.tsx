import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { Heart, Award, Calendar, Activity, Users, TrendingUp, Star, Gift, Share, HeartPulse } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AchievementBadge } from '@/components/gamification/AchievementBadge';
import { AchievementUnlock } from '@/components/gamification/AchievementUnlock';
import { UserLevel } from '@/components/gamification/UserLevel';
import { supabase } from '../lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { predefinedAchievements } from '@shared/achievements';
import { useToast } from '@/hooks/use-toast';

export default function UserProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userLevel, setUserLevel] = useState<{ level: number, progress: number, totalPoints: number }>({ 
    level: 1, 
    progress: 0,
    totalPoints: 0
  });
  const [userPoints, setUserPoints] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [showDemo, setShowDemo] = useState(false);
  
  // Função para buscar dados do usuário do banco de dados
  async function fetchUserGamificationData() {
    if (!user?.id) return;
    
    try {
      // 1. Buscar nível do usuário da tabela user_levels
      const { data: levelData, error: levelError } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (levelError && levelError.code !== 'PGRST116') {
        console.error('Erro ao buscar nível do usuário:', levelError);
      }
      
      // Se encontrou dados do nível do usuário, atualizamos o estado
      if (levelData) {
        setUserLevel({
          level: levelData.level,
          progress: levelData.progress,
          totalPoints: levelData.total_points
        });
        setUserPoints(levelData.total_points);
      } else {
        // Se não existe ainda, criar um registro inicial
        const initialLevel = { level: 1, progress: 0, totalPoints: 0 };
        setUserLevel(initialLevel);
        setUserPoints(0);
        
        // Inserir nível inicial no banco de dados
        const { error: insertError } = await supabase
          .from('user_levels')
          .insert({
            user_id: user.id,
            level: 1,
            total_points: 0,
            progress: 0
          });
          
        if (insertError) {
          console.error('Erro ao inserir nível inicial do usuário:', insertError);
        }
      }
      
      // 2. Buscar conquistas do usuário
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievement_id(*)
        `)
        .eq('user_id', user.id);
        
      if (achievementsError) {
        console.error('Erro ao buscar conquistas do usuário:', achievementsError);
      }
      
      // Se encontrou conquistas, mapeamos para o formato correto
      if (achievementsData && achievementsData.length > 0) {
        const userAchievementsList = achievementsData.map((item) => {
          const achievement = item.achievement;
          return {
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            category: achievement.category,
            requiredPoints: achievement.required_points,
            isSecret: achievement.is_secret,
            createdAt: achievement.created_at
          };
        });
        
        setUserAchievements(userAchievementsList);
      } else {
        // Se não tem conquistas, verificar se precisa desbloquear a primeira
        if (levelData && levelData.total_points >= 50) {
          const { data: firstAchievement } = await supabase
            .from('achievements')
            .select('*')
            .eq('name', 'Primeira Doação')
            .single();
            
          if (firstAchievement) {
            setUserAchievements([{
              id: firstAchievement.id,
              name: firstAchievement.name,
              description: firstAchievement.description,
              icon: firstAchievement.icon,
              category: firstAchievement.category,
              requiredPoints: firstAchievement.required_points,
              isSecret: firstAchievement.is_secret,
              createdAt: firstAchievement.created_at
            }]);
          } else {
            setUserAchievements([]);
          }
        } else {
          setUserAchievements([]);
        }
      }
      
      // 3. Buscar histórico de pontos
      const { data: historyData, error: historyError } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (historyError) {
        console.error('Erro ao buscar histórico de pontos:', historyError);
      }
      
      if (historyData && historyData.length > 0) {
        const formattedHistory = historyData.map(item => ({
          id: item.id,
          date: new Date(item.created_at),
          action: item.description,
          points: item.amount,
          category: item.category
        }));
        
        setActivityHistory(formattedHistory);
      } else {
        // Histórico vazio
        setActivityHistory([]);
      }
      
      // 4. Buscar contagem e valor total de doações
      // Na página dashboard está funcionando, então vamos verificar as colunas e adaptar a consulta
      console.log('ID do usuário:', user.id);
      
      // Verificar estrutura da tabela
      const { data: tableInfo, error: tableInfoError } = await supabase
        .from('donations')
        .select('*')
        .limit(1);
        
      if (tableInfoError) {
        console.error('Erro ao verificar estrutura da tabela donations:', tableInfoError);
      } else {
        console.log('Estrutura da tabela donations:', tableInfo);
      }
      
      // Buscar informações das doações usando múltiplas tentativas de campos
      let donationsList = [];
      let donationTotal = 0;
      
      // Tentativa 1: Com user_id (doador)
      const { data: userDonations, error: userDonationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id);
        
      if (!userDonationsError && userDonations && userDonations.length > 0) {
        console.log('Doações encontradas com user_id:', userDonations);
        donationsList = userDonations;
        donationTotal = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
      } else if (userDonationsError) {
        console.error('Erro ao buscar doações com user_id:', userDonationsError);
      }
      
      // Se não encontrar com user_id, tenta com outras possibilidades
      if (donationsList.length === 0) {
        // Tentativa 2: Buscar campanhas do usuário e depois doações para essas campanhas
        const { data: userCampaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('id')
          .eq('creator_id', user.id);
          
        if (!campaignsError && userCampaigns && userCampaigns.length > 0) {
          console.log('Campanhas do usuário:', userCampaigns);
          const campaignIds = userCampaigns.map(c => c.id);
          
          const { data: campaignDonations, error: campDonationsError } = await supabase
            .from('donations')
            .select('*')
            .in('campaign_id', campaignIds);
            
          if (!campDonationsError && campaignDonations && campaignDonations.length > 0) {
            console.log('Doações para campanhas do usuário:', campaignDonations);
            donationsList = campaignDonations;
            donationTotal = campaignDonations.reduce((sum, donation) => sum + donation.amount, 0);
          } else if (campDonationsError) {
            console.error('Erro ao buscar doações para campanhas:', campDonationsError);
          }
        } else if (campaignsError) {
          console.error('Erro ao buscar campanhas do usuário:', campaignsError);
        }
      }
      
      // Atualizar os dados de exibição
      setDonationCount(donationsList.length);
      setTotalDonated(donationTotal / 100); // Converter de centavos para reais
      
      console.log('Doações encontradas:', donationsList.length);
      console.log('Valor total:', donationTotal / 100);
      
    } catch (error) {
      console.error('Erro ao buscar dados de gamificação:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Efeito para garantir que o usuário tenha dados de gamificação
  useEffect(() => {
    if (!user?.id) return;
    
    // Função principal para carregar dados do usuário
    async function loadUserData() {
      setIsLoading(true);
      
      try {
        // Buscar dados do usuário do banco de dados diretamente
        await fetchUserGamificationData();
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setIsLoading(false);
      }
    }
    
    // Carregar dados do usuário
    loadUserData();
  }, [user]);
  
  // Funções auxiliares para cálculos de nível e progresso
  function calculateLevel(points: number): number {
    // Cada nível requer 100 pontos adicionais
    // Nível 1: 0-99 pontos
    // Nível 2: 100-299 pontos
    // Nível 3: 300-599 pontos
    // Etc.
    
    if (points < 100) return 1;
    if (points < 300) return 2;
    if (points < 600) return 3;
    if (points < 1000) return 4;
    if (points < 1500) return 5;
    if (points < 2100) return 6;
    if (points < 2800) return 7;
    if (points < 3600) return 8;
    if (points < 4500) return 9;
    return 10; // Máximo nível 10 para pontuações acima de 4500
  }
  
  function getLevelTitle(level: number): string {
    const titles = [
      "Iniciante",
      "Apoiador",
      "Contribuinte",
      "Benfeitor",
      "Filantropo",
      "Patrono",
      "Humanitário",
      "Visionário",
      "Embaixador",
      "Lenda"
    ];
    
    return titles[Math.min(level - 1, titles.length - 1)];
  }
  
  function calculateProgress(points: number): number {
    // Calcula a porcentagem de progresso para o próximo nível
    const level = calculateLevel(points);
    
    // Pontos necessários para cada nível
    const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    
    // Se estiver no nível máximo, retorna 100%
    if (level >= 10) return 100;
    
    // Calcula quantos pontos já foram obtidos dentro do nível atual
    const pointsInCurrentLevel = points - levelThresholds[level - 1];
    
    // Calcula quantos pontos são necessários para passar para o próximo nível
    const pointsNeededForNextLevel = levelThresholds[level] - levelThresholds[level - 1];
    
    // Calcula a porcentagem de progresso
    return Math.min(Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100), 100);
  }
  
  // Exibe uma conquista específica
  function handleShowAchievement(achievement: any) {
    setSelectedAchievement(achievement);
    setShowDemo(true);
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <Helmet>
        <title>Perfil do Usuário | DoeAqui</title>
        <meta name="description" content="Visualize seu perfil, estatísticas e conquistas na plataforma DoeAqui." />
      </Helmet>
      
      <div className="grid gap-8 md:grid-cols-12">
        {/* Sidebar com informações do perfil */}
        <div className="flex flex-col gap-6 md:col-span-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar_url || ''} alt={user?.name || 'Usuário'} />
                  <AvatarFallback>{user?.name?.substring(0, 2) || 'US'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user?.name || 'Usuário'}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nível {userLevel.level}</span>
                    <span className="font-medium">{getLevelTitle(userLevel.level)}</span>
                  </div>
                  <Progress value={userLevel.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span>{userLevel.totalPoints} pontos</span>
                    <span>{userLevel.progress}% para o próximo nível</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Heart className="w-5 h-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">{donationCount}</span>
                    <span className="text-xs text-muted-foreground">Doações</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Award className="w-5 h-5 mb-1 text-primary" />
                    <span className="text-xl font-bold">{userAchievements.length}</span>
                    <span className="text-xs text-muted-foreground">Conquistas</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Estatísticas</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Total doado</span>
                      </div>
                      <span className="font-medium">R$ {totalDonated.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Pontos</span>
                      </div>
                      <span className="font-medium">{userPoints}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Membro desde</span>
                      </div>
                      <span className="font-medium">
                        {user?.created_at 
                          ? new Date(user.created_at).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' }) 
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-2">
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Suas Conquistas</CardTitle>
              <CardDescription>
                Conquistas desbloqueadas por suas atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userAchievements.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {userAchievements.slice(0, 4).map((achievement) => (
                    <AchievementBadge 
                      key={achievement.id} 
                      achievement={achievement} 
                      size="md"
                      showTooltip
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Award className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="mb-1 font-medium">Sem conquistas ainda</h3>
                  <p className="text-sm text-muted-foreground">
                    Continue participando para desbloquear conquistas
                  </p>
                </div>
              )}
              
              {userAchievements.length > 0 && (
                <Button variant="link" className="w-full mt-2">
                  Ver todas as conquistas
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Conteúdo principal */}
        <div className="md:col-span-8">
          <Tabs defaultValue="activities">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activities">Atividades</TabsTrigger>
              <TabsTrigger value="achievements">Conquistas</TabsTrigger>
              <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Atividades</CardTitle>
                  <CardDescription>
                    Veja seu histórico de participação
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activityHistory.length > 0 ? (
                    <div className="space-y-6">
                      {activityHistory.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                            {activity.category === 'donation' ? (
                              <Heart className="w-5 h-5 text-primary" />
                            ) : activity.category === 'sharing' ? (
                              <Share className="w-5 h-5 text-primary" />
                            ) : (
                              <Activity className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{activity.action}</h4>
                              <Badge variant="outline">+{activity.points} pts</Badge>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {activity.date.toLocaleDateString('pt-BR', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2 text-xl font-medium">Nenhuma atividade recente</h3>
                      <p className="text-muted-foreground">
                        Suas atividades como doações e interações aparecerão aqui
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suas Conquistas</CardTitle>
                  <CardDescription>
                    Acompanhe seu progresso e desbloqueie novas conquistas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userAchievements.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {userAchievements.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 transition-colors border rounded-lg cursor-pointer hover:bg-accent"
                          onClick={() => handleShowAchievement(achievement)}
                        >
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                            {achievement.icon === 'heart' ? (
                              <Heart className="w-5 h-5 text-primary" />
                            ) : achievement.icon === 'users' ? (
                              <Users className="w-5 h-5 text-primary" />
                            ) : achievement.icon === 'heart-pulse' ? (
                              <HeartPulse className="w-5 h-5 text-primary" />
                            ) : (
                              <Award className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <Badge variant="outline" className="mb-1">
                              {achievement.category === 'donation' ? 'Doação' : 
                               achievement.category === 'sharing' ? 'Compartilhamento' : 
                               'Engajamento'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(achievement.createdAt).toLocaleDateString('pt-BR', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2 text-xl font-medium">Nenhuma conquista desbloqueada</h3>
                      <p className="text-muted-foreground mb-4">
                        Continue participando para desbloquear conquistas
                      </p>
                      <Button variant="outline">Ver conquistas disponíveis</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="campaigns" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas que você apoia</CardTitle>
                  <CardDescription>
                    Campanhas que você criou ou contribuiu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="py-12 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-medium">Nenhuma campanha ativa</h3>
                    <p className="text-muted-foreground mb-4">
                      Você ainda não criou ou apoiou nenhuma campanha
                    </p>
                    <div className="flex flex-col gap-2 max-w-xs mx-auto">
                      <Button>Criar uma campanha</Button>
                      <Button variant="outline">Explorar campanhas</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {showDemo && selectedAchievement && (
        <AchievementUnlock 
          achievement={selectedAchievement}
          onClose={() => setShowDemo(false)}
        />
      )}
    </div>
  );
}
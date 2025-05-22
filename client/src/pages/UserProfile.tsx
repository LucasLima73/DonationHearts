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
      console.log('ID do usuário:', user.id);
      
      // 1. Buscar doações do usuário
      const { data: userDonations, error: userDonationsError } = await supabase
        .from('donations')
        .select('*')
        .eq('user_id', user.id);
      
      let donations = [];
      let totalAmount = 0;
      
      if (!userDonationsError && userDonations && userDonations.length > 0) {
        console.log('Doações do usuário encontradas:', userDonations.length);
        donations = userDonations;
        totalAmount = userDonations.reduce((sum, donation) => sum + donation.amount, 0);
      } else {
        // Verificar campanhas do usuário e suas doações recebidas
        const { data: userCampaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('id')
          .eq('creator_id', user.id);
        
        if (!campaignsError && userCampaigns && userCampaigns.length > 0) {
          console.log('Campanhas do usuário:', userCampaigns.length);
          const campaignIds = userCampaigns.map(c => c.id);
          
          const { data: receivedDonations, error: receivedError } = await supabase
            .from('donations')
            .select('*')
            .in('campaign_id', campaignIds);
            
          if (!receivedError && receivedDonations && receivedDonations.length > 0) {
            console.log('Doações recebidas:', receivedDonations.length);
            // Adicionar às doações já encontradas
            donations = [...donations, ...receivedDonations];
            totalAmount += receivedDonations.reduce((sum, d) => sum + d.amount, 0);
          }
        }
      }
      
      // Atualizar contadores de doação
      console.log('Total de doações:', donations.length);
      console.log('Valor total em R$:', totalAmount / 100);
      setDonationCount(donations.length);
      setTotalDonated(totalAmount / 100);
      
      // 2. Calcular pontos e níveis
      // 50 pontos por doação feita
      const totalPoints = donations.length * 50;
      
      // Buscar ou criar níveis do usuário
      const { data: levelData, error: levelError } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (!levelError && levelData) {
        console.log('Nível existente:', levelData);
        setUserLevel({
          level: levelData.level,
          progress: levelData.progress,
          totalPoints: levelData.total_points
        });
        setUserPoints(levelData.total_points);
      } else {
        // Calcular nível com base nos pontos
        const level = calculateLevel(totalPoints);
        const progress = calculateProgress(totalPoints);
        
        console.log('Nível calculado:', { level, progress, totalPoints });
        setUserLevel({ level, progress, totalPoints });
        setUserPoints(totalPoints);
        
        // Criar registro inicial
        try {
          const { error: insertLevelError } = await supabase
            .from('user_levels')
            .insert({
              user_id: user.id,
              level,
              total_points: totalPoints,
              progress
            });
            
          if (insertLevelError) {
            console.error('Erro ao inserir nível:', insertLevelError);
          }
        } catch (e) {
          console.error('Erro ao criar nível:', e);
        }
      }
      
      // 3. Criar histórico de atividades diretamente das doações
      console.log('Gerando histórico a partir das doações do usuário');
      
      // Usar doações como fonte primária do histórico
      if (donations.length > 0) {
        // Mapear doações para o formato de histórico
        const activityItems = donations.map((donation, index) => ({
          id: donation.id || index + 1,
          date: new Date(donation.created_at),
          action: `Doação de R$ ${(donation.amount / 100).toFixed(2)}`,
          points: 50, // Cada doação vale 50 pontos
          category: 'donation',
          // Adicionar campos extras para exibição
          amount: donation.amount / 100,
          campaign_id: donation.campaign_id
        }));
        
        // Ordenar por data (mais recente primeiro)
        activityItems.sort((a, b) => b.date.getTime() - a.date.getTime());
        
        console.log('Histórico de doações gerado:', activityItems);
        setActivityHistory(activityItems);
        
        // Tentar buscar informações adicionais sobre as campanhas para exibição
        try {
          // Buscar nomes das campanhas para as quais o usuário doou
          const campaignIds = [...new Set(donations.map(d => d.campaign_id))]; // IDs únicos
          
          if (campaignIds.length > 0) {
            const { data: campaignsData } = await supabase
              .from('campaigns')
              .select('id, title')
              .in('id', campaignIds);
              
            if (campaignsData && campaignsData.length > 0) {
              // Criar um mapa de IDs para nomes de campanhas
              const campaignMap = new Map();
              campaignsData.forEach(c => campaignMap.set(c.id, c.title));
              
              // Atualizar histórico com nomes de campanhas
              const enhancedHistory = activityItems.map(item => {
                const campaignTitle = campaignMap.get(item.campaign_id) || 'Campanha';
                return {
                  ...item,
                  action: `Doação de R$ ${item.amount.toFixed(2)} para ${campaignTitle}`
                };
              });
              
              setActivityHistory(enhancedHistory);
            }
          }
        } catch (e) {
          console.error('Erro ao buscar detalhes das campanhas:', e);
          // Mantém o histórico básico mesmo sem os nomes das campanhas
        }
        
        // Verificar se precisamos criar registros no histórico de pontos
        const { data: existingHistory } = await supabase
          .from('points_history')
          .select('count(*)')
          .eq('user_id', user.id);
          
        if (!existingHistory || existingHistory.length === 0) {
          try {
            // Criar registros de histórico no banco
            const historyRecords = donations.map(donation => ({
              user_id: user.id,
              amount: 50, // 50 pontos por doação
              category: 'donation',
              description: `Doação de R$ ${(donation.amount / 100).toFixed(2)}`,
              created_at: donation.created_at
            }));
            
            await supabase
              .from('points_history')
              .insert(historyRecords);
          } catch (e) {
            console.error('Erro ao inserir histórico de pontos:', e);
          }
        }
      } else {
        // Sem doações, tentar buscar histórico existente
        const { data: existingHistory } = await supabase
          .from('points_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (existingHistory && existingHistory.length > 0) {
          const formattedHistory = existingHistory.map(item => ({
            id: item.id,
            date: new Date(item.created_at),
            action: item.description,
            points: item.amount,
            category: item.category
          }));
          
          setActivityHistory(formattedHistory);
        } else {
          // Realmente não há histórico
          setActivityHistory([]);
        }
      }
      
      // 4. Verificar conquistas
      const { data: userAchievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievement_id(*)')
        .eq('user_id', user.id);
      
      if (!achievementsError && userAchievementsData && userAchievementsData.length > 0) {
        console.log('Conquistas encontradas:', userAchievementsData.length);
        const achievements = userAchievementsData.map(ua => ({
          id: ua.achievement.id,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          category: ua.achievement.category,
          requiredPoints: ua.achievement.required_points,
          isSecret: ua.achievement.is_secret,
          createdAt: ua.achievement.created_at
        }));
        
        setUserAchievements(achievements);
      } else if (totalPoints >= 50) {
        // Verificar se podemos atribuir a primeira conquista
        const { data: firstAchievement } = await supabase
          .from('achievements')
          .select('*')
          .eq('name', 'Primeira Doação')
          .single();
          
        if (firstAchievement) {
          console.log('Atribuindo primeira conquista');
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
          
          // Tentar salvar no banco
          try {
            const { error: achievementError } = await supabase
              .from('user_achievements')
              .insert({
                user_id: user.id,
                achievement_id: firstAchievement.id,
                unlocked_at: new Date().toISOString()
              });
              
            if (achievementError) {
              console.error('Erro ao salvar conquista:', achievementError);
            }
          } catch (e) {
            console.error('Erro ao atribuir conquista:', e);
          }
        } else {
          setUserAchievements([]);
        }
      } else {
        setUserAchievements([]);
      }
      
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
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
                            <div className="mt-1 flex items-center justify-between">
                              <p className="text-sm text-muted-foreground">
                                {activity.date.toLocaleDateString('pt-BR', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric'
                                })}
                                {' '}
                                {activity.date.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              {activity.amount && (
                                <p className="text-sm font-semibold text-primary">
                                  R$ {activity.amount.toFixed(2)}
                                </p>
                              )}
                            </div>
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
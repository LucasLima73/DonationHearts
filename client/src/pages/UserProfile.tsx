import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AchievementGrid } from '@/components/gamification/AchievementGrid';
import { UserLevel } from '@/components/gamification/UserLevel';
import { AchievementUnlock } from '@/components/gamification/AchievementUnlock';
import { predefinedAchievements, AchievementCategory } from '@shared/achievements';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
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
  const [showDemo, setShowDemo] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);
  
  // Dados simulados para demonstração
  const mockUserPoints = 750;
  const mockDonationCount = 8;
  const mockTotalDonated = 1250;
  
  // Simulação de conquistas do usuário para demonstração
  const mockUserAchievements = [
    { id: 1, userId: user?.id || '1', achievementId: 1, unlockedAt: new Date().toISOString(), progress: 1 },
    { id: 2, userId: user?.id || '1', achievementId: 2, unlockedAt: new Date().toISOString(), progress: 5 },
    { id: 3, userId: user?.id || '1', achievementId: 4, unlockedAt: new Date().toISOString(), progress: 1 },
    { id: 4, userId: user?.id || '1', achievementId: 6, unlockedAt: new Date().toISOString(), progress: 1 }
  ];
  
  // Simulação do histórico de atividades para demonstração
  const mockActivityHistory = [
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
    },
    { 
      id: 4, 
      type: 'donation', 
      description: 'Você doou R$75 para "Ajude o Hospital São Lucas"', 
      points: 15, 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() // 2 dias atrás
    },
    { 
      id: 5, 
      type: 'login', 
      description: 'Bônus de login por 7 dias consecutivos', 
      points: 25, 
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 dias atrás
    }
  ];
  
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
                      <Trophy size={12} className="mr-1" /> Nível 4: Benfeitor
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                      <Heart size={12} className="mr-1" /> {mockDonationCount} Doações
                    </Badge>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      <Gift size={12} className="mr-1" /> {mockUserAchievements.length} Conquistas
                    </Badge>
                  </div>
                </div>
                
                {/* Resumo dos pontos e conquistas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Total de Pontos</h3>
                    <p className="text-xl font-bold text-white">{mockUserPoints}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Campanhas Apoiadas</h3>
                    <p className="text-xl font-bold text-white">{mockDonationCount}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg border border-white/5">
                    <h3 className="text-gray-400 text-sm mb-1">Total Doado</h3>
                    <p className="text-xl font-bold text-white">R$ {mockTotalDonated.toFixed(2)}</p>
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
            <UserLevel totalPoints={mockUserPoints} />
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
                  userAchievements={mockUserAchievements}
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
                
                {mockActivityHistory.map((activity) => (
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
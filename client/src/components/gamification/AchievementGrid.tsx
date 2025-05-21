import { useState } from 'react';
import { Achievement, UserAchievement, AchievementCategory } from '@shared/achievements';
import { AchievementBadge } from './AchievementBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AchievementGridProps {
  achievements: Achievement[];
  userAchievements?: UserAchievement[];
  className?: string;
  showLockedAchievements?: boolean;
  showSecretAchievements?: boolean;
}

export function AchievementGrid({
  achievements,
  userAchievements = [],
  className,
  showLockedAchievements = true,
  showSecretAchievements = true,
}: AchievementGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mapeamento de IDs de conquistas para objetos UserAchievement
  const userAchievementMap = userAchievements.reduce((acc, userAchievement) => {
    acc[userAchievement.achievementId] = userAchievement;
    return acc;
  }, {} as Record<number, UserAchievement>);
  
  // Filtrar as conquistas de acordo com as configurações
  const filteredAchievements = achievements.filter(achievement => {
    // Filtrar por categoria selecionada
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) {
      return false;
    }
    
    // Verificar se deve mostrar conquistas bloqueadas
    const isUnlocked = !!userAchievementMap[achievement.id];
    if (!showLockedAchievements && !isUnlocked) {
      return false;
    }
    
    // Verificar se deve mostrar conquistas secretas
    if (!showSecretAchievements && achievement.isSecret && !isUnlocked) {
      return false;
    }
    
    return true;
  });
  
  // Contar quantas conquistas o usuário já desbloqueou por categoria
  const categoryStats = Object.values(AchievementCategory).reduce((acc, category) => {
    const categoryAchievements = achievements.filter(a => a.category === category);
    const unlockedCount = categoryAchievements.filter(a => !!userAchievementMap[a.id]).length;
    acc[category] = {
      total: categoryAchievements.length,
      unlocked: unlockedCount
    };
    return acc;
  }, {} as Record<string, { total: number, unlocked: number }>);
  
  // Calcular o total geral de conquistas
  const totalStats = {
    total: achievements.length,
    unlocked: userAchievements.length
  };
  
  // Transformar as categorias de conquistas para exibição
  const categoryLabels: Record<string, string> = {
    [AchievementCategory.DONATION]: 'Doações',
    [AchievementCategory.SHARING]: 'Compartilhamento',
    [AchievementCategory.ENGAGEMENT]: 'Engajamento',
    [AchievementCategory.CONSISTENCY]: 'Consistência',
    [AchievementCategory.SOCIAL]: 'Social',
    [AchievementCategory.SPECIAL]: 'Especial',
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Suas Conquistas</h2>
        <div className="text-sm text-gray-400">
          {totalStats.unlocked}/{totalStats.total} desbloqueadas
        </div>
      </div>
      
      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="w-full grid grid-cols-4 md:grid-cols-7 gap-1">
          <TabsTrigger value="all" className="px-2 py-1 text-xs">
            Todas
            <span className="ml-1 text-xs opacity-70">
              {totalStats.unlocked}/{totalStats.total}
            </span>
          </TabsTrigger>
          
          {Object.values(AchievementCategory).map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="px-2 py-1 text-xs"
            >
              {categoryLabels[category]}
              <span className="ml-1 text-xs opacity-70">
                {categoryStats[category]?.unlocked || 0}/{categoryStats[category]?.total || 0}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={selectedCategory} className="pt-4">
          <motion.div 
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {filteredAchievements.map((achievement) => (
              <motion.div key={achievement.id} variants={item}>
                <AchievementBadge
                  achievement={achievement}
                  userAchievement={userAchievementMap[achievement.id]}
                  size="md"
                  className="mx-auto"
                />
                <div className="mt-2 text-center">
                  <h3 className={cn(
                    "text-xs font-medium",
                    userAchievementMap[achievement.id] ? "text-white" : "text-gray-500"
                  )}>
                    {achievement.name}
                  </h3>
                </div>
              </motion.div>
            ))}
            
            {filteredAchievements.length === 0 && (
              <div className="col-span-full py-8 text-center">
                <p className="text-gray-400">Nenhuma conquista encontrada para esta categoria.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { motion } from 'framer-motion';
import { Achievement, UserAchievement } from '@shared/achievements';
import {
  HeartIcon,
  RepeatIcon,
  CalendarIcon,
  ShareIcon,
  UsersIcon,
  UserCheckIcon,
  MessageCircleIcon,
  CalendarCheckIcon,
  UserPlusIcon,
  AwardIcon,
  CrownIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  userAchievement?: UserAchievement; // Opcional: se o usuário possui a conquista
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

// Mapeamento de ícones por nome
const iconMap: Record<string, React.ComponentType<any>> = {
  'heart': HeartIcon,
  'repeat': RepeatIcon,
  'calendar': CalendarIcon,
  'share': ShareIcon,
  'users': UsersIcon,
  'user-check': UserCheckIcon,
  'message-circle': MessageCircleIcon,
  'calendar-check': CalendarCheckIcon,
  'calendar-heart': CalendarIcon, // Substitua com um CalendarHeartIcon real se disponível
  'user-plus': UserPlusIcon,
  'award': AwardIcon,
  'heart-handshake': HeartIcon, // Substitua com um HeartHandshakeIcon real se disponível
  'incognito': UsersIcon, // Substitua com um IncognitoIcon real se disponível
  'crown': CrownIcon
};

export function AchievementBadge({
  achievement,
  userAchievement,
  size = 'md',
  showTooltip = true,
  className
}: AchievementBadgeProps) {
  const isUnlocked = !!userAchievement;
  const progress = userAchievement ? userAchievement.progress : 0;
  const requiredPoints = achievement.requiredPoints;
  const progressPercentage = Math.min(100, (progress / requiredPoints) * 100);
  
  // Determinando o tamanho do badge baseado na prop size
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };
  
  // Selecionando o ícone com fallback para HeartIcon
  const IconComponent = iconMap[achievement.icon] || HeartIcon;
  
  return (
    <div className={cn("relative inline-block group", className)}>
      <motion.div 
        className={cn(
          "relative rounded-full flex items-center justify-center",
          sizeClasses[size],
          isUnlocked
            ? "bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20"
            : "bg-gray-800 grayscale",
          achievement.isSecret && !isUnlocked && "blur-sm hover:blur-none transition-all duration-300"
        )}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        {/* Círculo de progresso */}
        {!isUnlocked && progressPercentage > 0 && (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="5"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        )}
        
        {/* Ícone dentro do badge */}
        <IconComponent 
          className={cn(
            "relative z-10",
            size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12',
            isUnlocked ? 'text-white' : 'text-gray-400'
          )}
        />
        
        {/* Efeito de brilho para badges desbloqueados */}
        {isUnlocked && (
          <motion.div 
            className="absolute inset-0 rounded-full bg-white opacity-0"
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        )}
      </motion.div>
      
      {/* Badge de conquista nova */}
      {isUnlocked && userAchievement && userAchievement.unlockedAt &&
        new Date(userAchievement.unlockedAt).getTime() > Date.now() - 604800000 && (
        <div className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
          Novo
        </div>
      )}
      
      {/* Tooltip com informações */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-40 bg-black/90 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <p className="font-semibold">{achievement.name}</p>
          <p className="text-gray-300 mt-1">{achievement.description}</p>
          {!isUnlocked && (
            <div className="mt-1.5">
              <div className="w-full bg-gray-700 h-1.5 rounded-full">
                <div 
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-gray-300 text-xxs mt-1">
                {progress}/{requiredPoints} 
                {achievement.category === 'donation' ? ' doações' : ' pontos'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Dados das definições de níveis
// Cada nível requer mais pontos para avançar
const levelDefinitions = [
  { level: 1, pointsRequired: 0, title: "Iniciante" },
  { level: 2, pointsRequired: 100, title: "Apoiador" },
  { level: 3, pointsRequired: 250, title: "Colaborador" },
  { level: 4, pointsRequired: 500, title: "Benfeitor" },
  { level: 5, pointsRequired: 1000, title: "Filantropo" },
  { level: 6, pointsRequired: 2000, title: "Humanitário" },
  { level: 7, pointsRequired: 4000, title: "Altruísta" },
  { level: 8, pointsRequired: 7000, title: "Benemérito" },
  { level: 9, pointsRequired: 10000, title: "Visionário" },
  { level: 10, pointsRequired: 15000, title: "Lenda" },
];

interface UserLevelProps {
  totalPoints: number;
  className?: string;
  showDetails?: boolean;
}

export function UserLevel({ totalPoints, className, showDetails = true }: UserLevelProps) {
  // Encontrar o nível atual com base nos pontos
  const currentLevelData = [...levelDefinitions].reverse().find(
    level => totalPoints >= level.pointsRequired
  ) || levelDefinitions[0];
  
  // Encontrar o próximo nível
  const nextLevelIndex = levelDefinitions.findIndex(
    level => level.level === currentLevelData.level
  ) + 1;
  
  const nextLevelData = nextLevelIndex < levelDefinitions.length 
    ? levelDefinitions[nextLevelIndex] 
    : null;
  
  // Calcular o progresso para o próximo nível
  let progressPercentage = 100;
  let pointsToNextLevel = 0;
  
  if (nextLevelData) {
    const currentLevelPoints = currentLevelData.pointsRequired;
    const nextLevelPoints = nextLevelData.pointsRequired;
    const pointsRange = nextLevelPoints - currentLevelPoints;
    const userPointsInRange = totalPoints - currentLevelPoints;
    
    progressPercentage = Math.min(100, Math.round((userPointsInRange / pointsRange) * 100));
    pointsToNextLevel = nextLevelPoints - totalPoints;
  }

  return (
    <div className={cn("p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800", className)}>
      <div className="flex items-center gap-4">
        {/* Representação visual do nível */}
        <div className="relative">
          <div className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center relative",
            "bg-gradient-to-br from-primary/10 to-primary/30 shadow-lg shadow-primary/10"
          )}>
            <span className="text-lg font-bold text-white">{currentLevelData.level}</span>
            
            {/* Anel de progresso */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
              />
              
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (1 - progressPercentage / 100)}`}
                strokeLinecap="round"
                initial={{ strokeDashoffset: `${2 * Math.PI * 46}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 46 * (1 - progressPercentage / 100)}` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
        
        {/* Informações de nível */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">{currentLevelData.title}</h3>
            <span className="text-xs text-gray-400">{totalPoints} pontos</span>
          </div>
          
          {nextLevelData && (
            <div className="mt-2">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary to-secondary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-gray-400">Nível {currentLevelData.level}</span>
                <span className="text-gray-400">
                  {pointsToNextLevel} pontos para Nível {nextLevelData.level}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          <h4 className="text-sm font-medium text-white mb-3">Benefícios do seu nível:</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-primary">✓</span>
              </div>
              <span>Acesso a informações detalhadas sobre todas as campanhas</span>
            </li>
            {currentLevelData.level >= 3 && (
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">✓</span>
                </div>
                <span>Medalha de doador de {currentLevelData.title} no seu perfil</span>
              </li>
            )}
            {currentLevelData.level >= 5 && (
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">✓</span>
                </div>
                <span>Acesso prioritário a campanhas exclusivas</span>
              </li>
            )}
            {currentLevelData.level >= 7 && (
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">✓</span>
                </div>
                <span>Reconhecimento especial na comunidade DoeAqui</span>
              </li>
            )}
            {currentLevelData.level >= 10 && (
              <li className="flex items-start gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary">✓</span>
                </div>
                <span>Status de membro do conselho de doadores da plataforma</span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
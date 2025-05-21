import { useState, useEffect } from 'react';
import { Achievement } from '@shared/achievements';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementBadge } from './AchievementBadge';
import { Award, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementUnlockProps {
  achievement: Achievement;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function AchievementUnlock({
  achievement,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
}: AchievementUnlockProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Lançar confetti quando o componente for montado
  useEffect(() => {
    // Efeito de confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Fechar automaticamente após o delay
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Dar tempo para a animação de saída concluir
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-gray-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl neon-border"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="absolute top-3 right-3">
              <button 
                onClick={handleClose}
                className="h-8 w-8 rounded-full bg-gray-800/50 text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="px-6 py-8 text-center">
              <div className="mb-4 flex justify-center">
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 20 }}
                >
                  <AchievementBadge
                    achievement={achievement}
                    userAchievement={{ 
                      id: 1, 
                      userId: '1', 
                      achievementId: achievement.id, 
                      unlockedAt: new Date().toISOString(),
                      progress: achievement.requiredPoints
                    }}
                    size="lg"
                    showTooltip={false}
                  />
                </motion.div>
              </div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="h-4 w-4 text-primary" />
                  <h3 className="text-md font-semibold text-primary">Nova Conquista Desbloqueada!</h3>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{achievement.name}</h2>
                <p className="text-gray-300">{achievement.description}</p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                <button
                  onClick={handleClose}
                  className="bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-5 py-2.5 btn-glow"
                >
                  Incrível!
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
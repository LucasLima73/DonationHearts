import { useState } from 'react';
import { MicroDonationButton } from './MicroDonationButton';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingDonationButtonProps {
  campaignId: string;
  position?: 'bottom-right' | 'bottom-left';
}

export function FloatingDonationButton({
  campaignId,
  position = 'bottom-right'
}: FloatingDonationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [totalDonated, setTotalDonated] = useState(0);

  // Função para lidar com a doação bem-sucedida
  const handleDonationSuccess = (amount: number) => {
    setTotalDonated(prev => prev + amount);
    setShowThanks(true);
    
    // Esconder a mensagem de agradecimento após 3 segundos
    setTimeout(() => {
      setShowThanks(false);
    }, 3000);
  };

  // Posicionamento baseado na propriedade position
  const positionClass = position === 'bottom-right' 
    ? 'bottom-6 right-6' 
    : 'bottom-6 left-6';

  return (
    <div className={`fixed ${positionClass} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-3 p-4 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 shadow-xl"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-white">Doação Rápida</h4>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <MicroDonationButton 
                campaignId={campaignId}
                amount={5}
                size="sm"
                onDonationSuccess={handleDonationSuccess}
                label="Doar R$5"
              />
              
              <MicroDonationButton 
                campaignId={campaignId}
                amount={10}
                size="sm"
                onDonationSuccess={handleDonationSuccess}
                label="Doar R$10"
              />
              
              <MicroDonationButton 
                campaignId={campaignId}
                amount={25}
                size="sm"
                onDonationSuccess={handleDonationSuccess}
                label="Doar R$25"
              />
            </div>
            
            {totalDonated > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-center text-gray-300">
                Total doado: <span className="font-medium text-white">R$ {totalDonated.toFixed(2)}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showThanks && !isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: -70 }}
            exit={{ opacity: 0, y: -100 }}
            className="absolute bottom-16 right-0 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap"
          >
            Obrigado pela sua doação! ❤️
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="lg"
          className={`h-14 w-14 rounded-full bg-secondary hover:bg-secondary/90 shadow-lg ${isOpen ? 'bg-secondary/80' : ''}`}
          onClick={() => setIsOpen(prev => !prev)}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
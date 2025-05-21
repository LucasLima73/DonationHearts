import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart, 
  Award, 
  Calendar, 
  DollarSign,
  PlusCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Define os passos do tour
const tourSteps = [
  {
    id: 'welcome',
    title: 'Bem-vindo(a) ao DoeAqui!',
    description: 'Estamos felizes em tê-lo(a) conosco! Vamos fazer um rápido tour para você conhecer todas as funcionalidades da plataforma.',
    targetId: null,
    position: 'center',
    icon: Heart,
    color: 'bg-primary'
  },
  {
    id: 'dashboard',
    title: 'Seu Dashboard',
    description: 'Este é o seu painel de controle personalizado. Aqui você pode acompanhar suas doações, campanhas e conquistas.',
    targetId: 'dashboard-welcome',
    position: 'bottom',
    icon: Calendar,
    color: 'bg-purple-500'
  },
  {
    id: 'donations-made',
    title: 'Suas Doações',
    description: 'Acompanhe todas as doações que você realizou, seus pontos e conquistas nesta seção.',
    targetId: 'donations-made-section',
    position: 'bottom',
    icon: Heart,
    color: 'bg-pink-500'
  },
  {
    id: 'campaigns-created',
    title: 'Suas Campanhas',
    description: 'Veja as campanhas que você criou e as doações recebidas nesta área.',
    targetId: 'campaigns-created-section',
    position: 'top',
    icon: DollarSign,
    color: 'bg-green-500'
  },
  {
    id: 'achievements',
    title: 'Sistema de Conquistas',
    description: 'Ganhe pontos, desbloqueie conquistas e suba de nível ao realizar ações na plataforma!',
    targetId: 'achievements-section',
    position: 'bottom',
    icon: Award,
    color: 'bg-yellow-500'
  },
  {
    id: 'sidebar',
    title: 'Menu de Navegação',
    description: 'Use a barra lateral para navegar entre as diferentes seções da plataforma.',
    targetId: 'sidebar-nav',
    position: 'right',
    icon: ChevronRight,
    color: 'bg-blue-500'
  },
  {
    id: 'create-campaign',
    title: 'Criar Campanha',
    description: 'Precisa de ajuda? Clique aqui para criar uma nova campanha e compartilhar com seus amigos!',
    targetId: 'create-campaign-button',
    position: 'bottom',
    icon: PlusCircle,
    color: 'bg-primary'
  },
  {
    id: 'complete',
    title: 'Tudo Pronto!',
    description: 'Agora você já conhece as principais funcionalidades do DoeAqui. Vamos começar a fazer a diferença juntos!',
    targetId: null,
    position: 'center',
    icon: Heart,
    color: 'bg-primary'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, setLocation] = useLocation();
  const tourRef = useRef<HTMLDivElement>(null);
  
  // Para calcular posições dos elementos alvo
  const getTargetPosition = (targetId: string | null) => {
    if (!targetId) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    
    const rect = targetElement.getBoundingClientRect();
    const step = tourSteps[currentStep];
    
    switch (step.position) {
      case 'top':
        return {
          top: `${rect.top - 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, -100%)'
        };
      case 'bottom':
        return {
          top: `${rect.bottom + 20}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translate(-50%, 0)'
        };
      case 'left':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - 20}px`,
          transform: 'translate(-100%, -50%)'
        };
      case 'right':
        return {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + 20}px`,
          transform: 'translate(0, -50%)'
        };
      default:
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };
  
  // Efeito para adicionar highlights aos elementos
  useEffect(() => {
    if (!isOpen) return;
    
    const targetId = tourSteps[currentStep].targetId;
    if (!targetId) return;
    
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;
    
    // Adiciona destaque ao elemento alvo
    targetElement.classList.add('onboarding-highlight');
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    return () => {
      // Remove destaque quando o componente é desmontado ou muda de passo
      targetElement.classList.remove('onboarding-highlight');
    };
  }, [currentStep, isOpen]);
  
  // Lança confetti quando completa o tour
  useEffect(() => {
    if (currentStep === tourSteps.length - 1) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  const handleComplete = () => {
    onComplete();
    onClose();
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  if (!isOpen) return null;
  
  const currentStepData = tourSteps[currentStep];
  const position = currentStepData.targetId
    ? getTargetPosition(currentStepData.targetId)
    : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  const IconComponent = currentStepData.icon;
  
  return (
    <>
      {/* Overlay escuro */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={handleSkip} />
      
      <AnimatePresence>
        <motion.div
          ref={tourRef}
          className="fixed z-50 w-96 max-w-[90vw]"
          style={{
            top: position.top,
            left: position.left,
            transform: position.transform,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isAnimating ? 0 : 1, scale: isAnimating ? 0.8 : 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-card p-6 rounded-xl border-0 neon-border shadow-xl relative">
            {/* Ícone do passo */}
            <div className={`absolute -top-5 -right-5 w-14 h-14 rounded-full ${currentStepData.color} flex items-center justify-center shadow-lg`}>
              <IconComponent className="text-white w-7 h-7" />
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {currentStepData.title}
              </h3>
              <p className="text-gray-300 text-sm">
                {currentStepData.description}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                {tourSteps.map((_, index) => (
                  <div 
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'w-6 bg-white' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handlePrevious} 
                    className="text-white"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                )}
                
                {currentStep < tourSteps.length - 1 ? (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleComplete}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Concluir
                  </Button>
                )}
              </div>
            </div>
            
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={handleSkip}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Seta apontando para o elemento alvo */}
          {currentStepData.targetId && currentStepData.position !== 'center' && (
            <div
              className={`absolute w-4 h-4 bg-background rotate-45 ${
                currentStepData.position === 'bottom' ? '-top-2 left-1/2 -translate-x-1/2' :
                currentStepData.position === 'top' ? 'bottom-[-8px] left-1/2 -translate-x-1/2' :
                currentStepData.position === 'left' ? 'right-[-8px] top-1/2 -translate-y-1/2' :
                'left-[-8px] top-1/2 -translate-y-1/2'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
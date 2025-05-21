import { useState, useEffect } from 'react';
import { OnboardingTour } from './OnboardingTour';

// LocalStorage keys
const ONBOARDING_COMPLETED_KEY = 'doeaqui-onboarding-completed';
const ONBOARDING_DISMISSED_KEY = 'doeaqui-onboarding-dismissed';

interface OnboardingControllerProps {
  // Opcional: função para executar ações específicas quando o onboarding é concluído
  onComplete?: () => void;
  // Opcional: forçar exibição do tour (para testes/demonstração)
  forceShow?: boolean;
}

export function OnboardingController({ onComplete, forceShow = false }: OnboardingControllerProps) {
  const [showTour, setShowTour] = useState(false);
  
  useEffect(() => {
    // Verificar se o tour já foi concluído ou descartado
    const hasCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    const hasDismissed = localStorage.getItem(ONBOARDING_DISMISSED_KEY) === 'true';
    
    // Mostrar o tour se ele não foi concluído/descartado ou se forceShow for true
    const shouldShowTour = forceShow || (!hasCompleted && !hasDismissed);
    
    // Atraso para mostrar o tour para dar tempo da página ser carregada completamente
    if (shouldShowTour) {
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [forceShow]);
  
  const handleClose = () => {
    setShowTour(false);
    localStorage.setItem(ONBOARDING_DISMISSED_KEY, 'true');
  };
  
  const handleComplete = () => {
    setShowTour(false);
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <OnboardingTour 
      isOpen={showTour} 
      onClose={handleClose} 
      onComplete={handleComplete} 
    />
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, CheckCircle, CreditCard, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface MicroDonationButtonProps {
  campaignId: string;
  // Valor da micro-doação em reais
  amount?: number;
  // Função para atualizar a UI após uma doação bem-sucedida
  onDonationSuccess?: (amount: number) => void;
  variant?: 'default' | 'outline' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'heart' | 'coffee';
  label?: string;
}

export function MicroDonationButton({
  campaignId,
  amount = 5,
  onDonationSuccess,
  variant = 'default',
  size = 'md',
  icon = 'heart',
  label = 'Doação Rápida'
}: MicroDonationButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Função para disparar a animação de confetti
  const triggerConfetti = () => {
    const colors = ['#ff3e9d', '#ff9d3e', '#3e9dff'];
    
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.7 },
      colors,
      zIndex: 2000,
      disableForReducedMotion: true
    });
  };

  // Processa o pagamento da micro-doação
  const handleMicroDonation = async () => {
    if (!user) {
      toast({
        title: 'Faça login primeiro',
        description: 'Você precisa estar logado para fazer uma doação.',
        variant: 'destructive'
      });
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      // 1. Criar um payment intent no Stripe
      const response = await apiRequest('POST', '/api/create-payment-intent', {
        amount,
        campaignId
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao processar pagamento');
      }

      const paymentData = await response.json();
      
      // 2. Registrar a doação e atribuir pontos
      const registerResponse = await apiRequest('POST', '/api/register-donation', {
        paymentIntentId: paymentData.clientSecret.split('_secret_')[0],
        userId: user.id,
        campaignId,
        amount,
        anonymous: false
      });
      
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || 'Erro ao registrar doação');
      }
      
      const donationResult = await registerResponse.json();
      
      // 3. Mostrar animação de sucesso
      setIsSuccess(true);
      triggerConfetti();
      
      // Notificar o componente pai
      if (onDonationSuccess) {
        onDonationSuccess(amount);
      }
      
      toast({
        title: 'Doação realizada!',
        description: `Sua doação de R$ ${amount.toFixed(2)} foi realizada com sucesso! (+${donationResult.points || 50} pontos)`,
      });
      
      // Resetar estado após animação
      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Erro ao processar micro-doação:', err);
      toast({
        title: 'Erro ao processar doação',
        description: err.message || 'Não foi possível processar sua doação.',
        variant: 'destructive'
      });
      setIsProcessing(false);
    }
  };

  // Determinar o ícone a ser exibido
  const renderIcon = () => {
    if (isSuccess) {
      return <CheckCircle className="w-5 h-5" />;
    }
    
    if (isProcessing) {
      return <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />;
    }
    
    if (icon === 'heart') {
      return <Heart className="w-5 h-5" />;
    }
    
    return <Coffee className="w-5 h-5" />;
  };

  // Determinar classes com base no tamanho
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 text-xs';
      case 'lg':
        return 'h-12 px-6 text-lg';
      default:
        return 'h-10 px-4 text-sm';
    }
  };

  // Determinar classes com base na variante
  const getVariantClass = () => {
    switch (variant) {
      case 'outline':
        return 'border border-white/10 bg-transparent hover:bg-white/5 text-white';
      case 'floating':
        return 'bg-secondary shadow-lg hover:bg-secondary/90 text-white rounded-full fixed bottom-6 right-6 z-50';
      default:
        return 'bg-secondary hover:bg-secondary/90 text-white';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="button"
          onClick={handleMicroDonation}
          disabled={isProcessing}
          className={`${getSizeClass()} ${getVariantClass()} transition-all duration-300`}
        >
          <span className="mr-2">
            {renderIcon()}
          </span>
          
          {isSuccess ? 'Obrigado!' : (isProcessing ? 'Processando...' : label)}
          
          {!isProcessing && !isSuccess && (
            <span className="ml-1">
              {` R$ ${amount}`}
            </span>
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
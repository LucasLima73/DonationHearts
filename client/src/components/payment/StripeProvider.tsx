import { ReactNode, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { env } from '@/lib/env';

// Certifique-se de que a chave pública do Stripe esteja disponível
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Chave pública do Stripe não encontrada!');
}

// Carregue o Stripe fora do componente para evitar recriações desnecessárias
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeProviderProps {
  children: ReactNode;
  amount: number;
  campaignId: string;
}

export function StripeProvider({ children, amount, campaignId }: StripeProviderProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Criar um PaymentIntent para esta doação
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount,
          campaignId
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Não foi possível iniciar o processo de pagamento');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        console.error('Erro ao criar payment intent:', err);
        setError(err.message || 'Ocorreu um erro ao iniciar o pagamento');
      } finally {
        setIsLoading(false);
      }
    };

    if (amount > 0) {
      fetchPaymentIntent();
    }
  }, [amount, campaignId]);

  if (isLoading) {
    return (
      <div className="w-full py-8 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Preparando o checkout...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-6 text-center">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-left">
          <p className="text-red-500 font-medium mb-2">Erro ao iniciar pagamento</p>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}
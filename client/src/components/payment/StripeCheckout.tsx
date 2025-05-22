import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface StripeCheckoutProps {
  amount: number;
  campaignId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function StripeCheckout({ amount, campaignId, onSuccess, onCancel }: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href, // URL para redirecionamento após pagamento
          payment_method_data: {
            billing_details: {
              // Se quiser incluir detalhes como nome, email, etc.
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        setMessage(error.message || 'Ocorreu um erro ao processar o pagamento.');
        toast({
          title: 'Erro no pagamento',
          description: error.message || 'Ocorreu um erro ao processar o pagamento.',
          variant: 'destructive',
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // O pagamento foi bem-sucedido, registramos a doação no banco de dados
        toast({
          title: 'Pagamento realizado',
          description: 'Sua doação foi processada com sucesso. Obrigado!',
        });
        
        // Chamar o callback de sucesso com o ID do PaymentIntent
        onSuccess();
      } else {
        // Pagamento está em processamento ou precisa de mais ações
        toast({
          title: 'Pagamento em processamento',
          description: 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.',
        });
      }
    } catch (err: any) {
      console.error('Erro no processamento do pagamento:', err);
      setMessage(err.message || 'Ocorreu um erro ao processar o pagamento.');
      toast({
        title: 'Erro no pagamento',
        description: err.message || 'Ocorreu um erro ao processar o pagamento.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {message && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-sm text-red-500">{message}</p>
        </div>
      )}
      
      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="border-white/10 hover:bg-white/5"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="bg-primary hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>Finalizar Doação de R$ {amount.toFixed(2)}</>
          )}
        </Button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>✓ Seus dados de pagamento estão seguros e criptografados</p>
        <p>✓ Processado com segurança pelo Stripe</p>
      </div>
    </form>
  );
}
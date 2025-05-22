import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MicroDonationButton } from './MicroDonationButton';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface QuickDonationPanelProps {
  campaignId: string;
  campaignName: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'inline';
}

export function QuickDonationPanel({
  campaignId,
  campaignName,
  className = '',
  variant = 'default'
}: QuickDonationPanelProps) {
  const [totalDonated, setTotalDonated] = useState(0);
  const [donationCount, setDonationCount] = useState(0);

  // Função chamada quando uma doação é feita com sucesso
  const handleDonationSuccess = (amount: number) => {
    setTotalDonated(prev => prev + amount);
    setDonationCount(prev => prev + 1);
  };

  // Renderização baseada na variante
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <MicroDonationButton 
          campaignId={campaignId}
          amount={5}
          onDonationSuccess={handleDonationSuccess}
          size="sm"
          label="Doar R$5"
        />
        <MicroDonationButton 
          campaignId={campaignId}
          amount={10}
          onDonationSuccess={handleDonationSuccess}
          size="sm"
          label="Doar R$10"
        />
        <MicroDonationButton 
          campaignId={campaignId}
          amount={25}
          onDonationSuccess={handleDonationSuccess}
          size="sm"
          label="Doar R$25"
        />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/5 ${className}`}>
        <div className="bg-secondary/20 p-2 rounded-full">
          <Heart className="h-5 w-5 text-secondary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white">Ajude agora com uma micro-doação</h4>
          {donationCount > 0 && (
            <p className="text-xs text-gray-400">
              Você já contribuiu R$ {totalDonated.toFixed(2)} em {donationCount} {donationCount === 1 ? 'doação' : 'doações'}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <MicroDonationButton 
            campaignId={campaignId}
            amount={5}
            onDonationSuccess={handleDonationSuccess}
            size="sm"
            variant="outline"
            label="R$5"
          />
          <MicroDonationButton 
            campaignId={campaignId}
            amount={10}
            onDonationSuccess={handleDonationSuccess}
            size="sm"
            label="R$10"
          />
        </div>
      </div>
    );
  }

  // Variante padrão (default)
  return (
    <Card className={`bg-black/30 border-white/5 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white">Micro-doações para {campaignName}</CardTitle>
        <CardDescription>
          Faça pequenas contribuições de forma rápida e segura
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 justify-center">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <MicroDonationButton 
              campaignId={campaignId}
              amount={5}
              onDonationSuccess={handleDonationSuccess}
              icon="coffee"
              label="Café"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <MicroDonationButton 
              campaignId={campaignId}
              amount={10}
              onDonationSuccess={handleDonationSuccess}
              label="Lanche"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <MicroDonationButton 
              campaignId={campaignId}
              amount={25}
              onDonationSuccess={handleDonationSuccess}
              label="Refeição"
            />
          </motion.div>
        </div>
      </CardContent>
      
      {donationCount > 0 && (
        <CardFooter className="border-t border-white/5 pt-3 flex justify-center">
          <p className="text-sm text-center text-gray-300">
            Você contribuiu com <span className="font-medium text-white">R$ {totalDonated.toFixed(2)}</span> em {donationCount} {donationCount === 1 ? 'micro-doação' : 'micro-doações'}
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
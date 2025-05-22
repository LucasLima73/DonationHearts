import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HeartIcon, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';

interface DashboardStatsProps {
  hideDonationValues: boolean;
  hideCampaignValues: boolean;
}

export function DashboardStats({ hideDonationValues, hideCampaignValues }: DashboardStatsProps) {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalDonated, setTotalDonated] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [receivedDonationCount, setReceivedDonationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchUserStats = async () => {
        setIsLoading(true);
        try {
          // 1. Buscar total doado pelo usuário
          const { data: userDonations, error: donationsError } = await supabase
            .from('donations')
            .select('amount')
            .eq('user_id', user.id);
          
          if (donationsError) throw donationsError;
          
          // Calcular total doado e contagem de doações
          let totalAmount = 0;
          if (userDonations && userDonations.length > 0) {
            totalAmount = userDonations.reduce((sum: number, donation: any) => sum + donation.amount, 0);
          }
          setTotalDonated(totalAmount);
          setDonationCount(userDonations ? userDonations.length : 0);
          
          // 2. Buscar campanhas do usuário
          const { data: userCampaigns, error: campaignsError } = await supabase
            .from('campaigns')
            .select('id, raised')
            .eq('user_id', user.id);
          
          if (campaignsError) throw campaignsError;
          
          // 3. Para cada campanha, buscar doações recebidas
          let totalRaised = 0;
          let totalDonationsReceived = 0;
          
          if (userCampaigns && userCampaigns.length > 0) {
            // Somar os valores arrecadados de todas as campanhas do usuário
            totalRaised = userCampaigns.reduce((sum: number, campaign: any) => sum + (campaign.raised || 0), 0);
            
            // Contar o número total de doações recebidas
            const campaignIds = userCampaigns.map((campaign: any) => campaign.id);
            if (campaignIds.length > 0) {
              const { data: receivedDonations, error: receivedError } = await supabase
                .from('donations')
                .select('id')
                .in('campaign_id', campaignIds);
              
              if (!receivedError && receivedDonations) {
                totalDonationsReceived = receivedDonations.length;
              }
            }
          }
          
          setTotalReceived(totalRaised);
          setReceivedDonationCount(totalDonationsReceived);
          
          // 4. Definir pontos do usuário
          const userPointsValue = totalDonationsReceived * 20 + (userDonations ? userDonations.length : 0) * 50;
          setUserPoints(userPointsValue);
          
        } catch (err) {
          console.error('Erro ao carregar estatísticas:', err);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchUserStats();
    }
  }, [user]);

  return (
    <>
      {/* Cards de estatísticas de doações */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total de Pontos</p>
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? "-" : userPoints}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-primary/20 text-primary hover:bg-primary/10"
            >
              Ver conquistas
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Doações Realizadas</p>
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? "-" : donationCount}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-secondary/20 text-secondary hover:bg-secondary/10"
            >
              Ver histórico
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Doado</p>
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? "-" : (
                  hideDonationValues ? 
                  "R$ ••••••" : 
                  `R$ ${totalDonated.toFixed(2)}`
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-accent/20 text-accent hover:bg-accent/10"
            >
              Ver impacto
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cards de estatísticas de campanhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Doações Recebidas</p>
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? "-" : receivedDonationCount}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <HeartIcon className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-purple-500/20 text-purple-500 hover:bg-purple-500/10"
            >
              Ver doadores
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-xl border border-white/5 relative overflow-hidden neon-border-subtle">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Recebido</p>
              <h3 className="text-2xl font-bold text-white">
                {isLoading ? "-" : (
                  hideCampaignValues ? 
                  "R$ ••••••" : 
                  `R$ ${totalReceived.toFixed(2)}`
                )}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-blue-500/20 text-blue-500 hover:bg-blue-500/10"
            >
              Ver detalhes
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
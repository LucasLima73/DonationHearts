import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Eye, 
  Target, 
  TrendingUp, 
  MoreHorizontal,
  ExternalLink,
  Edit
} from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/components/auth/AuthProvider';

interface RecentCampaignsProps {
  className?: string;
}

export function RecentCampaigns({ className }: RecentCampaignsProps) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dados simulados para demonstração
  const mockCampaigns = [
    {
      id: 1,
      title: "Novo Equipamento de Streaming",
      description: "Equipamentos profissionais para melhorar a qualidade das lives",
      goal: 12000,
      raised: 8750,
      progress: 72.9,
      views: 1245,
      status: "active",
      created_at: "2024-01-15",
      days_left: 18
    },
    {
      id: 2,
      title: "Curso de Edição Avançada",
      description: "Investimento em curso profissional de edição de vídeo",
      goal: 5000,
      raised: 3200,
      progress: 64.0,
      views: 856,
      status: "active",
      created_at: "2024-01-20",
      days_left: 25
    },
    {
      id: 3,
      title: "Setup Gamer Completo",
      description: "Novo computador e periféricos para gaming",
      goal: 15000,
      raised: 15000,
      progress: 100.0,
      views: 2134,
      status: "completed",
      created_at: "2024-01-01",
      days_left: 0
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'paused':
        return 'Pausada';
      default:
        return 'Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">
              Campanhas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-700/30 rounded-lg"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card className="border-white/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Campanhas Recentes
          </CardTitle>
          <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            <Link href="/campaigns/my">
              Ver todas
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign: any, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-4 border border-white/5 rounded-lg hover:border-white/10 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-white group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      <Badge variant="outline" className={getStatusColor(campaign.status)}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                      {campaign.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      R$ {campaign.raised.toFixed(2)} de R$ {campaign.goal.toFixed(2)}
                    </span>
                    <span className="text-primary font-medium">
                      {campaign.progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={campaign.progress} 
                    className="h-2 bg-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {campaign.views}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {campaign.status === 'active' ? `${campaign.days_left} dias restantes` : 'Finalizada'}
                    </span>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <Link href={`/campaigns/${campaign.id}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Eye, 
  Users, 
  Calendar,
  Target,
  DollarSign,
  Share2,
  Activity
} from 'lucide-react';

interface CreatorAnalyticsProps {
  className?: string;
}

export function CreatorAnalytics({ className }: CreatorAnalyticsProps) {
  // Dados simulados para demonstração
  const analyticsData = {
    totalRaised: 15420.50,
    activeCampaigns: 3,
    totalViews: 12543,
    conversionRate: 3.2,
    avgDonation: 45.30,
    topCampaign: {
      name: "Novo Equipamento de Streaming",
      raised: 8750,
      goal: 12000,
      progress: 72.9
    },
    recentActivity: [
      { type: 'donation', amount: 50, time: '2 min atrás', campaign: 'Equipamento de Streaming' },
      { type: 'view', count: 23, time: '5 min atrás', campaign: 'Curso Online' },
      { type: 'share', count: 5, time: '15 min atrás', campaign: 'Novo Projeto' }
    ],
    monthlyProgress: [
      { month: 'Jan', value: 2500 },
      { month: 'Fev', value: 3200 },
      { month: 'Mar', value: 4100 },
      { month: 'Abr', value: 5500 }
    ]
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card de Total Arrecadado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Arrecadado</p>
                  <p className="text-2xl font-bold text-green-400">R$ {analyticsData.totalRaised.toFixed(2)}</p>
                  <p className="text-xs text-green-300 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +23% este mês
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card de Campanhas Ativas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Campanhas Ativas</p>
                  <p className="text-2xl font-bold text-blue-400">{analyticsData.activeCampaigns}</p>
                  <p className="text-xs text-blue-300 flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    2 em meta
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card de Visualizações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total de Visualizações</p>
                  <p className="text-2xl font-bold text-purple-400">{analyticsData.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-purple-300 flex items-center mt-1">
                    <Eye className="h-3 w-3 mr-1" />
                    +15% esta semana
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card de Taxa de Conversão */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-500/10 to-red-600/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Taxa de Conversão</p>
                  <p className="text-2xl font-bold text-orange-400">{analyticsData.conversionRate}%</p>
                  <p className="text-xs text-orange-300 flex items-center mt-1">
                    <Users className="h-3 w-3 mr-1" />
                    Acima da média
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campanha em Destaque */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Campanha em Destaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{analyticsData.topCampaign.name}</h3>
                    <p className="text-sm text-gray-400">
                      R$ {analyticsData.topCampaign.raised} de R$ {analyticsData.topCampaign.goal}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {analyticsData.topCampaign.progress.toFixed(1)}%
                  </Badge>
                </div>
                <Progress 
                  value={analyticsData.topCampaign.progress} 
                  className="h-2 bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Meta: R$ {analyticsData.topCampaign.goal}</span>
                  <span>Restam R$ {(analyticsData.topCampaign.goal - analyticsData.topCampaign.raised).toFixed(0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Atividade Recente */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-secondary" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        activity.type === 'donation' ? 'bg-green-500/20' :
                        activity.type === 'view' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                      }`}>
                        {activity.type === 'donation' && <DollarSign className="h-4 w-4 text-green-400" />}
                        {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-400" />}
                        {activity.type === 'share' && <Share2 className="h-4 w-4 text-purple-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {activity.type === 'donation' && `Nova doação de R$ ${activity.amount}`}
                          {activity.type === 'view' && `${activity.count} novas visualizações`}
                          {activity.type === 'share' && `${activity.count} compartilhamentos`}
                        </p>
                        <p className="text-xs text-gray-400">{activity.campaign}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { convertImageUrl } from '@/utils/imageUrlConverter';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Search, 
  Users, 
  CalendarCheck, 
  Clock,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campaign } from '@shared/campaigns';

export default function AllCampaigns() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  
  // Carregar campanhas do Supabase
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setCampaigns(data as Campaign[]);
      } catch (err: any) {
        console.error('Erro ao carregar campanhas:', err);
        setError('Não foi possível carregar as campanhas. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  // Calcular progresso da campanha
  const getProgress = (campaign: Campaign) => {
    if (!campaign || !campaign.goal || campaign.goal === 0) return 0;
    const progress = ((campaign.raised || 0) / campaign.goal) * 100;
    return Math.min(progress, 100); // Limitar a 100%
  };
  
  // Calcular dias restantes
  const getDaysLeft = (campaign: Campaign) => {
    if (!campaign.end_date) return null;
    
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Filtrar campanhas com base na busca e filtros
  const filteredCampaigns = campaigns
    .filter(campaign => {
      // Filtro de texto
      const matchesSearch = 
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      let matchesStatus = true;
      if (statusFilter !== 'all') {
        matchesStatus = campaign.status === statusFilter;
      }
      
      return matchesSearch && matchesStatus;
    });
  
  return (
    <div className="min-h-screen grid-background pt-20">
      <Helmet>
        <title>Campanhas | DoeAqui</title>
        <meta 
          name="description" 
          content="Explore campanhas de financiamento e ajude causas que importam."
        />
      </Helmet>
      
      {/* Efeitos de background */}
      <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
      </div>
      
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Campanhas Disponíveis</h1>
              <p className="text-gray-400 mt-2">Explore todas as campanhas e contribua com causas que importam.</p>
            </div>
            
            <Button 
              onClick={() => setLocation('/nova-campanha')} 
              className="bg-primary hover:bg-primary/90"
            >
              Criar Nova Campanha
            </Button>
          </div>
          
          {/* Barra de pesquisa e filtros */}
          <div className="glass-card rounded-xl p-4 border border-white/5 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar campanhas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input w-full bg-white/5 border-white/5 focus:border-primary/30"
                />
              </div>
              
              <div className="w-full md:w-56">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="glass-input border-white/5 focus:border-primary/30 bg-white/5">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-primary" />
                      <SelectValue placeholder="Filtrar por status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativas</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="canceled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </motion.div>
        
        {isLoading ? (
          <div className="grid place-items-center h-60">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="glass-card rounded-xl p-6 border border-white/5 text-center">
            <p className="text-red-400">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4 border-white/10 hover:bg-white/5"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="glass-card rounded-xl p-6 border border-white/5 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Nenhuma campanha encontrada</h3>
            <p className="text-gray-400">Não encontramos nenhuma campanha com os filtros atuais.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => {
              const progress = getProgress(campaign);
              const daysLeft = getDaysLeft(campaign);
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    onClick={() => setLocation(`/campanhas/${campaign.id}`)}
                    className="cursor-pointer h-full bg-transparent hover:bg-white/5 border-white/5 overflow-hidden transition-all duration-300"
                  >
                    <div 
                      className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300"
                    >
                      <div className="relative h-48">
                        <img 
                          src={convertImageUrl(campaign.image_url) || 'https://placehold.co/800x450/2a2a2a/ffffff?text=Sem+Imagem'} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.log('Erro ao carregar imagem na lista:', campaign.image_url);
                            e.currentTarget.src = 'https://placehold.co/800x450/2a2a2a/ffffff?text=Imagem+Indisponível';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                          <span className="text-white capitalize">{campaign.category}</span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">{campaign.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white font-medium">{formatCurrency(campaign.raised || 0)}</span>
                            <span className="text-gray-400">de {formatCurrency(campaign.goal)}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-400">{Math.round(progress)}% completo</span>
                            {daysLeft !== null && (
                              <span className="text-gray-400">
                                {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Encerrada'}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-white/5">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>12 doadores</span>
                          </div>
                          
                          {campaign.status === 'completed' ? (
                            <div className="flex items-center text-green-400">
                              <CalendarCheck className="h-3 w-3 mr-1" />
                              <span>Concluída</span>
                            </div>
                          ) : campaign.status === 'canceled' ? (
                            <div className="flex items-center text-red-400">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Cancelada</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-primary">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Ativa</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
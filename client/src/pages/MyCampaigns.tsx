import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { convertImageUrl } from '@/utils/imageUrlConverter';
import { useToast } from '@/hooks/use-toast';
import { Campaign } from '@shared/campaigns';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowLeft,
  Edit2,
  Eye,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function MyCampaigns() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  
  // Carregar campanhas do usuário
  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setCampaigns(data as Campaign[]);
      } catch (err: any) {
        console.error('Erro ao carregar campanhas:', err);
        toast({
          title: 'Erro ao carregar campanhas',
          description: err.message || 'Não foi possível carregar suas campanhas.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchCampaigns();
    }
  }, [user, toast]);
  
  // Filtrar campanhas
  const filteredCampaigns = campaigns
    .filter(campaign => {
      // Filtrar por status
      if (filter === 'active' && campaign.status !== 'active') return false;
      if (filter === 'completed' && campaign.status !== 'completed') return false;
      
      // Filtrar por texto de busca
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          campaign.title.toLowerCase().includes(query) ||
          campaign.description.toLowerCase().includes(query) ||
          campaign.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  
  // Calcular progresso da campanha
  const getProgress = (campaign: Campaign) => {
    if (!campaign.goal || campaign.goal === 0) return 0;
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
  
  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    setLocation('/login');
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Minhas Campanhas | DoeAqui</title>
        <meta 
          name="description" 
          content="Gerencie suas campanhas de arrecadação, acompanhe doações e edite detalhes."
        />
      </Helmet>
      
      {/* Header */}
      <DashboardHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Sidebar */}
      <DashboardSidebar sidebarOpen={sidebarOpen} />
      
      {/* Main Content */}
      <div className="min-h-screen grid-background pt-16 w-full">
        {/* Efeitos de background */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
        </div>
        
        <div className="lg:pl-64 transition-all duration-300">
          <div className="container mx-auto w-full max-w-[1200px] px-4 py-8">
            {/* Navegação */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Minhas Campanhas</h1>
                  <p className="text-gray-300">
                    Gerencie suas campanhas, acompanhe doações e edite detalhes.
                  </p>
                </div>
                
                <Button 
                  variant="default" 
                  onClick={() => setLocation('/nova-campanha')}
                  className="bg-primary hover:bg-primary/90 md:self-start"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </motion.div>
            
            {/* Filtros e busca */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    className="pl-10 glass-input"
                    placeholder="Buscar campanhas..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-white/10 hover:bg-white/5 ${filter === 'all' ? 'bg-white/10' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    Todas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-white/10 hover:bg-white/5 ${filter === 'active' ? 'bg-white/10' : ''}`}
                    onClick={() => setFilter('active')}
                  >
                    Ativas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`border-white/10 hover:bg-white/5 ${filter === 'completed' ? 'bg-white/10' : ''}`}
                    onClick={() => setFilter('completed')}
                  >
                    Concluídas
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Lista de campanhas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isLoading ? (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Carregando suas campanhas...</p>
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCampaigns.map((campaign) => {
                    const progress = getProgress(campaign);
                    const daysLeft = getDaysLeft(campaign);
                    
                    return (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="glass-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300"
                      >
                        <div className="relative h-48">
                          <img 
                            src={convertImageUrl(campaign.image_url) || 'https://placehold.co/800x450/2a2a2a/ffffff?text=Sem+Imagem'} 
                            alt={campaign.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('Erro ao carregar imagem:', campaign.image_url);
                              e.currentTarget.src = 'https://placehold.co/800x450/2a2a2a/ffffff?text=Imagem+Indisponível';
                            }}
                          />
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
                            {campaign.category}
                          </div>
                          
                          {campaign.status === 'completed' && (
                            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                              <div className="bg-green-500/90 px-4 py-2 rounded-md text-white font-bold transform -rotate-12">
                                CONCLUÍDA
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="p-5">
                          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                            {campaign.title}
                          </h3>
                          
                          <div className="mt-3 mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-300">Progresso</span>
                              <span className="text-primary font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                              <span className="text-gray-400">{formatCurrency(campaign.raised || 0)}</span>
                              <span className="text-gray-400">{formatCurrency(campaign.goal)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            {daysLeft !== null && (
                              <span className="inline-flex items-center text-xs text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Encerrada'}
                              </span>
                            )}
                            
                            <span className="inline-flex items-center text-xs text-gray-400 ml-auto">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {campaign.raised ? `${Math.round(campaign.raised / 100)}` : '0'} doações
                            </span>
                          </div>
                          
                          <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-white/10 hover:bg-white/5"
                              onClick={() => setLocation(`/campanhas/${campaign.id}`)}
                            >
                              <Eye className="w-3 h-3 mr-2" />
                              Visualizar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 border-primary/20 text-primary hover:bg-primary/10"
                              onClick={() => setLocation(`/campanhas/${campaign.id}?edit=true`)}
                            >
                              <Edit2 className="w-3 h-3 mr-2" />
                              Editar
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-20 text-center glass-card rounded-xl border border-white/5 p-6">
                  {searchQuery || filter !== 'all' ? (
                    <>
                      <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Nenhuma campanha encontrada</h3>
                      <p className="text-gray-400 mb-6">
                        Não encontramos campanhas com os filtros selecionados.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setFilter('all');
                        }}
                        className="border-white/10 hover:bg-white/5"
                      >
                        Limpar filtros
                      </Button>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Você ainda não tem campanhas</h3>
                      <p className="text-gray-400 mb-6">
                        Crie sua primeira campanha para começar a receber doações.
                      </p>
                      <Button
                        onClick={() => setLocation('/nova-campanha')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Criar campanha
                      </Button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
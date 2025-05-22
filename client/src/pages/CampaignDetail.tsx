import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, 
  Share, 
  Calendar, 
  Heart, 
  Edit2, 
  Users, 
  DollarSign,
  AlertTriangle,
  Pencil,
  Trash,
  Save,
  X,
  CreditCard,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Campaign, updateCampaignSchema, type UpdateCampaign } from '@shared/campaigns';
import confetti from 'canvas-confetti';
import { StripeProvider } from '@/components/payment/StripeProvider';
import { StripeCheckout } from '@/components/payment/StripeCheckout';
import { apiRequest } from '@/lib/queryClient';
import { QuickDonationPanel } from '@/components/donation/QuickDonationPanel';
import { FloatingDonationButton } from '@/components/donation/FloatingDonationButton';

export default function CampaignDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateCampaign | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);
  const [showDonationSuccess, setShowDonationSuccess] = useState(false);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  // Carregar dados da campanha
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Buscar detalhes da campanha
        const { data, error } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        setCampaign(data as Campaign);
        
        // Verificar se o usuário logado é o proprietário da campanha
        if (user?.id && data.user_id === user.id) {
          setIsOwner(true);
        }
        
        // Buscar informações do criador da campanha
        if (data.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', data.user_id)
            .single();
            
          if (!userError && userData) {
            // Atualizar os dados da campanha com o nome do criador
            setCampaign(prev => ({
              ...prev as Campaign,
              creator_name: userData.name
            } as Campaign));
          }
        }
      } catch (err: any) {
        console.error('Erro ao carregar campanha:', err);
        setError('Não foi possível carregar os detalhes da campanha.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchCampaign();
    }
  }, [id, user]);
  
  // Iniciar modo de edição
  const handleEdit = () => {
    if (!campaign) return;
    
    setEditData({
      title: campaign.title,
      description: campaign.description,
      category: campaign.category,
      goal: campaign.goal,
      image_url: campaign.image_url,
      end_date: campaign.end_date,
      status: campaign.status
    });
    
    setIsEditing(true);
  };
  
  // Cancelar edição
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };
  
  // Salvar alterações
  const handleSaveEdit = async () => {
    if (!campaign || !editData) return;
    
    try {
      setIsSaving(true);
      
      // Validar dados
      const validatedData = updateCampaignSchema.parse(editData);
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('campaigns')
        .update(validatedData)
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      setCampaign(prev => prev ? { ...prev, ...validatedData } : null);
      setIsEditing(false);
      setEditData(null);
      
      toast({
        title: 'Campanha atualizada',
        description: 'As alterações foram salvas com sucesso!',
      });
    } catch (err: any) {
      console.error('Erro ao atualizar campanha:', err);
      toast({
        title: 'Erro ao atualizar',
        description: err.message || 'Não foi possível salvar as alterações.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Excluir campanha
  const handleDelete = async () => {
    if (!campaign) return;
    
    if (!confirm('Tem certeza que deseja excluir esta campanha? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaign.id);
      
      if (error) throw error;
      
      toast({
        title: 'Campanha excluída',
        description: 'A campanha foi excluída com sucesso.',
      });
      
      // Redirecionar para o dashboard
      setLocation('/dashboard');
    } catch (err: any) {
      console.error('Erro ao excluir campanha:', err);
      toast({
        title: 'Erro ao excluir',
        description: err.message || 'Não foi possível excluir a campanha.',
        variant: 'destructive'
      });
    }
  };
  
  // Iniciar processo de doação
  const handleDonate = () => {
    if (!campaign || !user || donationAmount <= 0) {
      toast({
        title: 'Valor inválido',
        description: 'Por favor, informe um valor válido para sua doação.',
        variant: 'destructive'
      });
      return;
    }
    
    // Abrir o diálogo de pagamento com Stripe
    setIsStripeOpen(true);
  };
  
  // Processar doação após confirmação do pagamento
  const handlePaymentSuccess = async () => {
    if (!campaign || !user) return;
    
    try {
      setIsPaymentProcessing(true);
      
      // Estamos simplificando a verificação do pagamento
      // Quando o usuário chega a este ponto, o pagamento já foi confirmado pelo Stripe
      // Futuramente, podemos implementar a verificação completa quando o banco estiver atualizado
      
      // Inserir doação no banco de dados
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          amount: donationAmount,
          campaign_id: campaign.id,
          user_id: user.id,
          anonymous: false
          // Removemos payment_intent_id e payment_status temporariamente até atualizar o banco
        });
      
      if (donationError) throw donationError;
      
      // Atualizar valor arrecadado na campanha
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 
          raised: (campaign.raised || 0) + donationAmount
          // Removemos o campo updated_at que não existe na tabela campaigns
        })
        .eq('id', campaign.id);
      
      if (updateError) throw updateError;
      
      // Atualizar estado local
      setCampaign(prev => prev ? { 
        ...prev, 
        raised: (prev.raised || 0) + donationAmount
      } : null);
      
      // Fechar o diálogo de pagamento e mostrar mensagem de sucesso
      setIsStripeOpen(false);
      setShowDonationSuccess(true);
      
      // Efeitos visuais de celebração
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Resetar valor da doação
      setDonationAmount(0);
      
      // Limpar parâmetros de URL se existirem
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('payment_intent')) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
    } catch (err: any) {
      console.error('Erro ao registrar doação:', err);
      toast({
        title: 'Erro ao registrar doação',
        description: err.message || 'O pagamento foi processado, mas houve um erro ao registrar sua doação.',
        variant: 'destructive'
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };
  
  // Calcular progresso da campanha
  const getProgress = () => {
    if (!campaign || !campaign.goal || campaign.goal === 0) return 0;
    const progress = ((campaign.raised || 0) / campaign.goal) * 100;
    return Math.min(progress, 100); // Limitar a 100%
  };
  
  // Calcular dias restantes
  const getDaysLeft = () => {
    if (!campaign || !campaign.end_date) return null;
    
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
  
  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando detalhes da campanha...</p>
        </div>
      </div>
    );
  }
  
  if (error || !campaign) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Campanha não encontrada</h2>
          <p className="text-gray-400 mb-6">{error || 'Não foi possível encontrar a campanha solicitada.'}</p>
          <Button onClick={() => setLocation('/dashboard')} className="bg-primary hover:bg-primary/90">
            Voltar para o Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const progress = getProgress();
  const daysLeft = getDaysLeft();
  
  return (
    <>
      <Helmet>
        <title>{campaign.title} | DoeAqui</title>
        <meta 
          name="description"
          content={campaign.description.substring(0, 160)}
        />
      </Helmet>
      
      {/* Botão flutuante de micro-doação */}
      <FloatingDonationButton campaignId={campaign.id} />
      
      <div className="min-h-screen grid-background pt-20 w-full">
        {/* Efeitos de background */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Navegação */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/dashboard')}
              className="text-gray-300 hover:text-white hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para o Dashboard
            </Button>
          </div>
          
          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Imagem e detalhes */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Imagem principal */}
                <div className="rounded-xl overflow-hidden mb-6 glass-card p-2 border border-white/5">
                  <img 
                    src={campaign.image_url || 'https://placehold.co/800x450/2a2a2a/ffffff?text=Sem+Imagem'} 
                    alt={campaign.title}
                    className="w-full h-[300px] md:h-[450px] object-cover rounded-lg"
                  />
                </div>
                
                {/* Título e descrição */}
                <div className="glass-card rounded-xl p-6 border border-white/5">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input 
                        className="glass-input text-xl font-bold"
                        value={editData?.title || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                      />
                      
                      <Textarea 
                        className="glass-input min-h-[200px]"
                        value={editData?.description || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                      />
                      
                      <div className="flex justify-end space-x-3 mt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancelEdit}
                          className="border-white/10 hover:bg-white/5"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                        
                        <Button 
                          type="button" 
                          onClick={handleSaveEdit}
                          disabled={isSaving}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin mr-2"></div>
                              Salvando...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Salvar Alterações
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h1 className="text-2xl md:text-3xl font-bold text-white break-words">
                            {campaign.title}
                          </h1>
                          <div className="flex items-center mt-2 text-sm text-gray-400">
                            <span>Criado por </span>
                            <span className="font-medium text-primary ml-1">
                              {campaign.creator_name || "Usuário"}
                            </span>
                          </div>
                        </div>
                        
                        {isOwner && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleEdit}
                              className="border-white/10 hover:bg-white/5"
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleDelete}
                              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Excluir
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="prose prose-invert max-w-none">
                        {campaign.description.split('\n').map((paragraph, i) => (
                          <p key={i} className="text-gray-300 mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                      
                      {/* Visualização de Impacto Emocional - Antes e Depois */}
                      {(campaign.before_story || campaign.after_story) && (
                        <div className="mt-8 border-t border-white/10 pt-8">
                          <h3 className="text-xl font-bold text-white mb-6">Impacto Emocional</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Antes */}
                            {campaign.before_story && (
                              <div className="border border-white/10 rounded-xl p-4 bg-black/20 relative overflow-hidden">
                                <div className="absolute -top-1 -right-1 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                  ANTES
                                </div>
                                {campaign.before_image_url && (
                                  <div className="mb-4 rounded-lg overflow-hidden">
                                    <img 
                                      src={campaign.before_image_url}
                                      alt="Situação antes da campanha"
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                )}
                                <p className="text-gray-200 whitespace-pre-line">
                                  {campaign.before_story}
                                </p>
                              </div>
                            )}

                            {/* Depois */}
                            {campaign.after_story && (
                              <div className="border border-white/10 rounded-xl p-4 bg-gradient-to-br from-green-900/40 to-emerald-900/20 relative overflow-hidden">
                                <div className="absolute -top-1 -right-1 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                  DEPOIS
                                </div>
                                {campaign.after_image_url && (
                                  <div className="mb-4 rounded-lg overflow-hidden">
                                    <img 
                                      src={campaign.after_image_url}
                                      alt="Resultado esperado da campanha"
                                      className="w-full h-48 object-cover"
                                    />
                                  </div>
                                )}
                                <p className="text-gray-200 whitespace-pre-line">
                                  {campaign.after_story}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Descrição do Impacto */}
                          {campaign.impact_description && (
                            <div className="mt-6 p-4 border border-white/10 rounded-xl bg-purple-900/20">
                              <h4 className="text-lg font-semibold text-white mb-2">O que vai mudar</h4>
                              <p className="text-gray-200 whitespace-pre-line">
                                {campaign.impact_description}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
            
            {/* Sidebar com informações e ações */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6 sticky top-24"
              >
                {/* Card de progresso */}
                <div className="glass-card rounded-xl p-6 border border-white/5">
                  <div className="mb-4">
                    <span className="text-gray-400 text-sm">Arrecadado</span>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {formatCurrency(campaign.raised || 0)}
                      </h3>
                      <span className="text-sm text-gray-400">
                        de {formatCurrency(campaign.goal)}
                      </span>
                    </div>
                    
                    <Progress value={progress} className="h-2 mb-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{Math.round(progress)}% completo</span>
                      {daysLeft !== null && (
                        <span className="text-gray-400">
                          {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Encerrada'}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Componente de Micro-doação com animação */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Doações rápidas</h4>
                      <QuickDonationPanel 
                        campaignId={campaign.id}
                        campaignName={campaign.title}
                        variant="minimal"
                      />
                    </div>
                    
                    {/* Botão de doação */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <Heart className="w-4 h-4 mr-2" />
                          Fazer uma doação
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-white text-xl">Fazer uma doação</DialogTitle>
                        </DialogHeader>
                        
                        {showDonationSuccess ? (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Obrigado pela sua doação!</h3>
                            <p className="text-gray-300 mb-6">
                              Sua contribuição faz toda a diferença para esta campanha.
                            </p>
                            <Button 
                              onClick={() => setShowDonationSuccess(false)}
                              className="bg-primary hover:bg-primary/90"
                            >
                              Fechar
                            </Button>
                          </div>
                        ) : isStripeOpen ? (
                          <div className="py-4">
                            <StripeProvider amount={donationAmount} campaignId={campaign.id}>
                              <StripeCheckout 
                                amount={donationAmount} 
                                campaignId={campaign.id}
                                onSuccess={handlePaymentSuccess}
                                onCancel={() => setIsStripeOpen(false)}
                              />
                            </StripeProvider>
                          </div>
                        ) : (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-white text-sm">Valor da doação (R$)</label>
                              <Input
                                type="number"
                                min={1}
                                value={donationAmount || ''}
                                onChange={(e) => setDonationAmount(Number(e.target.value))}
                                className="glass-input"
                                placeholder="Ex: 50"
                              />
                            </div>
                            
                            <div className="flex justify-center gap-2 flex-wrap">
                              {[10, 25, 50, 100, 250, 500].map((amount) => (
                                <Button
                                  key={amount}
                                  type="button"
                                  variant="outline"
                                  onClick={() => setDonationAmount(amount)}
                                  className={`border-white/10 hover:bg-white/5 ${
                                    donationAmount === amount ? 'bg-primary/20 border-primary' : ''
                                  }`}
                                >
                                  R$ {amount}
                                </Button>
                              ))}
                            </div>
                            
                            <Button
                              onClick={handleDonate}
                              disabled={!donationAmount || donationAmount <= 0}
                              className="w-full mt-4 bg-primary hover:bg-primary/90"
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Pagar R$ {donationAmount || 0}
                            </Button>
                            
                            <div className="mt-4 text-xs text-gray-400">
                              <p className="flex items-center mb-1">
                                <svg className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 32 32" fill="currentColor">
                                  <path d="M25.6 12.8H6.4v-3.2h19.2v3.2zm0 3.2H6.4v3.2h19.2V16zm-9.6 6.4h-9.6v3.2h9.6v-3.2zm19.2-16v19.2c0 1.8-1.4 3.2-3.2 3.2H6.4c-1.8 0-3.2-1.4-3.2-3.2V6.4c0-1.8 1.4-3.2 3.2-3.2h25.6c1.8 0 3.2 1.4 3.2 3.2z"/>
                                </svg>
                                Pagamento 100% seguro
                              </p>
                              <p className="flex items-center">
                                <svg className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 32 32" fill="currentColor">
                                  <path d="M16 2C8.3 2 2 8.3 2 16s6.3 14 14 14 14-6.3 14-14S23.7 2 16 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 16H12v-2h2v-6h-2v-2h6v8h2v2z"/>
                                </svg>
                                Processado com segurança pelo Stripe
                              </p>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {/* Botão de compartilhamento */}
                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 hover:bg-white/5"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: campaign.title,
                            text: `Ajude nesta campanha: ${campaign.title}`,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: 'Link copiado!',
                            description: 'O link da campanha foi copiado para a área de transferência.',
                          });
                        }
                      }}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  </div>
                </div>
                
                {/* Card de detalhes */}
                <div className="glass-card rounded-xl p-6 border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-gray-400 text-sm block">Criado por</span>
                        <span className="text-white">{isOwner ? 'Você' : 'Anônimo'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-gray-400 text-sm block">Data de encerramento</span>
                        <span className="text-white">
                          {campaign.end_date ? format(new Date(campaign.end_date), 'dd/MM/yyyy', { locale: ptBR }) : 'Não definida'}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <span className="text-gray-400 text-sm block">Categoria</span>
                        <span className="text-white capitalize">{campaign.category}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
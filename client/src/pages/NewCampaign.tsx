import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  CalendarIcon, 
  Image as ImageIcon, 
  UploadCloud,
  Save,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { insertCampaignSchema, type InsertCampaign } from '@shared/campaigns';
import { supabase } from '@/lib/supabase';

// Categorias disponíveis
const CATEGORIES = [
  { value: 'saude', label: 'Saúde' },
  { value: 'educacao', label: 'Educação' },
  { value: 'animais', label: 'Animais' },
  { value: 'moradia', label: 'Moradia' },
  { value: 'alimentacao', label: 'Alimentação' },
  { value: 'emergencia', label: 'Emergência' },
  { value: 'outro', label: 'Outro' }
];

export default function NewCampaign() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  // Form validation with Zod
  const form = useForm<InsertCampaign>({
    resolver: zodResolver(insertCampaignSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'outro',
      goal: 1000,
      user_id: user?.id || '',
      image_url: '',
      before_story: '',
      after_story: '',
      before_image_url: '',
      after_image_url: '',
      impact_description: ''
    }
  });
  
  // Upload de imagens para o servidor e obtenção da URL
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Verificar tamanho e formato
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro ao fazer upload",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive"
      });
      return;
    }
    
    // Preview local
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Simulação de upload - em uma implementação real, faríamos o upload para o Supabase Storage
    // por enquanto, apenas atualizamos o campo com a URL do preview
    form.setValue('image_url', 'https://source.unsplash.com/random/300x200?sig=1');
  };
  
  // Envio do formulário
  const onSubmit = async (data: InsertCampaign) => {
    if (!user?.id) {
      toast({
        title: "Erro ao criar campanha",
        description: "Você precisa estar logado para criar uma campanha",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Salvando a campanha no banco de dados Supabase
      console.log('Dados da campanha:', data);
      
      // Inserir a campanha na tabela campaigns
      const { data: campaignData, error } = await supabase
        .from('campaigns')
        .insert([{
          title: data.title,
          description: data.description,
          category: data.category,
          goal: data.goal,
          raised: 0,
          image_url: data.image_url,
          end_date: data.end_date,
          user_id: user.id,
          status: 'active',
          before_story: data.before_story,
          after_story: data.after_story,
          before_image_url: data.before_image_url,
          after_image_url: data.after_image_url,
          impact_description: data.impact_description
        }])
        .select();
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Campanha criada com sucesso!",
        description: "Sua campanha foi criada e estará disponível para receber doações",
        variant: "default"
      });
      
      // Redirecionar para a página de campanhas
      navigate('/minhas-campanhas');
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro ao criar campanha",
        description: "Ocorreu um erro ao tentar criar sua campanha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Nova Campanha | DoeAqui</title>
        <meta name="description" content="Crie uma nova campanha de arrecadação no DoeAqui e receba doações para sua causa" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Nova Campanha</h1>
            <p className="text-gray-300 mb-8">Crie sua campanha e comece a receber doações</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 w-full glass-card mb-4">
                    <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                    <TabsTrigger value="impact">Impacto Emocional</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Coluna da esquerda */}
                      <div className="space-y-6">
                        {/* Título da campanha */}
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Título da campanha</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Ex: Ajuda para tratamento médico"
                                  className="glass-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Categoria */}
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Categoria</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="glass-input">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map(category => (
                                    <SelectItem key={category.value} value={category.value}>
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Data final */}
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-white">Data final</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "glass-input w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>Selecione uma data</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value as Date}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Meta de arrecadação */}
                        <FormField
                          control={form.control}
                          name="goal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Meta de arrecadação (R$)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={100}
                                  placeholder="1000"
                                  className="glass-input"
                                  {...field}
                                  onChange={(e) => {
                                    const value = e.target.value ? parseInt(e.target.value) : 0;
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {/* Coluna da direita */}
                      <div className="space-y-6">
                        {/* Descrição */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Descrição detalhada</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva sua situação, explique por que precisa de ajuda e como o dinheiro será utilizado..."
                                  className="glass-input min-h-[160px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Imagem */}
                        <FormField
                          control={form.control}
                          name="image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Imagem principal da campanha</FormLabel>
                              <div className="glass-card rounded-xl overflow-hidden border border-white/5">
                                <div className="p-4">
                                  <div className={cn(
                                    "border-2 border-dashed border-white/20 rounded-lg p-4 h-44 flex items-center justify-center",
                                    imagePreview && "border-none p-0"
                                  )}>
                                    {imagePreview ? (
                                      <div className="w-full h-full relative">
                                        <img 
                                          src={imagePreview} 
                                          alt="Preview"
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setImagePreview(null);
                                            field.onChange('');
                                          }}
                                          className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                          <XCircle size={18} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                          <span className="flex items-center justify-center gap-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg py-2 px-4 transition-colors">
                                            <UploadCloud className="w-4 h-4" />
                                            Selecionar imagem
                                          </span>
                                          <input
                                            id="image-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                          />
                                        </label>
                                        <p className="text-xs text-gray-400 mt-2">
                                          JPG, PNG ou GIF. Máximo 5MB.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="impact">
                    <div className="space-y-6">
                      {/* Seção Antes */}
                      <div className="glass-card rounded-xl overflow-hidden border border-white/5 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Situação Atual (Antes)</h3>
                        
                        {/* História "Antes" */}
                        <FormField
                          control={form.control}
                          name="before_story"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel className="text-white">Descreva sua situação atual</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Conte sua história e os desafios que você está enfrentando no momento..."
                                  className="glass-input min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Imagem "Antes" */}
                        <FormField
                          control={form.control}
                          name="before_image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">URL da imagem da situação atual</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Cole aqui o link para uma imagem que ilustre sua situação atual"
                                  className="glass-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Seção Depois */}
                      <div className="glass-card rounded-xl overflow-hidden border border-white/5 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Após a Campanha (Depois)</h3>
                        
                        {/* História "Depois" */}
                        <FormField
                          control={form.control}
                          name="after_story"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel className="text-white">Descreva como será depois da campanha</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Explique como a contribuição dos doadores mudará sua vida e que diferença isso fará..."
                                  className="glass-input min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Imagem "Depois" */}
                        <FormField
                          control={form.control}
                          name="after_image_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">URL da imagem do resultado esperado</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Cole aqui o link para uma imagem que represente o que você espera após a campanha"
                                  className="glass-input"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Descrição do Impacto */}
                      <div className="glass-card rounded-xl overflow-hidden border border-white/5 p-6">
                        <FormField
                          control={form.control}
                          name="impact_description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Descreva o impacto na sua vida</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Descreva o impacto concreto que as doações terão na sua vida e como a situação mudará..."
                                  className="glass-input min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Botão de envio */}
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Salvando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4 mr-2" />
                        Criar Campanha
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </>
  );
}
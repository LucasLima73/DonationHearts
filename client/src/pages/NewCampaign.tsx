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
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Formulário com validação usando Zod
  const form = useForm<InsertCampaign>({
    resolver: zodResolver(insertCampaignSchema.extend({
      // Extensões adicionais de validação
      title: insertCampaignSchema.shape.title.min(5, {
        message: 'O título deve ter pelo menos 5 caracteres'
      }).max(100, {
        message: 'O título não pode ter mais de 100 caracteres'
      }),
      description: insertCampaignSchema.shape.description.min(20, {
        message: 'A descrição deve ter pelo menos 20 caracteres'
      }),
      goal: insertCampaignSchema.shape.goal.min(10, {
        message: 'A meta deve ser de pelo menos R$ 10'
      }),
    })),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      goal: 0,
      imageUrl: '',
      userId: user?.id || '',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias a partir de hoje
    }
  });

  // Função para lidar com upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro ao fazer upload',
        description: 'A imagem não pode ter mais de 5MB',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Exibir preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Upload para o Supabase Storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('campaign-images')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(data.path);
      
      form.setValue('imageUrl', urlData.publicUrl);
      
      toast({
        title: 'Upload realizado',
        description: 'Imagem carregada com sucesso!',
      });
    } catch (error) {
      console.error('Erro de upload:', error);
      toast({
        title: 'Erro ao fazer upload',
        description: 'Não foi possível carregar a imagem. Tente novamente.',
        variant: 'destructive'
      });
    }
  };
  
  // Envio do formulário
  const onSubmit = async (data: InsertCampaign) => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para criar uma campanha',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enviar dados para o Supabase
      const { data: campaign, error } = await supabase
        .from('campaigns')
        .insert({
          ...data,
          userId: user.id
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Campanha criada!',
        description: 'Sua campanha foi criada com sucesso e já está disponível para receber doações.',
      });
      
      // Redirecionar para a página de detalhes da campanha
      setLocation(`/campanhas/${campaign.id}`);
    } catch (error: any) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: 'Erro ao criar campanha',
        description: error.message || 'Não foi possível criar sua campanha. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Cancelar criação da campanha
  const handleCancel = () => {
    if (confirm('Tem certeza que deseja cancelar? Todos os dados inseridos serão perdidos.')) {
      setLocation('/dashboard');
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Nova Campanha | DoeAqui</title>
        <meta 
          name="description"
          content="Crie sua campanha de arrecadação. Defina metas, adicione detalhes e compartilhe com o mundo!"
        />
      </Helmet>
      
      <div className="min-h-screen grid-background pt-20 w-full">
        {/* Efeitos de background */}
        <div className="absolute -z-10 top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 blur-[120px] rounded-full bg-primary/30 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 blur-[120px] rounded-full bg-secondary/30 -ml-20 -mb-20"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white">Nova Campanha</h1>
            <p className="text-gray-300 mt-2">
              Preencha os detalhes abaixo para criar sua campanha de arrecadação.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Formulário dividido em duas colunas em telas maiores */}
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
                              {CATEGORIES.map((category) => (
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
                              className="glass-input"
                              min={10}
                              placeholder="Ex: 5000"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Data de encerramento */}
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">Data de encerramento</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="glass-input pl-3 text-left font-normal"
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
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
                                selected={field.value}
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
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Imagem da campanha</FormLabel>
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
                                      <span className="text-sm text-gray-300 block mb-1">
                                        Clique para fazer upload
                                      </span>
                                      <span className="text-xs text-gray-400">
                                        PNG, JPG, WEBP (máx. 5MB)
                                      </span>
                                      <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                      />
                                    </label>
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
                
                {/* Botões de ação */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCancel}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Criando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Criar Campanha
                      </>
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
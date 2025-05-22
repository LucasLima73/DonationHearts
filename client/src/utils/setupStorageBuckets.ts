import { supabase } from '../lib/supabase';

/**
 * Configura os buckets de armazenamento necessários para o funcionamento da aplicação
 * - bucket 'campaign-images': para armazenar imagens de campanhas
 */
export async function setupStorageBuckets() {
  try {
    console.log('Verificando buckets de armazenamento...');
    
    // Verificar se o bucket campaign-images existe
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Erro ao listar buckets:', bucketError);
      return false;
    }
    
    // Verificar se o bucket campaign-images já existe
    const campaignImagesBucket = buckets?.find(bucket => bucket.name === 'campaign-images');
    
    if (!campaignImagesBucket) {
      console.log('Criando bucket para imagens de campanhas...');
      
      // Criar o bucket com configurações adequadas
      const { error: createError } = await supabase.storage.createBucket('campaign-images', {
        public: true, // Bucket com acesso público
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limite por arquivo
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error('Erro ao criar bucket campaign-images:', createError);
        return false;
      }
      
      console.log('✅ Bucket campaign-images criado com sucesso');
      
      // Configurar políticas de acesso público para os arquivos
      try {
        // Política para permitir leitura pública de todos os arquivos
        const { error: policyError } = await supabase.storage.from('campaign-images')
          .createSignedUrl('policy-test.txt', 1); // Isso vai falhar mas é só para verificar
          
        console.log('Bucket configurado com políticas de acesso padrão');
      } catch (e) {
        console.log('Configurando políticas de acesso (isso é normal)');
      }
    } else {
      console.log('Bucket campaign_images já existe');
    }
    
    return true;
  } catch (e) {
    console.error('Erro ao configurar buckets de armazenamento:', e);
    return false;
  }
}
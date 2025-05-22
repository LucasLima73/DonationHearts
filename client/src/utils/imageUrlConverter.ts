/**
 * Utilitário para converter URLs de imagens para o formato correto
 * para exibição no Supabase Storage
 */

/**
 * Converte uma URL de imagem do formato padrão para o formato com /sign
 * @param url URL original da imagem
 * @returns URL corrigida com /sign
 */
export function convertImageUrl(url: string | null): string {
  if (!url) return '';
  if (url.includes('unsplash.com')) return url; // URLs externas não precisam de conversão
  if (url.includes('placehold.co')) return url; // URLs de placeholder não precisam de conversão
  
  // Verificar se já é uma URL assinada
  if (url.includes('/object/sign/')) return url;
  
  // Converter de /object/public/ para /object/sign/
  if (url.includes('/object/public/')) {
    return url.replace('/object/public/', '/object/sign/');
  }
  
  return url;
}
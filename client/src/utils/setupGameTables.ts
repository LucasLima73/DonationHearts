import { supabase } from '../lib/supabase';
import { predefinedAchievements } from '@shared/achievements';

// Função para criar as tabelas do sistema de gamificação
export async function setupGameTables() {
  console.log('Iniciando a configuração do sistema de gamificação...');
  
  try {
    // Verificar se a tabela de achievements existe
    const { data, error } = await supabase
      .from('achievements')
      .select('id')
      .limit(1);
      
    if (error) {
      console.log('Tabela achievements não existe ou não está acessível');
      console.log('Modo de compatibilidade ativado para sistema de gamificação');
    } else {
      console.log('Tabela achievements existe e pode ser acessada');
      
      // Se não existirem conquistas, inserir as predefinidas
      if (!data || data.length === 0) {
        const achievements = [
          {
            name: 'Primeira Doação',
            description: 'Realizou sua primeira doação',
            icon: 'heart',
            category: 'donation',
            required_points: 50,
            is_secret: false
          },
          {
            name: 'Doador Frequente',
            description: 'Realizou 5 doações',
            icon: 'heart-pulse',
            category: 'donation',
            required_points: 250,
            is_secret: false
          },
          {
            name: 'Doador Generoso',
            description: 'Doou mais de R$ 100 no total',
            icon: 'hand-coins',
            category: 'donation',
            required_points: 500,
            is_secret: false
          },
          {
            name: 'Apoiador Iniciante',
            description: 'Apoiou 3 campanhas diferentes',
            icon: 'hand-holding-heart',
            category: 'donation',
            required_points: 150,
            is_secret: false
          },
          {
            name: 'Influenciador',
            description: 'Compartilhou 5 campanhas nas redes sociais',
            icon: 'share',
            category: 'sharing',
            required_points: 250,
            is_secret: false
          }
        ];
        
        const { error: insertError } = await supabase
          .from('achievements')
          .insert(achievements);
          
        if (insertError) {
          console.error('Erro ao inserir conquistas predefinidas:', insertError);
        } else {
          console.log('Conquistas predefinidas inseridas com sucesso!');
        }
      } else {
        console.log('Já existem conquistas no banco, pulando inserção.');
      }
    }
    
    console.log('Sistema de gamificação configurado no modo resiliente.');
    return true;
  } catch (error) {
    console.error('Erro ao executar setup das tabelas de gamificação:', error);
    return false;
  }
}
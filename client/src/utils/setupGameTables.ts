import { supabase } from '../lib/supabase';
import { predefinedAchievements } from '@shared/achievements';

// Função para criar as tabelas do sistema de gamificação
export async function setupGameTables() {
  console.log('Iniciando a criação das tabelas do sistema de gamificação...');
  
  try {
    // Executar script SQL completo usando o método .sql() do Supabase
    const result = await supabase.sql(`
      -- Criação da tabela de níveis de usuário
      CREATE TABLE IF NOT EXISTS user_levels (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 1,
        total_points INTEGER NOT NULL DEFAULT 0,
        progress INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Criação da tabela de conquistas
      CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        required_points INTEGER NOT NULL,
        is_secret BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Criação da tabela de conquistas do usuário
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        achievement_id INTEGER NOT NULL REFERENCES achievements(id),
        unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        UNIQUE(user_id, achievement_id)
      );
      
      -- Criação da tabela de pontos de atividade do usuário
      CREATE TABLE IF NOT EXISTS user_activity_points (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        category TEXT NOT NULL,
        points INTEGER NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
      
      -- Criação da tabela de histórico de pontos
      CREATE TABLE IF NOT EXISTS points_history (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    
    console.log('Resultado da criação de tabelas:', result);
    
    // Inserir conquistas predefinidas
    const insertAchievements = async () => {
      try {
        // Verificar se já existem conquistas
        const { data, error: countError } = await supabase
          .from('achievements')
          .select('id')
          .limit(1);
          
        if (countError) {
          console.error('Erro ao verificar conquistas existentes:', countError);
          return;
        }
        
        // Se não houver conquistas, inserir as predefinidas
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
            },
            {
              name: 'Engajado',
              description: 'Visitou o site por 7 dias consecutivos',
              icon: 'calendar-check',
              category: 'engagement',
              required_points: 350,
              is_secret: false
            },
            {
              name: 'Filantropo',
              description: 'Doou para 10 campanhas diferentes',
              icon: 'award',
              category: 'donation',
              required_points: 1000,
              is_secret: false
            },
            {
              name: 'Multiplicador',
              description: 'Uma campanha que você criou recebeu 10 doações',
              icon: 'users',
              category: 'social',
              required_points: 500,
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
      } catch (error) {
        console.error('Erro ao inserir conquistas:', error);
      }
    };
    
    // Tentar inserir as conquistas
    await insertAchievements();
    
    console.log('Setup das tabelas de gamificação concluído com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao executar setup das tabelas de gamificação:', error);
    return false;
  }
}
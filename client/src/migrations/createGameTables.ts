import { supabase } from '../lib/supabase';

// Esta função cria as tabelas necessárias para o sistema de gamificação
export async function createGamificationTables() {
  try {
    console.log('Criando tabelas para o sistema de gamificação...');
    
    // Criar tabela de níveis de usuário
    const { error: userLevelsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS user_levels (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          level INTEGER NOT NULL DEFAULT 1,
          total_points INTEGER NOT NULL DEFAULT 0,
          progress INTEGER NOT NULL DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (userLevelsError) {
      console.error('Erro ao criar tabela user_levels:', userLevelsError);
    } else {
      console.log('Tabela user_levels criada com sucesso.');
    }
    
    // Criar tabela de conquistas
    const { error: achievementsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS achievements (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          icon TEXT NOT NULL,
          category TEXT NOT NULL,
          required_points INTEGER NOT NULL DEFAULT 0,
          is_secret BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (achievementsError) {
      console.error('Erro ao criar tabela achievements:', achievementsError);
    } else {
      console.log('Tabela achievements criada com sucesso.');
    }
    
    // Criar tabela de conquistas do usuário
    const { error: userAchievementsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS user_achievements (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          achievement_id INTEGER NOT NULL,
          unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          progress INTEGER NOT NULL DEFAULT 0
        );
      `
    });
    
    if (userAchievementsError) {
      console.error('Erro ao criar tabela user_achievements:', userAchievementsError);
    } else {
      console.log('Tabela user_achievements criada com sucesso.');
    }
    
    // Criar tabela de pontos de atividade do usuário
    const { error: userActivityPointsError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS user_activity_points (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          category TEXT NOT NULL,
          points INTEGER NOT NULL DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (userActivityPointsError) {
      console.error('Erro ao criar tabela user_activity_points:', userActivityPointsError);
    } else {
      console.log('Tabela user_activity_points criada com sucesso.');
    }
    
    // Criar tabela de histórico de pontos
    const { error: pointsHistoryError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS points_history (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          category TEXT NOT NULL,
          points INTEGER NOT NULL,
          description TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (pointsHistoryError) {
      console.error('Erro ao criar tabela points_history:', pointsHistoryError);
    } else {
      console.log('Tabela points_history criada com sucesso.');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao criar tabelas de gamificação:', error);
    return false;
  }
}
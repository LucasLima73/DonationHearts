-- Migration para criar as tabelas do sistema de gamificação

-- Tabela de níveis de usuário
CREATE TABLE IF NOT EXISTS user_levels (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  total_points INTEGER NOT NULL DEFAULT 0,
  progress INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de conquistas
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

-- Tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id INTEGER NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER NOT NULL DEFAULT 0
);

-- Tabela de pontos de atividade do usuário
CREATE TABLE IF NOT EXISTS user_activity_points (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de histórico de pontos
CREATE TABLE IF NOT EXISTS points_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir conquistas predefinidas
INSERT INTO achievements (name, description, icon, category, required_points, is_secret)
VALUES 
  ('Primeira Doação', 'Realizou sua primeira doação', 'heart', 'donation', 50, false),
  ('Doador Frequente', 'Realizou 5 doações', 'heart-pulse', 'donation', 250, false),
  ('Doador Generoso', 'Doou mais de R$ 100 no total', 'hand-coins', 'donation', 500, false),
  ('Apoiador Iniciante', 'Apoiou 3 campanhas diferentes', 'hand-holding-heart', 'donation', 150, false),
  ('Influenciador', 'Compartilhou 5 campanhas nas redes sociais', 'share', 'sharing', 250, false),
  ('Engajado', 'Visitou o site por 7 dias consecutivos', 'calendar-check', 'engagement', 350, false),
  ('Filantropo', 'Doou para 10 campanhas diferentes', 'award', 'donation', 1000, false),
  ('Multiplicador', 'Uma campanha que você criou recebeu 10 doações', 'users', 'social', 500, false)
ON CONFLICT (id) DO NOTHING;
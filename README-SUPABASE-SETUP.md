# Configuração do Banco de Dados no Supabase

Para que a aplicação funcione corretamente, você precisa configurar as tabelas no seu projeto Supabase. Siga os passos abaixo:

## Passo 1: Acesse o Console SQL do Supabase

1. Faça login na sua conta do [Supabase](https://app.supabase.io)
2. Selecione seu projeto
3. No menu lateral esquerdo, clique em "SQL Editor"
4. Clique em "New Query"

## Passo 2: Execute o Script SQL

Copie e cole o conteúdo abaixo no editor SQL:

```sql
-- Criação da tabela de campanhas
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  goal INTEGER NOT NULL,
  raised INTEGER DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL,
  status TEXT DEFAULT 'active'
);

-- Criação da tabela de doações
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount INTEGER NOT NULL,
  campaign_id UUID NOT NULL REFERENCES campaigns(id),
  user_id UUID NOT NULL,
  message TEXT,
  anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
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
  user_id UUID NOT NULL,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Criação da tabela de pontos de atividade do usuário
CREATE TABLE IF NOT EXISTS user_activity_points (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  points INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criação da tabela de histórico de pontos
CREATE TABLE IF NOT EXISTS points_history (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Passo 3: Configurar Permissões (RLS)

As políticas de Row Level Security (RLS) garantem que os usuários só possam acessar seus próprios dados. Para configurá-las:

1. No menu lateral, vá para "Authentication" > "Policies"
2. Para cada tabela, clique em "New Policy" e configure de acordo com suas necessidades:

### Para a tabela campaigns:

- **Para leitura (SELECT)**
  - Permitir que todos os usuários vejam todas as campanhas

- **Para escrita (INSERT, UPDATE, DELETE)**
  - Permitir que os usuários só modifiquem suas próprias campanhas

### Para a tabela donations:

- **Para leitura (SELECT)**
  - Permitir que os usuários vejam todas as doações

- **Para escrita (INSERT)**
  - Permitir que qualquer usuário faça doações

## Passo 4: Configurar Storage

1. No menu lateral, vá para "Storage"
2. Crie um novo bucket chamado "campaign-images"
3. Configure as permissões para permitir que usuários autenticados façam upload de imagens

Após concluir essas etapas, sua aplicação estará pronta para usar o banco de dados Supabase!
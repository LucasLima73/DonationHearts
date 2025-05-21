import { z } from 'zod';
import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

// Definição da tabela de conquistas
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  category: text('category').notNull(),
  requiredPoints: integer('required_points').notNull().default(0),
  isSecret: boolean('is_secret').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Conquistas do usuário
export const userAchievements = pgTable('user_achievements', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  achievementId: integer('achievement_id').notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow(),
  progress: integer('progress').notNull().default(0),
});

// Pontos de atividade do usuário
export const userActivityPoints = pgTable('user_activity_points', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull().default(0),
  lastUpdated: timestamp('last_updated').defaultNow(),
});

// Histórico de pontos
export const pointsHistory = pgTable('points_history', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  category: text('category').notNull(),
  points: integer('points').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Categorias de pontos de atividade
export enum PointCategory {
  DONATION = 'donation',
  SHARING = 'sharing',
  ENGAGEMENT = 'engagement',
  CONSISTENCY = 'consistency',
  SOCIAL = 'social'
}

// Categorias de conquistas
export enum AchievementCategory {
  DONATION = 'donation',
  SHARING = 'sharing',
  ENGAGEMENT = 'engagement',
  CONSISTENCY = 'consistency',
  SOCIAL = 'social',
  SPECIAL = 'special'
}

// Definição de um tipo para as conquistas
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type UserActivityPoint = typeof userActivityPoints.$inferSelect;
export type PointHistory = typeof pointsHistory.$inferSelect;

// Schemas de inserção
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertUserAchievementSchema = createInsertSchema(userAchievements);
export const insertUserActivityPointSchema = createInsertSchema(userActivityPoints);
export const insertPointHistorySchema = createInsertSchema(pointsHistory);

// Tipos de inserção
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertUserActivityPoint = z.infer<typeof insertUserActivityPointSchema>;
export type InsertPointHistory = z.infer<typeof insertPointHistorySchema>;

// Lista de conquistas predefinidas
export const predefinedAchievements: InsertAchievement[] = [
  // Conquistas de doação
  {
    name: 'Primeiro Passo',
    description: 'Faça sua primeira doação',
    icon: 'heart',
    category: AchievementCategory.DONATION,
    requiredPoints: 1,
    isSecret: false,
  },
  {
    name: 'Doador Regular',
    description: 'Faça 5 doações',
    icon: 'repeat',
    category: AchievementCategory.DONATION,
    requiredPoints: 5,
    isSecret: false,
  },
  {
    name: 'Coração Generoso',
    description: 'Doe um total de R$1.000',
    icon: 'heart-handshake',
    category: AchievementCategory.DONATION,
    requiredPoints: 1000,
    isSecret: false,
  },
  
  // Conquistas de compartilhamento
  {
    name: 'Compartilhador',
    description: 'Compartilhe uma campanha nas redes sociais',
    icon: 'share',
    category: AchievementCategory.SHARING,
    requiredPoints: 1,
    isSecret: false,
  },
  {
    name: 'Influenciador',
    description: 'Tenha 10 pessoas que doaram a partir do seu link',
    icon: 'users',
    category: AchievementCategory.SHARING,
    requiredPoints: 10,
    isSecret: false,
  },
  
  // Conquistas de engajamento
  {
    name: 'Participante',
    description: 'Complete seu perfil',
    icon: 'user-check',
    category: AchievementCategory.ENGAGEMENT,
    requiredPoints: 1,
    isSecret: false,
  },
  {
    name: 'Comentarista',
    description: 'Deixe 5 comentários em campanhas',
    icon: 'message-circle',
    category: AchievementCategory.ENGAGEMENT,
    requiredPoints: 5,
    isSecret: false,
  },
  
  // Conquistas de consistência
  {
    name: 'Visitante Fiel',
    description: 'Acesse a plataforma por 7 dias consecutivos',
    icon: 'calendar-check',
    category: AchievementCategory.CONSISTENCY,
    requiredPoints: 7,
    isSecret: false,
  },
  {
    name: 'Doador Mensal',
    description: 'Faça doações em 3 meses consecutivos',
    icon: 'calendar-heart',
    category: AchievementCategory.CONSISTENCY,
    requiredPoints: 3,
    isSecret: false,
  },
  
  // Conquistas sociais
  {
    name: 'Amigo Solidário',
    description: 'Convide um amigo que se cadastrou na plataforma',
    icon: 'user-plus',
    category: AchievementCategory.SOCIAL,
    requiredPoints: 1,
    isSecret: false,
  },
  {
    name: 'Embaixador',
    description: 'Convide 5 amigos que fizeram doações',
    icon: 'award',
    category: AchievementCategory.SOCIAL,
    requiredPoints: 5,
    isSecret: false,
  },
  
  // Conquistas especiais (secretas)
  {
    name: 'Herói Anônimo',
    description: 'Faça 3 doações anônimas',
    icon: 'incognito',
    category: AchievementCategory.SPECIAL,
    requiredPoints: 3,
    isSecret: true,
  },
  {
    name: 'Rei da Generosidade',
    description: 'Faça uma doação de R$10.000 ou mais',
    icon: 'crown',
    category: AchievementCategory.SPECIAL,
    requiredPoints: 1,
    isSecret: true,
  },
];
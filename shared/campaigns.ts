import { pgTable, text, integer, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { InferSelectModel } from 'drizzle-orm';

// Tabela de campanhas
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  goal: integer('goal').notNull(),
  raised: integer('raised').default(0),
  image_url: text('image_url'),
  created_at: timestamp('created_at').defaultNow(),
  end_date: timestamp('end_date'),
  user_id: uuid('user_id').notNull(),
  status: text('status').default('active'), // active, completed, canceled
  before_story: text('before_story'),
  after_story: text('after_story'),
  before_image_url: text('before_image_url'),
  after_image_url: text('after_image_url'),
  impact_description: text('impact_description')
});

// Tabela de doações
export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: integer('amount').notNull(),
  campaign_id: uuid('campaign_id').notNull().references(() => campaigns.id),
  user_id: uuid('user_id').notNull(),
  message: text('message'),
  anonymous: boolean('anonymous').default(false),
  created_at: timestamp('created_at').defaultNow(),
  payment_intent_id: text('payment_intent_id'),
  payment_status: text('payment_status').default('succeeded')
});

// Schemas para validação usando zod
export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  raised: true,
  created_at: true
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  created_at: true
});

// Tipos de inferência para uso no front-end
export type Campaign = InferSelectModel<typeof campaigns> & {
  creator_name?: string; // Campo adicional para armazenar o nome do criador
};
export type Donation = InferSelectModel<typeof donations>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

// Schema para atualização de campanha (permite campos parciais)
export const updateCampaignSchema = insertCampaignSchema.partial();
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;
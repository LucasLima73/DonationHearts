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
  status: text('status').default('active') // active, completed, canceled
});

// Tabela de doações
export const donations = pgTable('donations', {
  id: uuid('id').defaultRandom().primaryKey(),
  amount: integer('amount').notNull(),
  campaign_id: uuid('campaign_id').notNull().references(() => campaigns.id),
  user_id: uuid('user_id').notNull(),
  message: text('message'),
  anonymous: boolean('anonymous').default(false),
  created_at: timestamp('created_at').defaultNow()
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
export type Campaign = InferSelectModel<typeof campaigns>;
export type Donation = InferSelectModel<typeof donations>;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;

// Schema para atualização de campanha (permite campos parciais)
export const updateCampaignSchema = insertCampaignSchema.partial();
export type UpdateCampaign = z.infer<typeof updateCampaignSchema>;
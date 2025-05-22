import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

// Inicializar cliente Supabase para interagir com o banco de dados
if (!process.env.DATABASE_URL) {
  throw new Error('Missing required database URL: DATABASE_URL');
}

// Importar as configurações do ambiente do cliente
import { env } from '../client/src/lib/env';

// Usar os valores de URL e chave do Supabase do arquivo de configuração
const supabaseUrl = env.supabase.url;
const supabaseKey = env.supabase.anonKey;

// Criar cliente Supabase para interagir com o banco de dados
const supabase = createClient(supabaseUrl, supabaseKey);

// Funções auxiliares para gerenciar pontos e níveis
async function updateUserPoints(userId: string, pointsToAdd: number, category: string, description: string) {
  try {
    if (!userId) return;
    
    // 1. Buscar nível atual do usuário
    const { data: levelData } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // 2. Calcular novos pontos totais
    const currentPoints = levelData?.total_points || 0;
    const newTotalPoints = currentPoints + pointsToAdd;
    
    // 3. Calcular novo nível e progresso
    const newLevel = calculateUserLevel(newTotalPoints);
    const newProgress = calculateLevelProgress(newTotalPoints);
    
    // 4. Registrar histórico de pontos
    await supabase
      .from('points_history')
      .insert({
        user_id: userId,
        category,
        points: pointsToAdd,
        description,
        created_at: new Date().toISOString()
      });
    
    // 5. Atualizar ou criar registro de nível do usuário
    if (levelData) {
      await supabase
        .from('user_levels')
        .update({
          level: newLevel,
          total_points: newTotalPoints,
          progress: newProgress,
          last_updated: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      await supabase
        .from('user_levels')
        .insert({
          user_id: userId,
          level: newLevel,
          total_points: newTotalPoints,
          progress: newProgress,
          last_updated: new Date().toISOString()
        });
    }
    
    return { level: newLevel, totalPoints: newTotalPoints, progress: newProgress };
  } catch (error) {
    console.error('Erro ao atualizar pontos do usuário:', error);
    return null;
  }
}

// Calcular nível do usuário com base nos pontos
function calculateUserLevel(points: number): number {
  const levelDefinitions = [
    { level: 1, pointsRequired: 0 },
    { level: 2, pointsRequired: 100 },
    { level: 3, pointsRequired: 250 },
    { level: 4, pointsRequired: 500 },
    { level: 5, pointsRequired: 1000 },
    { level: 6, pointsRequired: 2000 },
    { level: 7, pointsRequired: 4000 },
    { level: 8, pointsRequired: 7000 },
    { level: 9, pointsRequired: 10000 },
    { level: 10, pointsRequired: 15000 },
  ];
  
  // Encontrar o nível correspondente aos pontos
  const currentLevel = [...levelDefinitions].reverse().find(
    level => points >= level.pointsRequired
  );
  
  return currentLevel?.level || 1;
}

// Calcular progresso percentual para o próximo nível
function calculateLevelProgress(points: number): number {
  const levelDefinitions = [
    { level: 1, pointsRequired: 0 },
    { level: 2, pointsRequired: 100 },
    { level: 3, pointsRequired: 250 },
    { level: 4, pointsRequired: 500 },
    { level: 5, pointsRequired: 1000 },
    { level: 6, pointsRequired: 2000 },
    { level: 7, pointsRequired: 4000 },
    { level: 8, pointsRequired: 7000 },
    { level: 9, pointsRequired: 10000 },
    { level: 10, pointsRequired: 15000 },
  ];
  
  // Encontrar nível atual e próximo nível
  const currentLevelData = [...levelDefinitions].reverse().find(
    level => points >= level.pointsRequired
  ) || levelDefinitions[0];
  
  const nextLevelIndex = levelDefinitions.findIndex(
    level => level.level === currentLevelData.level
  ) + 1;
  
  const nextLevelData = nextLevelIndex < levelDefinitions.length 
    ? levelDefinitions[nextLevelIndex] 
    : null;
  
  // Se já está no nível máximo, retorna 100%
  if (!nextLevelData) return 100;
  
  // Calcular progresso percentual
  const currentLevelPoints = currentLevelData.pointsRequired;
  const nextLevelPoints = nextLevelData.pointsRequired;
  const pointsRange = nextLevelPoints - currentLevelPoints;
  const userPointsInRange = points - currentLevelPoints;
  
  return Math.min(100, Math.round((userPointsInRange / pointsRange) * 100));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota para processar pagamentos de doação
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, campaignId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valor da doação inválido" });
      }
      
      // Criar um PaymentIntent no Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Converter para centavos
        currency: "brl",
        metadata: {
          campaignId: campaignId || "",
          type: "donation"
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Erro ao criar payment intent:", error);
      res.status(500).json({ 
        error: "Erro ao processar pagamento",
        message: error.message 
      });
    }
  });

  // Rota para registrar doação após pagamento bem-sucedido
  app.post("/api/register-donation", async (req: Request, res: Response) => {
    try {
      const { 
        paymentIntentId, 
        userId, 
        campaignId, 
        amount, 
        anonymous = false 
      } = req.body;
      
      if (!paymentIntentId || !campaignId || !amount) {
        return res.status(400).json({ error: "Dados incompletos" });
      }
      
      // Verificar o status do pagamento no Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Pagamento não confirmado" });
      }
      
      // Inserir a doação no banco de dados usando Supabase
      const donationData = {
        amount,
        campaign_id: campaignId,
        user_id: userId,
        anonymous,
        payment_intent_id: paymentIntentId,
        payment_status: 'succeeded',
        created_at: new Date().toISOString()
      };
      
      // Inserir a doação no banco de dados
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .insert(donationData)
        .select()
        .single();
      
      if (donationError) {
        console.error("Erro ao inserir doação:", donationError);
        return res.status(500).json({ error: "Erro ao registrar doação no banco de dados" });
      }
      
      // Atualizar o valor arrecadado na campanha
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('raised, creator_id')
        .eq('id', campaignId)
        .single();
      
      if (!campaignError && campaign) {
        const newRaisedAmount = (campaign.raised || 0) + parseFloat(amount);
        
        await supabase
          .from('campaigns')
          .update({ raised: newRaisedAmount })
          .eq('id', campaignId);
          
        // Atribuir pontos ao doador (50 pontos por doação)
        if (userId) {
          await updateUserPoints(
            userId,
            50,
            'donation',
            `Você fez uma doação de R$${parseFloat(amount).toFixed(2)}`
          );
        }
        
        // Atribuir pontos ao criador da campanha (20 pontos por doação recebida)
        if (campaign.creator_id && campaign.creator_id !== userId) {
          await updateUserPoints(
            campaign.creator_id,
            20,
            'donation',
            `Você recebeu uma doação de R$${parseFloat(amount).toFixed(2)} em sua campanha`
          );
        }
      } else if (campaignError) {
        console.error("Erro ao buscar campanha:", campaignError);
      }
      
      res.json({ 
        success: true,
        donation: donation || donationData,
        points: userId ? 50 : 0
      });
    } catch (error: any) {
      console.error("Erro ao registrar doação:", error);
      res.status(500).json({ 
        error: "Erro ao registrar doação",
        message: error.message 
      });
    }
  });

  // Verificar status de um pagamento
  app.post("/api/verify-payment", async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "ID do pagamento não fornecido" });
      }
      
      // Buscar informações do PaymentIntent no Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Converter de centavos para reais
        metadata: paymentIntent.metadata
      });
    } catch (error: any) {
      console.error("Erro ao verificar pagamento:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Webhook para receber eventos do Stripe
  app.post("/api/webhook", async (req: Request, res: Response) => {
    const payload = req.body;
    
    try {
      // Aqui você processaria eventos do Stripe
      // Como pagamentos confirmados, falhas, etc.
      
      res.json({ received: true });
    } catch (error: any) {
      console.error("Erro no webhook:", error);
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

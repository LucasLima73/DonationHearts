import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

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
      
      // Registrar a doação no banco de dados
      // Aqui você usaria o storage para inserir a doação
      // E atualizar o valor arrecadado na campanha
      
      res.json({ success: true });
    } catch (error: any) {
      console.error("Erro ao registrar doação:", error);
      res.status(500).json({ 
        error: "Erro ao registrar doação",
        message: error.message 
      });
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

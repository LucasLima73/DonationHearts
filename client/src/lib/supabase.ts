import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Usando o URL e chave do arquivo env.ts
const supabaseUrl = env.supabase.url;
const supabaseAnonKey = env.supabase.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Authentication will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserData = {
  id?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  provider?: string;
  created_at?: string;
};

export async function getCurrentUser(): Promise<UserData | null> {
  try {
    // Primeiro tentar obter a sessão do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const user = session.user;
      
      // Extrair metadados do usuário
      const userData: UserData = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider || 'email',
        created_at: user.created_at
      };
      
      return userData;
    }
    
    // Se não houver sessão, tentar obter via getUser
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Extrair metadados do usuário
    const userData: UserData = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider || 'email',
      created_at: user.created_at
    };
    
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
}
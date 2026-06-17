import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para obter dados do usuário
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Profile não encontrado
      return null;
    }
    throw error;
  }
  return data;
}

// Helper para criar profile do usuário
export async function createUserProfile(userId: string, name: string, role: 'admin' | 'leitor') {
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        name: name,
        role: role,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

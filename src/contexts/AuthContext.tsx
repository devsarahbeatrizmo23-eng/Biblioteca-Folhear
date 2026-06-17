import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { supabase, createUserProfile, getUserProfile } from '../services/supabase';

// Converter UUID para número para compatibilidade com tipo User
function uuidToNumber(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) || 1; // Garantir que nunca seja 0
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restaurar sessão a partir do Supabase
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Buscar dados do perfil
          let profile = await getUserProfile(session.user.id);
          
          // Se profile não existe, pular (pode ser novo usuário)
          if (!profile) {
            setIsLoading(false);
            return;
          }
          
          const userData: User = {
            id: uuidToNumber(profile.id),
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
            created_at: profile.created_at,
          };
          
          setUser(userData);
          setToken(session.access_token);
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            let profile = await getUserProfile(session.user.id);
            
            // Se profile não existe, pular
            if (!profile) {
              setUser(null);
              setToken(null);
              return;
            }
            
            const userData: User = {
              id: uuidToNumber(profile.id),
              name: profile.name,
              email: session.user.email || '',
              role: profile.role,
              created_at: profile.created_at,
            };
            setUser(userData);
            setToken(session.access_token);
          } catch (error) {
            console.error('Erro ao buscar perfil:', error);
          }
        } else {
          setUser(null);
          setToken(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);

      if (data.session?.user) {
        let profile = await getUserProfile(data.session.user.id);
        
        if (!profile) {
          throw new Error('Perfil do usuário não encontrado. Por favor, cadastre-se novamente.');
        }
        
        const userData: User = {
          id: uuidToNumber(profile.id),
          name: profile.name,
          email: data.session.user.email || '',
          role: profile.role,
          created_at: profile.created_at,
        };
        
        setUser(userData);
        setToken(data.session.access_token);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';
      throw new Error(message);
    }
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
      try {
        // Registrar no Supabase Auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw new Error(error.message);

        if (data.user) {
          // Criar perfil do usuário
          await createUserProfile(data.user.id, name, role);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao cadastrar';
        throw new Error(message);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao resetar senha';
      throw new Error(message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

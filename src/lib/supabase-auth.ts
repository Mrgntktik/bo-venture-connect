import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type { User, Session };

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  business_name?: string;
  logo?: string;
  cover_photo?: string;
  description?: string;
  phone?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  role?: 'admin' | 'creator';
}

export const getCurrentUser = async (): Promise<UserProfile | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single();

  return {
    id: session.user.id,
    email: session.user.email!,
    name: profile?.name || '',
    business_name: profile?.business_name,
    logo: profile?.logo,
    cover_photo: profile?.cover_photo,
    description: profile?.description,
    phone: profile?.phone,
    address: profile?.address,
    facebook: profile?.facebook,
    instagram: profile?.instagram,
    twitter: profile?.twitter,
    role: userRole?.role || 'creator',
  };
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  businessName: string;
}) => {
  const redirectUrl = `${window.location.origin}/dashboard`;
  
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        name: userData.name,
        business_name: userData.businessName,
      },
    },
  });

  if (error) throw error;
  return data;
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateProfile = async (userId: string, updates: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
};

export const getUserRole = async (userId: string): Promise<'admin' | 'creator'> => {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  return data?.role || 'creator';
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  const role = await getUserRole(userId);
  return role === 'admin';
};

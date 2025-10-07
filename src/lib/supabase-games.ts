import { supabase } from '@/integrations/supabase/client';

export interface Game {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface GameImage {
  id: string;
  game_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export const getAllGames = async () => {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      game_images (*),
      profiles (
        id,
        name,
        business_name,
        logo
      )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getGamesByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      game_images (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getGameById = async (gameId: string) => {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      game_images (*),
      profiles (
        id,
        name,
        business_name,
        logo,
        phone,
        address,
        facebook,
        instagram,
        twitter
      )
    `)
    .eq('id', gameId)
    .single();

  if (error) throw error;
  return data;
};

export const createGame = async (gameData: {
  title: string;
  description: string;
  category: string;
  price?: number;
  user_id: string;
}) => {
  const { data, error } = await supabase
    .from('games')
    .insert([gameData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateGame = async (gameId: string, updates: Partial<Game>) => {
  const { data, error } = await supabase
    .from('games')
    .update(updates)
    .eq('id', gameId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGame = async (gameId: string) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId);

  if (error) throw error;
};

export const addGameImage = async (gameId: string, imageUrl: string, isPrimary: boolean = false) => {
  const { data, error } = await supabase
    .from('game_images')
    .insert([{
      game_id: gameId,
      image_url: imageUrl,
      is_primary: isPrimary,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGameImage = async (imageId: string) => {
  const { error } = await supabase
    .from('game_images')
    .delete()
    .eq('id', imageId);

  if (error) throw error;
};

export const trackWhatsAppClick = async (userId: string, gameId?: string) => {
  const { error } = await supabase
    .from('whatsapp_analytics')
    .insert([{
      user_id: userId,
      game_id: gameId,
    }]);

  if (error) throw error;
};

// Configuración de la API para conectar con XAMPP
const API_URL = 'http://localhost/blvgames/api';

interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  [key: string]: any;
}

export const api = {
  // Autenticación
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return response.json();
    },
    
    register: async (data: {
      name: string;
      email: string;
      password: string;
      businessName: string;
    }) => {
      const response = await fetch(`${API_URL}/auth.php?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  // Usuarios
  users: {
    getAll: async (role?: string) => {
      const url = role ? `${API_URL}/users.php?role=${role}` : `${API_URL}/users.php`;
      const response = await fetch(url);
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/users.php?id=${id}`);
      return response.json();
    },
    
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_URL}/users.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },

  // Juegos
  games: {
    getAll: async (filters?: { user_id?: string; status?: string }) => {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`${API_URL}/games.php?${params}`);
      return response.json();
    },
    
    getById: async (id: string) => {
      const response = await fetch(`${API_URL}/games.php?id=${id}`);
      return response.json();
    },
    
    create: async (data: any) => {
      const response = await fetch(`${API_URL}/games.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_URL}/games.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    
    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/games.php?id=${id}`, {
        method: 'DELETE',
      });
      return response.json();
    },
  },

  // Analytics
  analytics: {
    trackWhatsAppClick: async (userId: string, gameId?: string) => {
      const response = await fetch(`${API_URL}/analytics.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, game_id: gameId }),
      });
      return response.json();
    },
    
    getStats: async (userId?: string) => {
      const url = userId ? `${API_URL}/analytics.php?user_id=${userId}` : `${API_URL}/analytics.php`;
      const response = await fetch(url);
      return response.json();
    },
  },
};

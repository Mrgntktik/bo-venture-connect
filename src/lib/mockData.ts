export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'creator' | 'admin';
  businessName?: string;
  logo?: string;
  coverPhoto?: string;
  description?: string;
  phone?: string;
  address?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface Game {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const initializeMockData = () => {
  const users: User[] = [
    {
      id: '1',
      name: 'Carlos Mendoza',
      email: 'carlos@example.com',
      password: '123456',
      role: 'creator',
      businessName: 'Pixel Dreams Studio',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=PD',
      description: 'Desarrolladores independientes de juegos retro y pixel art',
      phone: '+591 70123456',
      address: 'La Paz, Bolivia',
      socialMedia: {
        facebook: 'pixeldreamsstudio',
        instagram: '@pixeldreams'
      }
    },
    {
      id: '2',
      name: 'María Rodríguez',
      email: 'maria@example.com',
      password: '123456',
      role: 'creator',
      businessName: 'Andean Games',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AG',
      description: 'Juegos inspirados en la cultura andina y folklore boliviano',
      phone: '+591 71234567',
      address: 'Cochabamba, Bolivia',
      socialMedia: {
        instagram: '@andeangames',
        twitter: '@andeangames'
      }
    },
    {
      id: '3',
      name: 'Jorge Torrez',
      email: 'jorge@example.com',
      password: '123456',
      role: 'creator',
      businessName: 'Altitude Interactive',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AI',
      description: 'Creadores de experiencias de juego únicas en alta definición',
      phone: '+591 72345678',
      address: 'Santa Cruz, Bolivia',
      socialMedia: {
        facebook: 'altitudeinteractive'
      }
    },
    {
      id: '4',
      name: 'Ana Gutiérrez',
      email: 'ana@example.com',
      password: '123456',
      role: 'creator',
      businessName: 'Chakana Studios',
      logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS',
      description: 'Juegos educativos y culturales para toda la familia',
      phone: '+591 73456789',
      address: 'El Alto, Bolivia',
      socialMedia: {
        instagram: '@chakanastudios',
        facebook: 'chakanastudios'
      }
    },
    {
      id: 'admin',
      name: 'Admin',
      email: 'admin@blvgames.bo',
      password: 'admin123',
      role: 'admin'
    }
  ];

  const games: Game[] = [
    // Games for User 1 (Pixel Dreams Studio)
    {
      id: 'g1',
      userId: '1',
      name: 'Retro Racer',
      description: 'Juego de carreras en pixel art con estética de los 80s',
      price: 15,
      images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f'],
      category: 'Acción',
      status: 'pending',
      createdAt: '2025-01-15'
    },
    {
      id: 'g2',
      userId: '1',
      name: 'Dungeon Quest',
      description: 'RPG clásico de mazmorras con combate por turnos',
      price: 25,
      images: ['https://images.unsplash.com/photo-1511512578047-dfb367046420'],
      category: 'RPG',
      status: 'pending',
      createdAt: '2025-01-20'
    },
    {
      id: 'g3',
      userId: '1',
      name: 'Space Shooter',
      description: 'Shooter espacial de scroll vertical con power-ups',
      price: 10,
      images: ['https://images.unsplash.com/photo-1614294148960-9aa740632a87'],
      category: 'Acción',
      status: 'pending',
      createdAt: '2025-02-01'
    },
    // Games for User 2 (Andean Games)
    {
      id: 'g4',
      userId: '2',
      name: 'Leyendas del Illimani',
      description: 'Aventura narrativa basada en mitos andinos',
      price: 30,
      images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e'],
      category: 'Aventura',
      status: 'pending',
      createdAt: '2025-01-18'
    },
    {
      id: 'g5',
      userId: '2',
      name: 'Tinkus Fighter',
      description: 'Juego de peleas inspirado en danzas tradicionales',
      price: 20,
      images: ['https://images.unsplash.com/photo-1552820728-8b83bb6b773f'],
      category: 'Acción',
      status: 'pending',
      createdAt: '2025-01-25'
    },
    {
      id: 'g6',
      userId: '2',
      name: 'Camino del Inca',
      description: 'Juego de estrategia sobre el imperio incaico',
      price: 35,
      images: ['https://images.unsplash.com/photo-1579047440969-351a7e8b8fbc'],
      category: 'Estrategia',
      status: 'pending',
      createdAt: '2025-02-05'
    },
    // Games for User 3 (Altitude Interactive)
    {
      id: 'g7',
      userId: '3',
      name: 'Mountain Rally',
      description: 'Simulador de rally en los caminos de montaña de Bolivia',
      price: 40,
      images: ['https://images.unsplash.com/photo-1511882150382-421056c89033'],
      category: 'Simulación',
      status: 'pending',
      createdAt: '2025-01-22'
    },
    {
      id: 'g8',
      userId: '3',
      name: 'Sky Cities',
      description: 'Constructor de ciudades en las alturas',
      price: 45,
      images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc'],
      category: 'Simulación',
      status: 'pending',
      createdAt: '2025-01-28'
    },
    {
      id: 'g9',
      userId: '3',
      name: 'Altitude Wars',
      description: 'Juego multijugador de batallas estratégicas',
      price: 50,
      images: ['https://images.unsplash.com/photo-1556438064-2d7646166914'],
      category: 'Estrategia',
      status: 'pending',
      createdAt: '2025-02-03'
    },
    // Games for User 4 (Chakana Studios)
    {
      id: 'g10',
      userId: '4',
      name: 'Aymara Words',
      description: 'Juego educativo para aprender vocabulario aymara',
      price: 12,
      images: ['https://images.unsplash.com/photo-1509390144746-7aeb13b99d28'],
      category: 'Educativo',
      status: 'pending',
      createdAt: '2025-01-19'
    },
    {
      id: 'g11',
      userId: '4',
      name: 'Historia Boliviana',
      description: 'Aventura interactiva sobre la historia de Bolivia',
      price: 18,
      images: ['https://images.unsplash.com/photo-1531747118685-ca8fa6e08806'],
      category: 'Educativo',
      status: 'pending',
      createdAt: '2025-01-26'
    },
    {
      id: 'g12',
      userId: '4',
      name: 'Eco Quest',
      description: 'Juego sobre conservación del medio ambiente andino',
      price: 15,
      images: ['https://images.unsplash.com/photo-1472289065668-ce650ac443d2'],
      category: 'Educativo',
      status: 'pending',
      createdAt: '2025-02-02'
    }
  ];

  // Initialize localStorage if empty
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  if (!localStorage.getItem('games')) {
    localStorage.setItem('games', JSON.stringify(games));
  }
};

export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getGames = (): Game[] => {
  const games = localStorage.getItem('games');
  return games ? JSON.parse(games) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const saveGames = (games: Game[]) => {
  localStorage.setItem('games', JSON.stringify(games));
};

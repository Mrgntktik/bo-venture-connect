import { User, getUsers, saveUsers } from './mockData';

export type { User };

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const register = (userData: Partial<User>): User => {
  const users = getUsers();
  
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name || '',
    email: userData.email || '',
    password: userData.password || '',
    role: 'creator',
    businessName: userData.businessName || '',
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=${userData.businessName}`,
  };
  
  users.push(newUser);
  saveUsers(users);
  
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('currentUser', JSON.stringify(users[index]));
    }
  }
};

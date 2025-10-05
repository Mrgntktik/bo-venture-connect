import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MessageCircle, Gamepad, Sword, Brain, Trophy } from 'lucide-react';
import { getUsers, getGames, User, Game } from '@/lib/mockData';
import { Link } from 'react-router-dom';
import bgImage from '@/assets/homepage-bg.jpg';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setUsers(getUsers().filter(u => u.role === 'creator'));
    setGames(getGames().filter(g => g.status === 'approved'));
  }, []);

  const categories = [
    { name: 'Acción', icon: Sword, color: 'text-red-500' },
    { name: 'Aventura', icon: Gamepad, color: 'text-blue-500' },
    { name: 'Estrategia', icon: Brain, color: 'text-purple-500' },
    { name: 'RPG', icon: Trophy, color: 'text-yellow-500' },
  ];

  const filteredUsers = users.filter(user =>
    user.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="relative">
        <div 
          className="relative py-24 px-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                Descubre y apoya el{' '}
                <span className="text-primary">talento local</span>
              </h1>
              
              <p className="text-xl text-muted-foreground">
                La plataforma boliviana para creadores y jugadores de videojuegos independientes
              </p>

              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar estudios, juegos..."
                  className="pl-12 h-14 text-lg shadow-elevated"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button 
                size="lg"
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-elevated hover:scale-110 transition-smooth z-50"
                variant="secondary"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Categorías Populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card 
                  key={category.name}
                  className="cursor-pointer hover:shadow-elevated transition-smooth"
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 space-y-3">
                    <category.icon className={`h-12 w-12 ${category.color}`} />
                    <span className="font-semibold">{category.name}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Estudios Destacados</h2>
              <Button variant="ghost">Ver todos</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const userGames = games.filter(g => g.userId === user.id);
                
                return (
                  <Link key={user.id} to={`/studio/${user.id}`}>
                    <Card className="hover:shadow-elevated transition-smooth cursor-pointer overflow-hidden h-full">
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20" />
                      <CardContent className="p-6 -mt-12 relative">
                        <img 
                          src={user.logo} 
                          alt={user.businessName}
                          className="w-20 h-20 rounded-xl bg-card border-4 border-card shadow-elevated mb-4"
                        />
                        
                        <h3 className="text-xl font-bold mb-2">{user.businessName}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {user.description || 'Estudio de desarrollo de videojuegos'}
                        </p>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {userGames.length} {userGames.length === 1 ? 'juego' : 'juegos'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

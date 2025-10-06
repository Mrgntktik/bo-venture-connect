import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUsers, getGames, User, Game } from '@/lib/mockData';
import { MessageCircle, Facebook, Instagram, Twitter, MapPin, Phone } from 'lucide-react';

export default function StudioProfile() {
  const { id } = useParams<{ id: string }>();
  const [studio, setStudio] = useState<User | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    if (id) {
      const users = getUsers();
      const foundStudio = users.find(u => u.id === id);
      setStudio(foundStudio || null);

      const allGames = getGames();
      setGames(allGames.filter(g => g.userId === id && g.status === 'approved'));
    }
  }, [id]);

  if (!studio) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Estudio no encontrado</p>
        </div>
      </Layout>
    );
  }

  const handleWhatsApp = () => {
    window.open('https://wa.me/59177360690?text=Hola', '_blank');
  };

  return (
    <Layout>
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-primary/20 to-secondary/20" />
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 mb-8">
            <div className="bg-card rounded-2xl shadow-elevated p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img 
                  src={studio.logo} 
                  alt={studio.businessName}
                  className="w-32 h-32 rounded-2xl bg-muted"
                />
                
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2">{studio.businessName}</h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    {studio.description || 'Estudio de desarrollo de videojuegos'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
                    {studio.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {studio.address}
                      </div>
                    )}
                    {studio.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {studio.phone}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {studio.phone && (
                      <Button size="lg" onClick={handleWhatsApp}>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Contactar por WhatsApp
                      </Button>
                    )}
                    
                    {studio.socialMedia?.facebook && (
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://facebook.com/${studio.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    
                    {studio.socialMedia?.instagram && (
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://instagram.com/${studio.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                    
                    {studio.socialMedia?.twitter && (
                      <Button variant="outline" size="lg" asChild>
                        <a href={`https://twitter.com/${studio.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="py-8">
            <h2 className="text-3xl font-bold mb-6">Juegos del Estudio</h2>
            
            {games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <Card key={game.id} className="shadow-card hover:shadow-elevated transition-smooth overflow-hidden">
                    <div className="aspect-video bg-muted">
                      <img 
                        src={game.images[0]} 
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{game.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {game.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge>{game.category}</Badge>
                        <span className="text-2xl font-bold text-primary">
                          Bs. {game.price}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Este estudio aún no ha publicado juegos
                </p>
              </Card>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}

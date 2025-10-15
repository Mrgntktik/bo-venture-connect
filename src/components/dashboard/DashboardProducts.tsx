import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getGamesByUser, deleteGame, type Game } from '@/lib/supabase-games';
import { ProductDialog } from './ProductDialog';
import { useToast } from '@/hooks/use-toast';

interface DashboardProductsProps {
  userId: string;
}

export const DashboardProducts = ({ userId }: DashboardProductsProps) => {
  const [games, setGames] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadGames();
  }, [userId]);

  const loadGames = async () => {
    try {
      setIsLoading(true);
      const data = await getGamesByUser(userId);
      setGames(data || []);
    } catch (error) {
      console.error('Error loading games:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los juegos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (gameId: string) => {
    try {
      await deleteGame(gameId);
      await loadGames();
      
      toast({
        title: 'Juego eliminado',
        description: 'El juego ha sido eliminado correctamente',
      });
    } catch (error) {
      console.error('Error deleting game:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el juego',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingGame(null);
    loadGames();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Mis Juegos</h2>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          <Plus className="h-5 w-5 mr-2" />
          Añadir Nuevo Juego
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => {
          const primaryImage = game.game_images?.find((img: any) => img.is_primary)?.image_url || 
                               game.game_images?.[0]?.image_url || 
                               'https://images.unsplash.com/photo-1550745165-9bc0b252726f';
          
          return (
            <Card key={game.id} className="shadow-card hover:shadow-elevated transition-smooth overflow-hidden">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={primaryImage} 
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    game.status === 'approved' ? 'bg-primary text-primary-foreground' :
                    game.status === 'rejected' ? 'bg-destructive text-destructive-foreground' :
                    'bg-secondary text-secondary-foreground'
                  }`}>
                    {game.status === 'approved' ? 'Aprobado' :
                     game.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{game.category}</p>
                <p className="text-xl font-bold text-primary mb-4">Bs. {game.price || 0}</p>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(game)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDelete(game.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {games.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Aún no has añadido ningún juego
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Añadir tu primer juego
          </Button>
        </Card>
      )}

      <ProductDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        userId={userId}
        game={editingGame}
      />
    </div>
  );
};

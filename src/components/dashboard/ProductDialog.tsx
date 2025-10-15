import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createGame, updateGame, addGameImage, deleteGameImage } from '@/lib/supabase-games';
import { useToast } from '@/hooks/use-toast';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  game?: any | null;
}

export const ProductDialog = ({ open, onClose, userId, game }: ProductDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (game) {
      const primaryImage = game.game_images?.find((img: any) => img.is_primary)?.image_url || 
                           game.game_images?.[0]?.image_url || '';
      
      setFormData({
        title: game.title || '',
        description: game.description || '',
        price: game.price?.toString() || '',
        category: game.category || '',
        imageUrl: primaryImage
      });
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
      });
    }
  }, [game, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (game) {
        // Actualizar juego existente
        await updateGame(game.id, {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        });

        // Actualizar imagen si cambió
        if (formData.imageUrl && game.game_images?.length > 0) {
          const oldImageId = game.game_images[0].id;
          await deleteGameImage(oldImageId);
          await addGameImage(game.id, formData.imageUrl, true);
        } else if (formData.imageUrl) {
          await addGameImage(game.id, formData.imageUrl, true);
        }
      } else {
        // Crear nuevo juego
        const newGame = await createGame({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          price: parseFloat(formData.price),
          user_id: userId,
        });

        // Agregar imagen
        if (formData.imageUrl) {
          await addGameImage(newGame.id, formData.imageUrl, true);
        }
      }
      
      toast({
        title: game ? 'Juego actualizado' : 'Juego creado',
        description: game ? 'El juego se actualizó correctamente' : 'El juego se creó y está pendiente de aprobación',
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el juego',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{game ? 'Editar Juego' : 'Añadir Nuevo Juego'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nombre del Juego</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (Bs.)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Acción">Acción</SelectItem>
                  <SelectItem value="Aventura">Aventura</SelectItem>
                  <SelectItem value="RPG">RPG</SelectItem>
                  <SelectItem value="Estrategia">Estrategia</SelectItem>
                  <SelectItem value="Simulación">Simulación</SelectItem>
                  <SelectItem value="Educativo">Educativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de Imagen</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : game ? 'Actualizar' : 'Crear Juego'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Game, getGames, saveGames } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  game?: Game | null;
}

export const ProductDialog = ({ open, onClose, userId, game }: ProductDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        description: game.description,
        price: game.price.toString(),
        category: game.category,
        imageUrl: game.images[0]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: ''
      });
    }
  }, [game, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const allGames = getGames();
    
    if (game) {
      const index = allGames.findIndex(g => g.id === game.id);
      if (index !== -1) {
        allGames[index] = {
          ...allGames[index],
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          images: [formData.imageUrl || allGames[index].images[0]]
        };
      }
    } else {
      const newGame: Game = {
        id: `g${Date.now()}`,
        userId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'],
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      allGames.push(newGame);
    }
    
    saveGames(allGames);
    
    toast({
      title: game ? 'Juego actualizado' : 'Juego creado',
      description: game ? 'El juego se actualizó correctamente' : 'El juego se creó y está pendiente de aprobación',
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{game ? 'Editar Juego' : 'Añadir Nuevo Juego'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Juego</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
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
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {game ? 'Actualizar' : 'Crear Juego'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, updateUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Upload, Save } from 'lucide-react';

interface DashboardProfileProps {
  user: User;
}

export const DashboardProfile = ({ user }: DashboardProfileProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: user.businessName || '',
    description: user.description || '',
    phone: user.phone || '',
    address: user.address || '',
    facebook: user.socialMedia?.facebook || '',
    instagram: user.socialMedia?.instagram || '',
    twitter: user.socialMedia?.twitter || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateUser(user.id, {
      businessName: formData.businessName,
      description: formData.description,
      phone: formData.phone,
      address: formData.address,
      socialMedia: {
        facebook: formData.facebook,
        instagram: formData.instagram,
        twitter: formData.twitter,
      }
    });

    toast({
      title: 'Perfil actualizado',
      description: 'Tus cambios se han guardado correctamente',
    });
  };

  return (
    <Card className="shadow-elevated">
      <CardHeader>
        <CardTitle className="text-2xl">Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Logo del Estudio</Label>
              <div className="flex items-center gap-4">
                <img 
                  src={user.logo} 
                  alt="Logo" 
                  className="w-20 h-20 rounded-lg bg-muted"
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir Logo
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto de Portada</Label>
              <Button type="button" variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Subir Portada
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre del Estudio</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Cuéntanos sobre tu estudio de juegos..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+591 70123456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ciudad, Bolivia"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Redes Sociales</h3>
            
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@usuario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                placeholder="@usuario"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

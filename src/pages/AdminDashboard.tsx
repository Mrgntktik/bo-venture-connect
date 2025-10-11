import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { isAdmin } from '@/lib/supabase-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Gamepad, Clock, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

interface Profile {
  id: string;
  name: string;
  email?: string;
  business_name?: string;
}

interface Game {
  id: string;
  title: string;
  category: string;
  price?: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: Profile;
}

export default function AdminDashboard() {
  const [isAdminUser, setIsAdminUser] = useState<boolean | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'games' | 'users'>('dashboard');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAdminUser(false);
        setLoading(false);
        return;
      }

      const adminStatus = await isAdmin(session.user.id);
      setIsAdminUser(adminStatus);
      
      if (adminStatus) {
        await loadData();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdminUser(false);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Load users with creator role
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name, business_name');
      
      if (profilesData) {
        setUsers(profilesData);
      }

      // Load all games with profile information
      const { data: gamesData } = await supabase
        .from('games')
        .select(`
          id,
          title,
          category,
          price,
          status,
          created_at,
          user_id,
          profiles!games_user_id_fkey (
            id,
            name,
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (gamesData) {
        setGames(gamesData as any);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verificando permisos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isAdminUser === false) {
    return <Navigate to="/login" />;
  }

  const handleApprove = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'approved' })
        .eq('id', gameId);

      if (error) throw error;

      await loadData();
      
      toast({
        title: 'Juego aprobado',
        description: 'El juego ha sido aprobado y ahora es visible',
      });
    } catch (error) {
      console.error('Error approving game:', error);
      toast({
        title: 'Error',
        description: 'No se pudo aprobar el juego',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (gameId: string) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ status: 'rejected' })
        .eq('id', gameId);

      if (error) throw error;

      await loadData();
      
      toast({
        title: 'Juego rechazado',
        description: 'El juego ha sido rechazado',
        variant: 'destructive',
      });
    } catch (error) {
      console.error('Error rejecting game:', error);
      toast({
        title: 'Error',
        description: 'No se pudo rechazar el juego',
        variant: 'destructive',
      });
    }
  };

  const pendingGames = games.filter(g => g.status === 'pending');
  const totalGames = games.filter(g => g.status === 'approved').length;
  const newRegistrations = users.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

        <div className="flex gap-4 mb-8 border-b border-border">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'games' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('games')}
          >
            Mis Juegos
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </Button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{newRegistrations}</div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Juegos Activos</CardTitle>
                  <Gamepad className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalGames}</div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingGames.length}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-elevated">
              <CardHeader>
                <CardTitle className="text-2xl">Juegos por Aprobar</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre del Juego</TableHead>
                      <TableHead>Estudio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingGames.map((game) => {
                      const studio = game.profiles as Profile;
                      return (
                        <TableRow key={game.id}>
                          <TableCell className="font-medium">{game.title}</TableCell>
                          <TableCell>{studio?.business_name || studio?.name}</TableCell>
                          <TableCell>{new Date(game.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Pendiente</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(game.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(game.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                {pendingGames.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay juegos pendientes de aprobación
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'games' && (
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl">Todos los Juegos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estudio</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {games.map((game) => {
                    const studio = game.profiles as Profile;
                    return (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.title}</TableCell>
                        <TableCell>{studio?.business_name || studio?.name}</TableCell>
                        <TableCell>{game.category}</TableCell>
                        <TableCell>Bs. {game.price || 0}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              game.status === 'approved' ? 'default' :
                              game.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {game.status === 'approved' ? 'Aprobado' :
                             game.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl">Usuarios Registrados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Estudio</TableHead>
                    <TableHead className="text-right">Juegos Subidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const userGames = games.filter(g => g.user_id === user.id);
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email || 'N/A'}</TableCell>
                        <TableCell>{user.business_name || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{userGames.length}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

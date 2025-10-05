import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import { getUsers, getGames, saveGames, User, Game } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Gamepad, Clock, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

export default function AdminDashboard() {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'games' | 'users'>('dashboard');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(getUsers().filter(u => u.role === 'creator'));
    setGames(getGames());
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleApprove = (gameId: string) => {
    const allGames = getGames();
    const index = allGames.findIndex(g => g.id === gameId);
    
    if (index !== -1) {
      allGames[index].status = 'approved';
      saveGames(allGames);
      loadData();
      
      toast({
        title: 'Juego aprobado',
        description: 'El juego ha sido aprobado y ahora es visible',
      });
    }
  };

  const handleReject = (gameId: string) => {
    const allGames = getGames();
    const index = allGames.findIndex(g => g.id === gameId);
    
    if (index !== -1) {
      allGames[index].status = 'rejected';
      saveGames(allGames);
      loadData();
      
      toast({
        title: 'Juego rechazado',
        description: 'El juego ha sido rechazado',
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
                      const studio = users.find(u => u.id === game.userId);
                      return (
                        <TableRow key={game.id}>
                          <TableCell className="font-medium">{game.name}</TableCell>
                          <TableCell>{studio?.businessName}</TableCell>
                          <TableCell>{new Date(game.createdAt).toLocaleDateString()}</TableCell>
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
                    const studio = users.find(u => u.id === game.userId);
                    return (
                      <TableRow key={game.id}>
                        <TableCell className="font-medium">{game.name}</TableCell>
                        <TableCell>{studio?.businessName}</TableCell>
                        <TableCell>{game.category}</TableCell>
                        <TableCell>Bs. {game.price}</TableCell>
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
                    const userGames = games.filter(g => g.userId === user.id);
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.businessName}</TableCell>
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

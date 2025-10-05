import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Gamepad2, LogOut, User } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/auth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card border-b border-border shadow-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">blvgames.bo</span>
          </Link>

          <nav className="flex items-center gap-4">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' ? (
                  <Button variant="ghost" asChild>
                    <Link to="/admin">Dashboard Admin</Link>
                  </Button>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link to="/dashboard">Mi Panel</Link>
                  </Button>
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar Sesión</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2025 blvgames.bo - Plataforma de juegos bolivianos</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { User, Package, Bot } from 'lucide-react';
import { DashboardProfile } from '@/components/dashboard/DashboardProfile';
import { DashboardProducts } from '@/components/dashboard/DashboardProducts';

export default function Dashboard() {
  const currentUser = getCurrentUser();
  const [activeSection, setActiveSection] = useState<'profile' | 'products' | 'ai'>('profile');

  if (!currentUser || currentUser.role !== 'creator') {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Panel de Control</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('profile')}
                      isActive={activeSection === 'profile'}
                    >
                      <User className="h-4 w-4" />
                      <span>Mi Perfil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('products')}
                      isActive={activeSection === 'products'}
                    >
                      <Package className="h-4 w-4" />
                      <span>Mis Juegos</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveSection('ai')}
                      isActive={activeSection === 'ai'}
                    >
                      <Bot className="h-4 w-4" />
                      <span>Asistente IA</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            {activeSection === 'profile' && <DashboardProfile user={currentUser} />}
            {activeSection === 'products' && <DashboardProducts userId={currentUser.id} />}
            {activeSection === 'ai' && (
              <div className="bg-card p-8 rounded-xl shadow-card">
                <h2 className="text-2xl font-bold mb-4">Asistente IA</h2>
                <p className="text-muted-foreground">
                  Próximamente: Chat con IA para ayudarte a optimizar tus juegos y perfiles
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

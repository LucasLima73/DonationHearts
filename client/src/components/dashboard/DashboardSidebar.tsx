import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Heart,
  Trophy,
  Settings,
  PlusCircle,
  LogOut
} from 'lucide-react';

interface DashboardSidebarProps {
  sidebarOpen: boolean;
  className?: string;
}

export function DashboardSidebar({ sidebarOpen, className }: DashboardSidebarProps) {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();

  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutGrid, 
      href: '/dashboard',
      active: location === '/dashboard'
    },
    { 
      title: 'Minhas Campanhas', 
      icon: Heart, 
      href: '/campaigns/my',
      active: location === '/campaigns/my'
    },
    { 
      title: 'Perfil & Conquistas', 
      icon: Trophy, 
      href: '/profile',
      active: location === '/profile'
    },
    { 
      title: 'Configurações', 
      icon: Settings, 
      href: '/dashboard/configuracoes',
      active: location === '/dashboard/configuracoes'
    },
  ];
  
  const sidebarVariants = {
    open: { 
      x: 0,
      opacity: 1,
      display: 'block'
    },
    closed: { 
      x: '-100%',
      opacity: 0,
      transitionEnd: { display: 'none' }
    }
  };

  return (
    <>
      {/* Overlay para mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => document.dispatchEvent(new Event('close-sidebar'))}
      />
      
      {/* Sidebar para mobile */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-30 h-screen w-64 lg:hidden bg-background border-r border-white/10",
          className
        )}
        initial="closed"
        animate={sidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full pt-16">
          <div className="flex items-center justify-between py-4 px-5 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-lg font-semibold">
                    {user?.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-400 truncate max-w-[120px]">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 py-6">
            <nav className="px-3 space-y-1.5">
              {menuItems.map(item => (
                <Button
                  key={item.title}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm font-medium text-left h-auto py-2.5",
                    item.active 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => setLocation(item.href)}
                >
                  <div className="flex items-center w-full">
                    <item.icon className={cn("h-5 w-5 mr-3", item.active ? "text-primary" : "text-gray-400")} />
                    <span>{item.title}</span>
                  </div>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-3 border-t border-white/10">
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start bg-primary hover:bg-primary/90 btn-glow"
              onClick={() => setLocation('/campaigns/new')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </motion.aside>
      
      {/* Sidebar para desktop */}
      <aside className={cn(
        "hidden lg:block fixed inset-y-0 left-0 z-10 w-64 border-r border-white/10 bg-background transition-all duration-300 pt-16", 
        className
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4 px-5 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-lg font-semibold">
                    {user?.name ? user.name.substring(0, 1).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white truncate max-w-[150px]">{user?.name || 'Usuário'}</p>
                <p className="text-xs text-gray-400 truncate max-w-[150px]">{user?.email}</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 py-6">
            <nav className="px-3 space-y-1.5">
              {menuItems.map(item => (
                <Button
                  key={item.title}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm font-medium text-left h-auto py-2.5",
                    item.active 
                      ? "bg-primary/10 text-primary hover:bg-primary/20" 
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                  onClick={() => setLocation(item.href)}
                >
                  <div className="flex items-center w-full">
                    <item.icon className={cn("h-5 w-5 mr-3", item.active ? "text-primary" : "text-gray-400")} />
                    <span>{item.title}</span>
                  </div>
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="mt-auto p-3 border-t border-white/10">
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start bg-primary hover:bg-primary/90 btn-glow"
              onClick={() => setLocation('/campaigns/new')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Campanha
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start mt-3 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Store, BarChart3, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/super-admin' },
  { label: 'Shops', icon: Store, path: '/super-admin/shops' },
  { label: 'Reports', icon: BarChart3, path: '/super-admin/reports' },
  { label: 'Settings', icon: Settings, path: '/super-admin/settings' },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sidebar-gradient w-60 flex flex-col text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <h2 className="font-display text-lg font-bold text-sidebar-primary">☕ CaféBill</h2>
          <p className="text-xs text-sidebar-foreground/60 mt-1">Super Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground">
              {currentUser?.name?.[0] || 'A'}
            </div>
            <div className="text-xs">
              <p className="font-medium">{currentUser?.name || 'Admin'}</p>
              <p className="text-sidebar-foreground/50">{currentUser?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={() => { logout(); navigate('/'); }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

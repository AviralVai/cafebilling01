import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Package, Users, ShoppingCart, BarChart3, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getNavItems = (shopId: string) => [
  { label: 'Dashboard', icon: LayoutDashboard, path: `/shop/${shopId}` },
  { label: 'POS / Billing', icon: ShoppingCart, path: `/shop/${shopId}/pos` },
  { label: 'Items', icon: Package, path: `/shop/${shopId}/items` },
  { label: 'Transactions', icon: BarChart3, path: `/shop/${shopId}/transactions` },
  { label: 'Users', icon: Users, path: `/shop/${shopId}/users` },
  { label: 'Reports', icon: BarChart3, path: `/shop/${shopId}/reports` },
  { label: 'Settings', icon: Settings, path: `/shop/${shopId}/settings` },
];

export default function ShopAdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, currentShop, logout } = useAuth();
  const shopId = currentShop?.id || 'shop-1';
  const navItems = getNavItems(shopId);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sidebar-gradient w-60 flex flex-col text-sidebar-foreground">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl gradient-warm flex items-center justify-center text-lg">
              ☕
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-sidebar-primary">
                {currentShop?.name || 'Shop'}
              </h2>
              <p className="text-[10px] text-sidebar-foreground/50 mt-0.5">
                {currentUser?.role === 'admin' ? 'Admin Panel' : 'Cashier'}
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                    : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground">
              {currentUser?.name?.[0] || 'U'}
            </div>
            <div className="text-xs">
              <p className="font-medium">{currentUser?.name}</p>
              <p className="text-sidebar-foreground/50 capitalize">{currentUser?.role}</p>
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

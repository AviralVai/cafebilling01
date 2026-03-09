import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { shops, transactions, users, items, formatCurrency, getShop } from '@/data/mockData';
import SuperAdminLayout from '@/components/Layout/SuperAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, DollarSign, Users, Package, ChevronRight } from 'lucide-react';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const adminUser = users.find(u => u.role === 'admin')!;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalOrders = transactions.length;

  const shopStats = shops.map(shop => {
    const shopTxns = transactions.filter(t => t.shopId === shop.id);
    const revenue = shopTxns.reduce((sum, t) => sum + t.total, 0);
    const shopItems = items.filter(i => i.shopId === shop.id);
    const shopUsers = users.filter(u => u.shopId === shop.id);
    return { shop, revenue, orders: shopTxns.length, items: shopItems.length, users: shopUsers.length };
  });

  return (
    <SuperAdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of all shops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-accent' },
          { label: 'Total Orders', value: totalOrders.toString(), icon: Package, color: 'text-info' },
          { label: 'Active Shops', value: shops.length.toString(), icon: Store, color: 'text-success' },
          { label: 'Total Staff', value: users.filter(u => u.role !== 'super_admin').length.toString(), icon: Users, color: 'text-primary' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold font-display">{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Shops</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {shopStats.map(({ shop, revenue, orders, items: itemCount, users: userCount }) => (
          <Card
            key={shop.id}
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
            onClick={() => {
              const shopAdmin = users.find(u => u.shopId === shop.id && u.role === 'admin');
              if (shopAdmin) login(shopAdmin, shop);
              navigate(`/shop/${shop.id}`);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl gradient-warm flex items-center justify-center text-lg">☕</div>
                  <CardTitle className="text-base font-display">{shop.name}</CardTitle>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{shop.address}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-semibold">{formatCurrency(revenue)}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Orders</p>
                  <p className="font-semibold">{orders}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Items</p>
                  <p className="font-semibold">{itemCount}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2">
                  <p className="text-muted-foreground">Staff</p>
                  <p className="font-semibold">{userCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SuperAdminLayout>
  );
}

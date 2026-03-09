import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShop, getShopItems, getShopUsers, getShopTransactions, formatCurrency } from '@/data/mockData';
import { DollarSign, Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ShopDashboard() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const shop = currentShop || getShop(shopId || 'shop-1');
  const sid = shop?.id || 'shop-1';

  const txns = getShopTransactions(sid);
  const shopItems = getShopItems(sid);
  const shopUsers = getShopUsers(sid);
  const totalRevenue = txns.reduce((s, t) => s + t.total, 0);
  const todayRevenue = txns.filter(t => t.date.startsWith('2026-02-11')).reduce((s, t) => s + t.total, 0);

  const chartData = [
    { day: 'Feb 9', revenue: txns.filter(t => t.date.startsWith('2026-02-09')).reduce((s, t) => s + t.total, 0) },
    { day: 'Feb 10', revenue: txns.filter(t => t.date.startsWith('2026-02-10')).reduce((s, t) => s + t.total, 0) },
    { day: 'Feb 11', revenue: txns.filter(t => t.date.startsWith('2026-02-11')).reduce((s, t) => s + t.total, 0) },
  ];

  return (
    <ShopAdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">{shop?.name} Dashboard</h1>
        <p className="text-muted-foreground text-sm">{shop?.settings.billHeader}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Today's Sales", value: formatCurrency(todayRevenue), icon: TrendingUp, color: 'text-success' },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-accent' },
          { label: 'Menu Items', value: shopItems.length.toString(), icon: Package, color: 'text-info' },
          { label: 'Orders', value: txns.length.toString(), icon: ShoppingCart, color: 'text-primary' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {txns.slice(0, 4).map(txn => (
              <div key={txn.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <div>
                  <p className="font-medium">{txn.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(txn.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(txn.total)}</p>
                  <p className="text-xs text-muted-foreground capitalize">{txn.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 stat-card">
        <h3 className="font-display font-semibold mb-4">Staff</h3>
        <div className="flex gap-4 flex-wrap">
          {shopUsers.map(u => (
            <div key={u.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
              <div className="h-8 w-8 rounded-full gradient-warm flex items-center justify-center text-xs font-bold text-primary-foreground">
                {u.name[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{u.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ShopAdminLayout>
  );
}

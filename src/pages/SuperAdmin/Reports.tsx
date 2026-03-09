import SuperAdminLayout from '@/components/Layout/SuperAdminLayout';
import { shops, transactions, formatCurrency } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--info))'];

export default function SuperAdminReports() {
  const shopRevenue = shops.map(shop => {
    const rev = transactions.filter(t => t.shopId === shop.id).reduce((s, t) => s + t.total, 0);
    return { name: shop.name, revenue: Math.round(rev) };
  });

  const totalRevenue = shopRevenue.reduce((s, r) => s + r.revenue, 0);

  const paymentBreakdown = ['cash', 'card', 'upi'].map(method => ({
    name: method.toUpperCase(),
    value: transactions.filter(t => t.paymentMethod === method).reduce((s, t) => s + t.total, 0),
  }));

  return (
    <SuperAdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Global Reports</h1>
        <p className="text-muted-foreground text-sm">Cross-shop analytics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold font-display">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold font-display">{transactions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground">Active Shops</p>
          <p className="text-2xl font-bold font-display">{shops.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-display">Revenue by Shop</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={shopRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-display">Payment Methods</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={paymentBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {paymentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayout>
  );
}

import { useParams } from 'react-router-dom';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShopTransactions, getShopItems, getShop, formatCurrency } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['hsl(25, 65%, 28%)', 'hsl(35, 80%, 52%)', 'hsl(145, 63%, 42%)', 'hsl(210, 80%, 52%)', 'hsl(0, 72%, 51%)'];

export default function Reports() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const { toast } = useToast();
  const shop = currentShop || getShop(shopId || 'shop-1')!;
  const txns = getShopTransactions(shop.id);
  const shopItems = getShopItems(shop.id);

  const dailyData = [
    { day: 'Feb 9', revenue: txns.filter(t => t.date.startsWith('2026-02-09')).reduce((s, t) => s + t.total, 0), orders: txns.filter(t => t.date.startsWith('2026-02-09')).length },
    { day: 'Feb 10', revenue: txns.filter(t => t.date.startsWith('2026-02-10')).reduce((s, t) => s + t.total, 0), orders: txns.filter(t => t.date.startsWith('2026-02-10')).length },
    { day: 'Feb 11', revenue: txns.filter(t => t.date.startsWith('2026-02-11')).reduce((s, t) => s + t.total, 0), orders: txns.filter(t => t.date.startsWith('2026-02-11')).length },
  ];

  // Items sold count
  const itemSales: Record<string, number> = {};
  txns.forEach(t => t.items.forEach(i => { itemSales[i.name] = (itemSales[i.name] || 0) + i.quantity; }));
  const pieData = Object.entries(itemSales).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const handleExport = () => {
    const header = 'Day,Revenue,Orders\n';
    const rows = dailyData.map(d => `${d.day},${d.revenue},${d.orders}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `report-${shop.name}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Report CSV downloaded.' });
  };

  return (
    <ShopAdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm">{shop.name} — Sales Analytics</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}><FileDown className="h-4 w-4 mr-1" /> Export CSV</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">Daily Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="font-display font-semibold mb-4">Top Items Sold</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 stat-card overflow-x-auto">
        <h3 className="font-display font-semibold mb-4">Daily Summary</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="pb-3 font-medium">Day</th>
              <th className="pb-3 font-medium text-right">Revenue</th>
              <th className="pb-3 font-medium text-right">Orders</th>
              <th className="pb-3 font-medium text-right">Avg Order</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map(d => (
              <tr key={d.day} className="border-b border-border/50 last:border-0">
                <td className="py-3 font-medium">{d.day}</td>
                <td className="py-3 text-right">{formatCurrency(d.revenue)}</td>
                <td className="py-3 text-right">{d.orders}</td>
                <td className="py-3 text-right">{d.orders > 0 ? formatCurrency(d.revenue / d.orders) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShopAdminLayout>
  );
}

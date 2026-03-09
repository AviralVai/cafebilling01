import { useParams } from 'react-router-dom';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShopTransactions, getShop, formatCurrency } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function Transactions() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const shop = currentShop || getShop(shopId || 'shop-1')!;
  const txns = getShopTransactions(shop.id);

  return (
    <ShopAdminLayout>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground text-sm">{shop.name} — {txns.length} orders</p>
      </div>
      <div className="stat-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-left">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium text-right">Subtotal</th>
              <th className="pb-3 font-medium text-right">Tax</th>
              <th className="pb-3 font-medium text-right">Total</th>
              <th className="pb-3 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {txns.map(txn => (
              <tr key={txn.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 font-medium">{txn.id}</td>
                <td className="py-3 text-muted-foreground">{new Date(txn.date).toLocaleString()}</td>
                <td className="py-3">
                  {txn.items.map(i => (
                    <span key={i.productId} className="text-xs">{i.name} ×{i.quantity}{' '}</span>
                  ))}
                </td>
                <td className="py-3 text-right">{formatCurrency(txn.subTotal)}</td>
                <td className="py-3 text-right">{formatCurrency(txn.tax)}</td>
                <td className="py-3 text-right font-semibold">{formatCurrency(txn.total)}</td>
                <td className="py-3">
                  <Badge variant="secondary" className="capitalize text-[10px]">{txn.paymentMethod}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShopAdminLayout>
  );
}

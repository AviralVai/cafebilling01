import { useParams } from 'react-router-dom';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShopUsers, getShop } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function ShopUsers() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const shop = currentShop || getShop(shopId || 'shop-1')!;
  const shopUsers = getShopUsers(shop.id);

  return (
    <ShopAdminLayout>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Users & Staff</h1>
        <p className="text-muted-foreground text-sm">{shop.name} — {shopUsers.length} members</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopUsers.map(u => (
          <div key={u.id} className="stat-card flex items-center gap-4">
            <div className="h-12 w-12 rounded-full gradient-warm flex items-center justify-center text-lg font-bold text-primary-foreground">
              {u.name[0]}
            </div>
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-muted-foreground">{u.email}</p>
              <p className="text-xs text-muted-foreground">{u.phone}</p>
              <Badge variant="secondary" className="capitalize text-[10px] mt-1">{u.role}</Badge>
            </div>
          </div>
        ))}
      </div>
    </ShopAdminLayout>
  );
}

import { useParams } from 'react-router-dom';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShop } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function ShopSettings() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const { toast } = useToast();
  const shop = currentShop || getShop(shopId || 'shop-1')!;
  const [settings, setSettings] = useState(shop.settings);

  const handleSave = () => toast({ title: 'Settings Saved', description: 'Shop settings updated (demo).' });

  return (
    <ShopAdminLayout>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">{shop.name} — Configuration</p>
      </div>
      <div className="max-w-2xl space-y-6">
        <div className="stat-card space-y-4">
          <h3 className="font-display font-semibold">Billing Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Currency</Label>
              <Input value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} />
            </div>
            <div>
              <Label>Currency Symbol</Label>
              <Input value={settings.currencySymbol} onChange={e => setSettings({...settings, currencySymbol: e.target.value})} />
            </div>
            <div>
              <Label>Tax Rate (%)</Label>
              <Input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: Number(e.target.value)})} />
            </div>
            <div>
              <Label>Invoice Prefix</Label>
              <Input value={settings.invoicePrefix} onChange={e => setSettings({...settings, invoicePrefix: e.target.value})} />
            </div>
          </div>
        </div>
        <div className="stat-card space-y-4">
          <h3 className="font-display font-semibold">Bill Template</h3>
          <div>
            <Label>Header Text</Label>
            <Input value={settings.billHeader} onChange={e => setSettings({...settings, billHeader: e.target.value})} />
          </div>
          <div>
            <Label>Footer Text</Label>
            <Input value={settings.billFooter} onChange={e => setSettings({...settings, billFooter: e.target.value})} />
          </div>
        </div>
        <Button onClick={handleSave} className="gradient-warm text-primary-foreground">Save Settings</Button>
      </div>
    </ShopAdminLayout>
  );
}

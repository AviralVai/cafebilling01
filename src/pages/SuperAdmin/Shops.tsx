import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { shops as initialShops, users, items, transactions, formatCurrency, Shop } from '@/data/mockData';
import SuperAdminLayout from '@/components/Layout/SuperAdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ChevronRight, Plus, Store, Pencil, Trash2, ImagePlus, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const emptyForm = { name: '', address: '', contact: '', currency: 'INR', currencySymbol: '₹', taxRate: 5, invoicePrefix: '', billHeader: '', billFooter: '', logoUrl: '', photoUrl: '' };

export default function SuperAdminShops() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [shopsList, setShopsList] = useState<Shop[]>(initialShops);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null);
  const [form, setForm] = useState(emptyForm);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (field: 'logoUrl' | 'photoUrl', file: File) => {
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, [field]: url }));
  };

  const openAdd = () => {
    setEditingShop(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (shop: Shop, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingShop(shop);
    setForm({
      name: shop.name, address: shop.address, contact: shop.contact,
      currency: shop.settings.currency, currencySymbol: shop.settings.currencySymbol,
      taxRate: shop.settings.taxRate, invoicePrefix: shop.settings.invoicePrefix,
      billHeader: shop.settings.billHeader, billFooter: shop.settings.billFooter,
      logoUrl: shop.logoUrl, photoUrl: shop.photoUrl,
    });
    setDialogOpen(true);
  };

  const openDelete = (shop: Shop, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingShop(shop);
    setDeleteDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.address || !form.contact) {
      toast.error('Please fill in name, address, and contact');
      return;
    }
    if (editingShop) {
      setShopsList(prev => prev.map(s => s.id === editingShop.id ? {
        ...s, name: form.name, address: form.address, contact: form.contact,
        logoUrl: form.logoUrl, photoUrl: form.photoUrl,
        settings: { ...s.settings, currency: form.currency, currencySymbol: form.currencySymbol, taxRate: form.taxRate, invoicePrefix: form.invoicePrefix, billHeader: form.billHeader, billFooter: form.billFooter }
      } : s));
      toast.success('Shop updated!');
    } else {
      const newShop: Shop = {
        id: `shop-${Date.now()}`, name: form.name, logoUrl: form.logoUrl, photoUrl: form.photoUrl,
        address: form.address, contact: form.contact,
        settings: { currency: form.currency, currencySymbol: form.currencySymbol, taxRate: form.taxRate, invoicePrefix: form.invoicePrefix, billHeader: form.billHeader || `${form.name} – Welcome!`, billFooter: form.billFooter || 'Thank you! Visit again.' }
      };
      setShopsList(prev => [...prev, newShop]);
      toast.success('Shop onboarded successfully!');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingShop) {
      setShopsList(prev => prev.filter(s => s.id !== deletingShop.id));
      toast.success(`${deletingShop.name} removed`);
    }
    setDeleteDialogOpen(false);
  };

  const shopStats = shopsList.map(shop => {
    const shopTxns = transactions.filter(t => t.shopId === shop.id);
    const revenue = shopTxns.reduce((sum, t) => sum + t.total, 0);
    const shopItems = items.filter(i => i.shopId === shop.id);
    const shopUsers = users.filter(u => u.shopId === shop.id);
    return { shop, revenue, orders: shopTxns.length, items: shopItems.length, users: shopUsers.length };
  });

  return (
    <SuperAdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">All Shops</h1>
          <p className="text-muted-foreground text-sm">Manage and onboard outlets</p>
        </div>
        <Button onClick={openAdd} className="rounded-xl gap-2" style={{ background: 'var(--gradient-warm)' }}>
          <Plus className="h-4 w-4" /> Onboard New Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopStats.map(({ shop, revenue, orders, items: itemCount, users: userCount }) => (
          <Card key={shop.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 group"
            onClick={() => {
              const shopAdmin = users.find(u => u.shopId === shop.id && u.role === 'admin');
              if (shopAdmin) login(shopAdmin, shop);
              navigate(`/shop/${shop.id}`);
            }}
          >
            {shop.photoUrl && (
              <div className="h-28 w-full overflow-hidden rounded-t-lg">
                <img src={shop.photoUrl} alt={shop.name} className="h-full w-full object-cover" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {shop.logoUrl ? (
                    <img src={shop.logoUrl} alt="logo" className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl gradient-warm flex items-center justify-center text-lg">☕</div>
                  )}
                  <CardTitle className="text-base font-display">{shop.name}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => openEdit(shop, e)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={(e) => openDelete(shop, e)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{shop.address}</p>
              <p className="text-xs text-muted-foreground mb-1">Contact: {shop.contact}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                <div className="bg-secondary/50 rounded-lg p-2"><p className="text-muted-foreground">Revenue</p><p className="font-semibold">{formatCurrency(revenue)}</p></div>
                <div className="bg-secondary/50 rounded-lg p-2"><p className="text-muted-foreground">Orders</p><p className="font-semibold">{orders}</p></div>
                <div className="bg-secondary/50 rounded-lg p-2"><p className="text-muted-foreground">Items</p><p className="font-semibold">{itemCount}</p></div>
                <div className="bg-secondary/50 rounded-lg p-2"><p className="text-muted-foreground">Staff</p><p className="font-semibold">{userCount}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Shop Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {editingShop ? 'Edit Shop' : 'Onboard New Shop'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Logo & Photo uploads */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Shop Logo</Label>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload('logoUrl', e.target.files[0]); }} />
                {form.logoUrl ? (
                  <div className="relative group/img">
                    <img src={form.logoUrl} alt="Logo" className="h-24 w-24 rounded-xl object-cover border border-border" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, logoUrl: '' }))} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="h-24 w-24 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px]">Upload</span>
                  </button>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Shop Photo</Label>
                <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload('photoUrl', e.target.files[0]); }} />
                {form.photoUrl ? (
                  <div className="relative group/img">
                    <img src={form.photoUrl} alt="Photo" className="h-24 w-full rounded-xl object-cover border border-border" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, photoUrl: '' }))} className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => photoInputRef.current?.click()} className="h-24 w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors">
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px]">Upload</span>
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Shop Name *</Label>
                <Input placeholder="e.g. The Brew House" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Address *</Label>
                <Input placeholder="Full address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Contact *</Label>
                <Input placeholder="+91 99999 00000" value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Invoice Prefix</Label>
                <Input placeholder="e.g. BH" value={form.invoicePrefix} onChange={e => setForm(f => ({ ...f, invoicePrefix: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency Symbol</Label>
                <Input placeholder="₹" value={form.currencySymbol} onChange={e => setForm(f => ({ ...f, currencySymbol: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tax Rate (%)</Label>
                <Input type="number" placeholder="5" value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: Number(e.target.value) }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Bill Header</Label>
                <Input placeholder="Welcome message on receipts" value={form.billHeader} onChange={e => setForm(f => ({ ...f, billHeader: e.target.value }))} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Bill Footer</Label>
                <Input placeholder="Thank you message" value={form.billFooter} onChange={e => setForm(f => ({ ...f, billFooter: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingShop ? 'Save Changes' : 'Onboard Shop'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Remove Shop</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove <span className="font-semibold text-foreground">{deletingShop?.name}</span>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove Shop</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}

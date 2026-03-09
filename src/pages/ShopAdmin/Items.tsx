import { useParams } from 'react-router-dom';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShopItems, getItemCategories, getShop, formatCurrency, Item } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const EMOJIS = ['☕', '🥛', '🧊', '🥐', '🧁', '🍰', '🥪', '🍵', '🥯', '🍫', '🥞', '🥗', '🥤', '🥑', '🫖', '🍌', '🥣'];

export default function ShopItems() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const shop = currentShop || getShop(shopId || 'shop-1')!;

  const [itemsList, setItemsList] = useState<Item[]>(() => getShopItems(shop.id));
  const categories = ['All', ...new Set(itemsList.map(i => i.category))];
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formEmoji, setFormEmoji] = useState('☕');

  const filtered = itemsList.filter(i =>
    (filter === 'All' || i.category === filter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingItem(null);
    setFormName(''); setFormCategory(''); setFormPrice(''); setFormStock(''); setFormEmoji('☕');
    setDialogOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditingItem(item);
    setFormName(item.name); setFormCategory(item.category); setFormPrice(item.price.toString()); setFormStock(item.stockQty.toString()); setFormEmoji(item.emoji);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formCategory.trim() || !formPrice || !formStock) {
      toast.error('Please fill all fields');
      return;
    }
    if (editingItem) {
      setItemsList(prev => prev.map(i => i.id === editingItem.id ? {
        ...i, name: formName.trim(), category: formCategory.trim(), price: parseFloat(formPrice), stockQty: parseInt(formStock), emoji: formEmoji
      } : i));
      toast.success(`"${formName}" updated`);
    } else {
      const newItem: Item = {
        id: `i-new-${Date.now()}`, shopId: shop.id, name: formName.trim(), category: formCategory.trim(),
        price: parseFloat(formPrice), stockQty: parseInt(formStock), imageUrl: '', emoji: formEmoji,
      };
      setItemsList(prev => [...prev, newItem]);
      toast.success(`"${formName}" added`);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const item = itemsList.find(i => i.id === id);
    setItemsList(prev => prev.filter(i => i.id !== id));
    setDeleteConfirmId(null);
    toast.success(`"${item?.name}" deleted`);
  };

  return (
    <ShopAdminLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Items Catalog</h1>
          <p className="text-muted-foreground text-sm">{shop.name} — {itemsList.length} items</p>
        </div>
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1" /> Add Item</Button>
      </div>
      <div className="flex gap-3 items-center mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <Badge key={c} variant={filter === c ? 'default' : 'secondary'} className="cursor-pointer" onClick={() => setFilter(c)}>{c}</Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="stat-card flex flex-col items-center text-center relative group">
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}><Pencil className="h-3 w-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirmId(item.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
            <span className="text-4xl mb-3">{item.emoji}</span>
            <h3 className="font-medium text-sm">{item.name}</h3>
            <Badge variant="secondary" className="text-[10px] mt-1">{item.category}</Badge>
            <p className="text-lg font-bold text-primary mt-2">{formatCurrency(item.price, shop.settings.currencySymbol)}</p>
            <p className="text-xs text-muted-foreground">Stock: {item.stockQty}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label className="text-xs">Name</Label><Input value={formName} onChange={e => setFormName(e.target.value)} className="mt-1" /></div>
            <div><Label className="text-xs">Category</Label><Input value={formCategory} onChange={e => setFormCategory(e.target.value)} placeholder="e.g. Beverages" className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Price ({shop.settings.currencySymbol})</Label><Input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="mt-1" /></div>
              <div><Label className="text-xs">Stock Qty</Label><Input type="number" value={formStock} onChange={e => setFormStock(e.target.value)} className="mt-1" /></div>
            </div>
            <div>
              <Label className="text-xs">Emoji Icon</Label>
              <div className="flex gap-2 flex-wrap mt-1">
                {EMOJIS.map(e => (
                  <button key={e} type="button" onClick={() => setFormEmoji(e)}
                    className={`text-2xl p-1 rounded-lg transition-all ${formEmoji === e ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-secondary'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingItem ? 'Update' : 'Add Item'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Delete Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "{itemsList.find(i => i.id === deleteConfirmId)?.name}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ShopAdminLayout>
  );
}

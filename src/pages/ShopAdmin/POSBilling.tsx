import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ShopAdminLayout from '@/components/Layout/ShopAdminLayout';
import { getShopItems, getItemCategories, getShop, formatCurrency, CartItem } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Minus, Plus, Trash2, Printer, FileDown, Mail, MessageSquare, Search } from 'lucide-react';

export default function POSBilling() {
  const { shopId } = useParams<{ shopId: string }>();
  const { currentShop } = useAuth();
  const { toast } = useToast();
  const shop = currentShop || getShop(shopId || 'shop-1')!;
  const sid = shop.id;
  const shopItems = getShopItems(sid);
  const categories = ['All', ...getItemCategories(sid)];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);

  const filteredItems = shopItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: typeof shopItems[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.productId === item.id);
      if (existing) {
        return prev.map(c => c.productId === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { productId: item.id, name: item.name, unitPrice: item.price, quantity: 1, emoji: item.emoji }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.productId !== productId) return c;
      const newQty = c.quantity + delta;
      return newQty <= 0 ? c : { ...c, quantity: newQty };
    }));
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(c => c.productId !== productId));

  const subTotal = cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0);
  const taxAmount = subTotal * (shop.settings.taxRate / 100);
  const grandTotal = subTotal + taxAmount - discount;

  const handleExportCSV = () => {
    const header = 'Item,Qty,Unit Price,Total\n';
    const rows = cart.map(c => `${c.name},${c.quantity},${c.unitPrice},${c.unitPrice * c.quantity}`).join('\n');
    const footer = `\nSubtotal,,, ${subTotal}\nTax,,, ${taxAmount.toFixed(2)}\nDiscount,,, ${discount}\nGrand Total,,, ${grandTotal.toFixed(2)}`;
    const blob = new Blob([header + rows + footer], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported!', description: 'Invoice CSV downloaded.' });
  };

  const handlePrint = () => { window.print(); };
  const handleEmail = () => toast({ title: 'Email Sent', description: 'Invoice emailed to customer (demo).' });
  const handleSMS = () => toast({ title: 'SMS Sent', description: 'Invoice link sent via SMS (demo).' });
  const handleNewBill = () => { setCart([]); setDiscount(0); };

  return (
    <ShopAdminLayout>
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Point of Sale</h1>
        <p className="text-muted-foreground text-sm">{shop.name} — Billing Terminal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Items Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'secondary'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="pos-item-card text-center"
                onClick={() => addToCart(item)}
              >
                <div className="text-3xl mb-2">{item.emoji}</div>
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
                <p className="text-sm font-bold mt-1 text-primary">{formatCurrency(item.price, shop.settings.currencySymbol)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Panel */}
        <div className="lg:col-span-2">
          <div className="receipt-paper print:shadow-none" id="receipt">
            <div className="text-center mb-4 pb-3 border-b border-dashed border-border">
              <p className="font-display text-lg font-bold">{shop.name}</p>
              <p className="text-xs text-muted-foreground">{shop.settings.billHeader}</p>
              <p className="text-xs text-muted-foreground">{shop.address}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleString()}</p>
            </div>

            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No items added yet.<br />Tap items to add them.</p>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map(item => (
                    <div key={item.productId} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item.unitPrice, shop.settings.currencySymbol)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.productId, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQty(item.productId, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.productId)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-semibold w-16 text-right text-xs">
                        {formatCurrency(item.unitPrice * item.quantity, shop.settings.currencySymbol)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-border pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subTotal, shop.settings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({shop.settings.taxRate}%)</span>
                    <span>{formatCurrency(taxAmount, shop.settings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Discount</span>
                    <Input
                      type="number"
                      value={discount}
                      onChange={e => setDiscount(Number(e.target.value))}
                      className="w-20 h-7 text-right text-xs"
                      min={0}
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-dashed border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(grandTotal, shop.settings.currencySymbol)}</span>
                  </div>
                </div>

                <div className="text-center mt-3 pt-3 border-t border-dashed border-border">
                  <p className="text-xs text-muted-foreground">{shop.settings.billFooter}</p>
                </div>
              </>
            )}

            {cart.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 print:hidden">
                <Button onClick={handlePrint} variant="outline" size="sm"><Printer className="h-3 w-3 mr-1" /> Print</Button>
                <Button onClick={handleExportCSV} variant="outline" size="sm"><FileDown className="h-3 w-3 mr-1" /> Export</Button>
                <Button onClick={handleEmail} variant="outline" size="sm"><Mail className="h-3 w-3 mr-1" /> Email</Button>
                <Button onClick={handleSMS} variant="outline" size="sm"><MessageSquare className="h-3 w-3 mr-1" /> SMS</Button>
                <Button onClick={handleNewBill} className="col-span-2 gradient-warm text-primary-foreground" size="sm">
                  New Bill
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ShopAdminLayout>
  );
}

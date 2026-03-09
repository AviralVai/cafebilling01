// Types
export interface Shop {
  id: string;
  name: string;
  logoUrl: string;
  photoUrl: string;
  address: string;
  contact: string;
  settings: ShopSettings;
}

export interface ShopSettings {
  currency: string;
  currencySymbol: string;
  taxRate: number;
  invoicePrefix: string;
  billHeader: string;
  billFooter: string;
}

export interface Item {
  id: string;
  shopId: string;
  name: string;
  category: string;
  price: number;
  stockQty: number;
  imageUrl: string;
  emoji: string;
}

export interface User {
  id: string;
  shopId: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'cashier';
  avatar: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  shopId: string;
  date: string;
  userId: string;
  items: OrderItem[];
  subTotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface CartItem extends OrderItem {
  emoji: string;
}

export interface GlobalSettings {
  defaultCurrency: string;
  defaultTaxRate: number;
  emailSettings: { smtpHost: string; smtpPort: number; senderEmail: string };
  smsSettings: { gateway: string; apiKey: string };
}

// Mock Data
export const shops: Shop[] = [
  {
    id: "shop-1",
    name: "The Brew House",
    logoUrl: "",
    photoUrl: "",
    address: "42 Coffee Lane, Mumbai, MH 400001",
    contact: "+91 98765 43210",
    settings: {
      currency: "INR", currencySymbol: "₹", taxRate: 5,
      invoicePrefix: "BH", billHeader: "The Brew House – Freshly Brewed Happiness",
      billFooter: "Thank you! Visit again."
    }
  },
  {
    id: "shop-2",
    name: "Sunrise Café",
    logoUrl: "",
    photoUrl: "",
    address: "7 Park Street, Delhi, DL 110001",
    contact: "+91 91234 56789",
    settings: {
      currency: "INR", currencySymbol: "₹", taxRate: 5,
      invoicePrefix: "SC", billHeader: "Sunrise Café – Start Your Day Right",
      billFooter: "We love serving you!"
    }
  },
  {
    id: "shop-3",
    name: "Bean & Leaf",
    logoUrl: "",
    photoUrl: "",
    address: "15 MG Road, Bangalore, KA 560001",
    contact: "+91 80123 45678",
    settings: {
      currency: "INR", currencySymbol: "₹", taxRate: 5,
      invoicePrefix: "BL", billHeader: "Bean & Leaf – Organic Coffee & Tea",
      billFooter: "Made with love ☕"
    }
  }
];

export const items: Item[] = [
  // Shop 1 - The Brew House
  { id: "i1", shopId: "shop-1", name: "Espresso", category: "Beverages", price: 150, stockQty: 200, imageUrl: "", emoji: "☕" },
  { id: "i2", shopId: "shop-1", name: "Cappuccino", category: "Beverages", price: 200, stockQty: 180, imageUrl: "", emoji: "☕" },
  { id: "i3", shopId: "shop-1", name: "Latte", category: "Beverages", price: 220, stockQty: 150, imageUrl: "", emoji: "🥛" },
  { id: "i4", shopId: "shop-1", name: "Cold Brew", category: "Beverages", price: 250, stockQty: 120, imageUrl: "", emoji: "🧊" },
  { id: "i5", shopId: "shop-1", name: "Croissant", category: "Bakery", price: 120, stockQty: 50, imageUrl: "", emoji: "🥐" },
  { id: "i6", shopId: "shop-1", name: "Blueberry Muffin", category: "Bakery", price: 100, stockQty: 40, imageUrl: "", emoji: "🧁" },
  { id: "i7", shopId: "shop-1", name: "Chocolate Cake", category: "Desserts", price: 180, stockQty: 30, imageUrl: "", emoji: "🍰" },
  { id: "i8", shopId: "shop-1", name: "Sandwich", category: "Food", price: 160, stockQty: 60, imageUrl: "", emoji: "🥪" },
  { id: "i9", shopId: "shop-1", name: "Green Tea", category: "Beverages", price: 130, stockQty: 100, imageUrl: "", emoji: "🍵" },
  { id: "i10", shopId: "shop-1", name: "Bagel", category: "Bakery", price: 90, stockQty: 70, imageUrl: "", emoji: "🥯" },
  // Shop 2 - Sunrise Café
  { id: "i11", shopId: "shop-2", name: "Americano", category: "Beverages", price: 160, stockQty: 190, imageUrl: "", emoji: "☕" },
  { id: "i12", shopId: "shop-2", name: "Mocha", category: "Beverages", price: 230, stockQty: 140, imageUrl: "", emoji: "🍫" },
  { id: "i13", shopId: "shop-2", name: "Iced Tea", category: "Beverages", price: 140, stockQty: 160, imageUrl: "", emoji: "🧊" },
  { id: "i14", shopId: "shop-2", name: "Pancakes", category: "Food", price: 200, stockQty: 45, imageUrl: "", emoji: "🥞" },
  { id: "i15", shopId: "shop-2", name: "Caesar Salad", category: "Food", price: 220, stockQty: 35, imageUrl: "", emoji: "🥗" },
  { id: "i16", shopId: "shop-2", name: "Brownie", category: "Desserts", price: 130, stockQty: 55, imageUrl: "", emoji: "🍫" },
  { id: "i17", shopId: "shop-2", name: "Fruit Smoothie", category: "Beverages", price: 190, stockQty: 80, imageUrl: "", emoji: "🥤" },
  { id: "i18", shopId: "shop-2", name: "Club Sandwich", category: "Food", price: 250, stockQty: 40, imageUrl: "", emoji: "🥪" },
  // Shop 3 - Bean & Leaf
  { id: "i19", shopId: "shop-3", name: "Filter Coffee", category: "Beverages", price: 100, stockQty: 250, imageUrl: "", emoji: "☕" },
  { id: "i20", shopId: "shop-3", name: "Matcha Latte", category: "Beverages", price: 260, stockQty: 90, imageUrl: "", emoji: "🍵" },
  { id: "i21", shopId: "shop-3", name: "Avocado Toast", category: "Food", price: 280, stockQty: 30, imageUrl: "", emoji: "🥑" },
  { id: "i22", shopId: "shop-3", name: "Chai Latte", category: "Beverages", price: 170, stockQty: 130, imageUrl: "", emoji: "🫖" },
  { id: "i23", shopId: "shop-3", name: "Banana Bread", category: "Bakery", price: 110, stockQty: 45, imageUrl: "", emoji: "🍌" },
  { id: "i24", shopId: "shop-3", name: "Granola Bowl", category: "Food", price: 240, stockQty: 25, imageUrl: "", emoji: "🥣" },
];

export const users: User[] = [
  { id: "u1", shopId: "", name: "Rajesh Kumar", email: "rajesh@admin.com", phone: "+91 99999 00001", role: "super_admin", avatar: "" },
  { id: "u2", shopId: "shop-1", name: "Priya Sharma", email: "priya@brewhouse.com", phone: "+91 99999 00002", role: "admin", avatar: "" },
  { id: "u3", shopId: "shop-1", name: "Amit Patel", email: "amit@brewhouse.com", phone: "+91 99999 00003", role: "cashier", avatar: "" },
  { id: "u4", shopId: "shop-2", name: "Sneha Reddy", email: "sneha@sunrise.com", phone: "+91 99999 00004", role: "admin", avatar: "" },
  { id: "u5", shopId: "shop-2", name: "Vikram Singh", email: "vikram@sunrise.com", phone: "+91 99999 00005", role: "cashier", avatar: "" },
  { id: "u6", shopId: "shop-3", name: "Deepa Nair", email: "deepa@beanleaf.com", phone: "+91 99999 00006", role: "admin", avatar: "" },
  { id: "u7", shopId: "shop-3", name: "Ravi Menon", email: "ravi@beanleaf.com", phone: "+91 99999 00007", role: "cashier", avatar: "" },
];

export const transactions: Transaction[] = [
  { id: "TXN-BH-001", shopId: "shop-1", date: "2026-02-11T09:15:00", userId: "u3",
    items: [{ productId: "i1", name: "Espresso", unitPrice: 150, quantity: 2 }, { productId: "i5", name: "Croissant", unitPrice: 120, quantity: 1 }],
    subTotal: 420, tax: 21, discount: 0, total: 441, paymentMethod: "upi" },
  { id: "TXN-BH-002", shopId: "shop-1", date: "2026-02-11T10:30:00", userId: "u3",
    items: [{ productId: "i2", name: "Cappuccino", unitPrice: 200, quantity: 1 }, { productId: "i7", name: "Chocolate Cake", unitPrice: 180, quantity: 1 }],
    subTotal: 380, tax: 19, discount: 20, total: 379, paymentMethod: "card" },
  { id: "TXN-BH-003", shopId: "shop-1", date: "2026-02-10T14:00:00", userId: "u3",
    items: [{ productId: "i3", name: "Latte", unitPrice: 220, quantity: 3 }, { productId: "i8", name: "Sandwich", unitPrice: 160, quantity: 2 }],
    subTotal: 980, tax: 49, discount: 50, total: 979, paymentMethod: "cash" },
  { id: "TXN-BH-004", shopId: "shop-1", date: "2026-02-09T11:45:00", userId: "u3",
    items: [{ productId: "i4", name: "Cold Brew", unitPrice: 250, quantity: 2 }],
    subTotal: 500, tax: 25, discount: 0, total: 525, paymentMethod: "upi" },
  { id: "TXN-SC-001", shopId: "shop-2", date: "2026-02-11T08:00:00", userId: "u5",
    items: [{ productId: "i11", name: "Americano", unitPrice: 160, quantity: 2 }, { productId: "i14", name: "Pancakes", unitPrice: 200, quantity: 1 }],
    subTotal: 520, tax: 26, discount: 0, total: 546, paymentMethod: "cash" },
  { id: "TXN-SC-002", shopId: "shop-2", date: "2026-02-10T16:20:00", userId: "u5",
    items: [{ productId: "i17", name: "Fruit Smoothie", unitPrice: 190, quantity: 2 }, { productId: "i16", name: "Brownie", unitPrice: 130, quantity: 3 }],
    subTotal: 770, tax: 38.5, discount: 30, total: 778.5, paymentMethod: "card" },
  { id: "TXN-BL-001", shopId: "shop-3", date: "2026-02-11T07:30:00", userId: "u7",
    items: [{ productId: "i19", name: "Filter Coffee", unitPrice: 100, quantity: 4 }, { productId: "i23", name: "Banana Bread", unitPrice: 110, quantity: 2 }],
    subTotal: 620, tax: 31, discount: 0, total: 651, paymentMethod: "upi" },
  { id: "TXN-BL-002", shopId: "shop-3", date: "2026-02-10T12:10:00", userId: "u7",
    items: [{ productId: "i20", name: "Matcha Latte", unitPrice: 260, quantity: 1 }, { productId: "i21", name: "Avocado Toast", unitPrice: 280, quantity: 1 }],
    subTotal: 540, tax: 27, discount: 0, total: 567, paymentMethod: "card" },
];

export const globalSettings: GlobalSettings = {
  defaultCurrency: "INR",
  defaultTaxRate: 5,
  emailSettings: { smtpHost: "smtp.example.com", smtpPort: 587, senderEmail: "billing@cafebills.com" },
  smsSettings: { gateway: "twilio", apiKey: "***hidden***" },
};

// Helper functions
export const getShopItems = (shopId: string) => items.filter(i => i.shopId === shopId);
export const getShopUsers = (shopId: string) => users.filter(u => u.shopId === shopId);
export const getShopTransactions = (shopId: string) => transactions.filter(t => t.shopId === shopId);
export const getShop = (shopId: string) => shops.find(s => s.id === shopId);
export const getItemCategories = (shopId: string) => [...new Set(getShopItems(shopId).map(i => i.category))];

export const formatCurrency = (amount: number, symbol = "₹") => `${symbol}${amount.toFixed(2)}`;

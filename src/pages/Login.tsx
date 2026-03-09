import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { users, shops, getShop } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Coffee, Store, ChevronRight, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'role' | 'shop'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'admin' | 'cashier' | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email || !password) {
        toast.error('Please fill in all fields');
        return;
      }
      // Mock: check if email matches any user
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        toast.error('Invalid credentials. Try: rajesh@admin.com, priya@brewhouse.com, or amit@brewhouse.com');
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'super_admin') {
        login(user);
        navigate('/super-admin');
      } else {
        const shop = getShop(user.shopId);
        if (shop) {
          login(user, shop);
          navigate(`/shop/${user.shopId}`);
        }
      }
    } else {
      if (!name || !email || !password || !phone) {
        toast.error('Please fill in all fields');
        return;
      }
      toast.success('Account created! Select your role.');
      setStep('role');
    }
  };

  const handleRoleSelect = (role: 'super_admin' | 'admin' | 'cashier') => {
    if (role === 'super_admin') {
      const superAdmin = users.find(u => u.role === 'super_admin')!;
      login(superAdmin);
      navigate('/super-admin');
    } else {
      setSelectedRole(role);
      setStep('shop');
    }
  };

  const handleShopSelect = (shopId: string) => {
    const user = users.find(u => u.shopId === shopId && u.role === selectedRole);
    const shop = getShop(shopId);
    if (user && shop) {
      login(user, shop);
      navigate(`/shop/${shopId}`);
    }
  };

  const handleQuickLogin = () => {
    setStep('role');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: 'var(--gradient-warm)' }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE4YzEuNjU2IDAgMy0xLjM0NCAzLTNzLTEuMzQ0LTMtMy0zLTMgMS4zNDQtMyAzIDEuMzQ0IDMgMyAzem0wIDZjMS42NTYgMCAzLTEuMzQ0IDMtM3MtMS4zNDQtMy0zLTMtMyAxLjM0NC0zIDMgMS4zNDQgMyAzIDN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-primary-foreground">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-6">
              <Coffee className="h-10 w-10" />
            </div>
            <h1 className="font-display text-5xl font-bold mb-4 leading-tight">
              Welcome to<br />CaféBill
            </h1>
            <p className="text-lg opacity-80 max-w-md leading-relaxed">
              The modern multi-shop billing system designed for cafés, restaurants & retail outlets.
            </p>
          </div>

          <div className="space-y-4 mt-8">
            {[
              { icon: '☕', text: 'Manage multiple shops from one dashboard' },
              { icon: '📊', text: 'Real-time sales analytics & reports' },
              { icon: '🧾', text: 'Beautiful receipt-style invoicing' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-primary-foreground/10">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm opacity-90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-slide-in">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl mb-4" style={{ background: 'var(--gradient-warm)' }}>
              <Coffee className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">CaféBill</h1>
            <p className="text-muted-foreground mt-1 text-sm">Multi-Shop Billing System</p>
          </div>

          {step === 'form' && (
            <>
              {/* Tab switcher */}
              <div className="flex bg-muted rounded-xl p-1 mb-8">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {mode === 'login'
                    ? 'Sign in to access your dashboard'
                    : 'Get started with your café billing'}
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="pl-10 h-11 bg-muted/50 border-border focus:bg-card"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-muted/50 border-border focus:bg-card"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                    {mode === 'login' && (
                      <button type="button" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 bg-muted/50 border-border focus:bg-card"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="+91 99999 00000"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="pl-10 h-11 bg-muted/50 border-border focus:bg-card"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-semibold rounded-xl mt-2"
                  style={{ background: 'var(--gradient-warm)' }}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Quick login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 rounded-xl text-sm"
                onClick={handleQuickLogin}
              >
                <Coffee className="h-4 w-4 mr-2" />
                Quick Demo Login
              </Button>

              {mode === 'login' && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Demo emails: <span className="text-foreground font-medium">rajesh@admin.com</span>,{' '}
                  <span className="text-foreground font-medium">priya@brewhouse.com</span>,{' '}
                  <span className="text-foreground font-medium">amit@brewhouse.com</span>
                </p>
              )}
            </>
          )}

          {step === 'role' && (
            <div className="space-y-3">
              <Button variant="ghost" size="sm" className="mb-2 text-muted-foreground" onClick={() => setStep('form')}>
                ← Back to login
              </Button>
              <h2 className="font-display text-2xl font-bold text-foreground">Select your role</h2>
              <p className="text-sm text-muted-foreground mb-4">Choose how you'd like to sign in</p>
              {[
                { role: 'super_admin' as const, label: 'Super Admin', desc: 'Manage all shops & reports', icon: '👑', color: 'bg-accent/10' },
                { role: 'admin' as const, label: 'Shop Admin', desc: 'Manage your shop', icon: '🏪', color: 'bg-primary/10' },
                { role: 'cashier' as const, label: 'Cashier', desc: 'POS & billing', icon: '💳', color: 'bg-info/10' },
              ].map(opt => (
                <Card
                  key={opt.role}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 border group"
                  onClick={() => handleRoleSelect(opt.role)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={`h-12 w-12 rounded-xl ${opt.color} flex items-center justify-center text-2xl`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 'shop' && (
            <div className="space-y-3">
              <Button variant="ghost" size="sm" className="mb-2 text-muted-foreground" onClick={() => setStep('role')}>
                ← Back
              </Button>
              <h2 className="font-display text-2xl font-bold text-foreground">Select your shop</h2>
              <p className="text-sm text-muted-foreground mb-4">Choose the outlet to manage</p>
              {shops.map(shop => (
                <Card
                  key={shop.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30 border group"
                  onClick={() => handleShopSelect(shop.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{shop.name}</p>
                      <p className="text-xs text-muted-foreground">{shop.address}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-8">
            © 2026 CaféBill. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

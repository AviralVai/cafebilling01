import SuperAdminLayout from '@/components/Layout/SuperAdminLayout';
import { globalSettings } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SuperAdminSettings() {
  return (
    <SuperAdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Global Settings</h1>
        <p className="text-muted-foreground text-sm">System-wide configuration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-sm font-display">Default Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-xs">Default Currency</Label><Input defaultValue={globalSettings.defaultCurrency} className="mt-1" /></div>
            <div><Label className="text-xs">Default Tax Rate (%)</Label><Input type="number" defaultValue={globalSettings.defaultTaxRate} className="mt-1" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-display">Email Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-xs">SMTP Host</Label><Input defaultValue={globalSettings.emailSettings.smtpHost} className="mt-1" /></div>
            <div><Label className="text-xs">SMTP Port</Label><Input type="number" defaultValue={globalSettings.emailSettings.smtpPort} className="mt-1" /></div>
            <div><Label className="text-xs">Sender Email</Label><Input defaultValue={globalSettings.emailSettings.senderEmail} className="mt-1" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm font-display">SMS Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label className="text-xs">Gateway</Label><Input defaultValue={globalSettings.smsSettings.gateway} className="mt-1" /></div>
            <div><Label className="text-xs">API Key</Label><Input defaultValue={globalSettings.smsSettings.apiKey} type="password" className="mt-1" /></div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6">
        <Button onClick={() => toast.success('Settings saved successfully!')}>Save Settings</Button>
      </div>
    </SuperAdminLayout>
  );
}

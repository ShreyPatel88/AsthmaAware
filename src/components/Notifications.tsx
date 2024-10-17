import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle, XCircle, Filter, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AlertContext } from '@/contexts/AlertContext';

interface Notification {
  id: string;
  timestamp: Date;
  type: 'Air Quality Alert' | 'Medication Reminder' | 'Temperature Alert' | 'Humidity Alert';
  description: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filterType, setFilterType] = useState<string | null>(null);
  const { alertSettings, setAlertSettings } = useContext(AlertContext);
  const { toast } = useToast();

  const saveSettings = () => {
    setAlertSettings(alertSettings);
    toast({
      title: "Settings Saved",
      description: "Your alert settings have been saved.",
    });
  };

  const filteredNotifications = filterType
    ? notifications.filter(n => n.type === filterType)
    : notifications;

  const toggleRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Alert Settings</span>
            <Switch
              checked={alertSettings.realTimeAlertsEnabled}
              onCheckedChange={(checked) => setAlertSettings({...alertSettings, realTimeAlertsEnabled: checked})}
              aria-label="Toggle real-time alerts"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="iaq-threshold">IAQ Threshold:</Label>
            <Input
              id="iaq-threshold"
              type="number"
              value={alertSettings.iaqThreshold}
              onChange={(e) => setAlertSettings({...alertSettings, iaqThreshold: Number(e.target.value)})}
              className="w-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="humidity-threshold">Humidity Threshold (%):</Label>
            <Input
              id="humidity-threshold"
              type="number"
              value={alertSettings.humidityThreshold}
              onChange={(e) => setAlertSettings({...alertSettings, humidityThreshold: Number(e.target.value)})}
              className="w-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="temperature-threshold">Temperature Threshold (°C):</Label>
            <Input
              id="temperature-threshold"
              type="number"
              value={alertSettings.temperatureThreshold}
              onChange={(e) => setAlertSettings({...alertSettings, temperatureThreshold: Number(e.target.value)})}
              className="w-20"
            />
          </div>
          <Button onClick={saveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Rest of the component remains the same */}
    </div>
  );
};

export default Notifications;
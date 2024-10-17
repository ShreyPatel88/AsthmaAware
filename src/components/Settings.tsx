import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    // Check if notifications are enabled in localStorage
    const isNotificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    setNotificationsEnabled(isNotificationsEnabled);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark');
    toast({
      title: newDarkMode ? "Dark Mode Enabled" : "Dark Mode Disabled",
      description: newDarkMode ? "The app is now in dark mode." : "The app is now in light mode.",
    });
  };

  const toggleNotifications = () => {
    const newNotificationsEnabled = !notificationsEnabled;
    setNotificationsEnabled(newNotificationsEnabled);
    localStorage.setItem('notificationsEnabled', newNotificationsEnabled.toString());
    toast({
      title: newNotificationsEnabled ? "Notifications Enabled" : "Notifications Disabled",
      description: newNotificationsEnabled ? "You will now receive notifications." : "You will no longer receive notifications.",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Dark Mode</Label>
            <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Notifications</Label>
            <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="air-quality-alerts">Air Quality Alerts</Label>
            <Switch id="air-quality-alerts" />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="medication-reminders">Medication Reminders</Label>
            <Switch id="medication-reminders" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
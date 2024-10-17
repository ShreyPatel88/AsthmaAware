import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bluetooth, Settings, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { bluetoothService } from '@/services/BluetoothService';
import WeatherCard from './dashboard/WeatherCard';
import RealTimeMonitoringCard from './dashboard/RealTimeMonitoringCard';
import InsightsCard from './dashboard/InsightsCard';
import AirQualityMapCard from './dashboard/AirQualityMapCard';
import HighlightsCard from './dashboard/HighlightsCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCard from './DraggableCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState(['weather', 'realTimeMonitoring', 'insights', 'airQualityMap', 'highlights']);
  const { toast } = useToast();
  const [location, setLocation] = useState("Long Beach, CA");
  const [weatherData, setWeatherData] = useState({
    aqi: 0,
    temperature: 0,
    humidity: 0,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [alertSettings, setAlertSettings] = useState(() => {
    const savedSettings = localStorage.getItem('alertSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      realTimeAlertsEnabled: true,
      iaqThreshold: 100,
      humidityThreshold: 60,
      temperatureThreshold: 30,
    };
  });

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }

    const isNotificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
    setNotificationsEnabled(isNotificationsEnabled);
  }, []);

  useEffect(() => {
    // Check for alerts based on current data and alert settings
    if (alertSettings.realTimeAlertsEnabled) {
      if (weatherData.aqi > alertSettings.iaqThreshold) {
        toast({
          title: "Air Quality Alert",
          description: `AQI is above your set threshold of ${alertSettings.iaqThreshold}.`,
          variant: "destructive",
        });
      }
      if (weatherData.humidity > alertSettings.humidityThreshold) {
        toast({
          title: "Humidity Alert",
          description: `Humidity is above your set threshold of ${alertSettings.humidityThreshold}%.`,
          variant: "destructive",
        });
      }
      if (weatherData.temperature > alertSettings.temperatureThreshold) {
        toast({
          title: "Temperature Alert",
          description: `Temperature is above your set threshold of ${alertSettings.temperatureThreshold}°C.`,
          variant: "destructive",
        });
      }
    }
  }, [weatherData, alertSettings, toast]);

  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const newLayout = [...layout];
    const draggedItem = newLayout[dragIndex];
    newLayout.splice(dragIndex, 1);
    newLayout.splice(hoverIndex, 0, draggedItem);
    setLayout(newLayout);
  };

  const handleBluetoothConnect = async () => {
    const connected = await bluetoothService.connect();
    if (connected) {
      toast({
        title: "Connected",
        description: "Successfully connected to the device.",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the device. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    toast({
      title: "Location Updated",
      description: `Weather data updated for ${newLocation}`,
    });
  };

  const handleWeatherDataUpdate = (data: any) => {
    setWeatherData({
      aqi: data.airQuality.list[0].main.aqi,
      temperature: data.temperature,
      humidity: data.humidity,
    });
  };

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
    setAlertSettings(prev => ({ ...prev, realTimeAlertsEnabled: newNotificationsEnabled }));
    localStorage.setItem('alertSettings', JSON.stringify({ ...alertSettings, realTimeAlertsEnabled: newNotificationsEnabled }));
    toast({
      title: newNotificationsEnabled ? "Notifications Enabled" : "Notifications Disabled",
      description: newNotificationsEnabled ? "You will now receive notifications." : "You will no longer receive notifications.",
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-50 dark:bg-gray-900 pb-24">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <Label htmlFor="dark-mode" className="cursor-pointer">Dark Mode</Label>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center justify-between w-full">
                    <Label htmlFor="notifications" className="cursor-pointer">Notifications</Label>
                    <Switch id="notifications" checked={notificationsEnabled} onCheckedChange={toggleNotifications} />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <div className="text-sm sm:text-base text-muted-foreground dark:text-gray-400">Welcome back,</div>
              <div className="font-semibold text-lg sm:text-xl dark:text-white">User</div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex items-center" onClick={handleBluetoothConnect}>
            <Bluetooth className="w-4 h-4 mr-2" />
            Connect
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {layout.map((cardType, index) => (
            <DraggableCard key={cardType} index={index} id={cardType} moveCard={moveCard}>
              {cardType === 'weather' && (
                <WeatherCard
                  onLocationChange={handleLocationChange}
                  onWeatherDataUpdate={handleWeatherDataUpdate}
                />
              )}
              {cardType === 'realTimeMonitoring' && (
                <RealTimeMonitoringCard alertSettings={alertSettings} />
              )}
              {cardType === 'insights' && (
                <InsightsCard
                  aqi={weatherData.aqi}
                  temperature={weatherData.temperature}
                  humidity={weatherData.humidity}
                />
              )}
              {cardType === 'airQualityMap' && (
                <AirQualityMapCard />
              )}
              {cardType === 'highlights' && (
                <HighlightsCard
                  humidity={weatherData.humidity}
                  pressure={0}
                  visibility={0}
                  feels_like={0}
                  sunrise={0}
                  sunset={0}
                />
              )}
            </DraggableCard>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { bluetoothService } from '@/services/BluetoothService';

interface AlertSettings {
  realTimeAlertsEnabled: boolean;
  iaqThreshold: number;
  humidityThreshold: number;
  temperatureThreshold: number;
}

interface AlertContextType {
  alertSettings: AlertSettings;
  setAlertSettings: React.Dispatch<React.SetStateAction<AlertSettings>>;
  lastReadings: {
    iaq: number;
    temperature: number;
    humidity: number;
  };
}

export const AlertContext = createContext<AlertContextType>({
  alertSettings: {
    realTimeAlertsEnabled: true,
    iaqThreshold: 100,
    humidityThreshold: 60,
    temperatureThreshold: 30,
  },
  setAlertSettings: () => {},
  lastReadings: {
    iaq: 0,
    temperature: 0,
    humidity: 0,
  },
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    const savedSettings = localStorage.getItem('alertSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      realTimeAlertsEnabled: true,
      iaqThreshold: 100,
      humidityThreshold: 60,
      temperatureThreshold: 30,
    };
  });

  const [lastReadings, setLastReadings] = useState({
    iaq: 0,
    temperature: 0,
    humidity: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('alertSettings', JSON.stringify(alertSettings));
  }, [alertSettings]);

  useEffect(() => {
    let lastAlertTime = 0;
    const interval = setInterval(async () => {
      if (alertSettings.realTimeAlertsEnabled && bluetoothService.isConnected()) {
        try {
          const temperature = await bluetoothService.readCharacteristic('temperature');
          const humidity = await bluetoothService.readCharacteristic('humidity');
          const bsec = await bluetoothService.readCharacteristic('bsec');

          setLastReadings({ iaq: bsec, temperature, humidity });

          const currentTime = Date.now();
          if (currentTime - lastAlertTime >= 10000) { // Check every 10 seconds
            if (bsec > alertSettings.iaqThreshold) {
              toast({
                title: "Air Quality Alert",
                description: `IAQ level (${bsec.toFixed(1)}) exceeds threshold.`,
              });
              lastAlertTime = currentTime;
            }
            if (humidity > alertSettings.humidityThreshold) {
              toast({
                title: "Humidity Alert",
                description: `Humidity (${humidity.toFixed(1)}%) exceeds threshold.`,
              });
              lastAlertTime = currentTime;
            }
            if (temperature > alertSettings.temperatureThreshold) {
              toast({
                title: "Temperature Alert",
                description: `Temperature (${temperature.toFixed(1)}°C) exceeds threshold.`,
              });
              lastAlertTime = currentTime;
            }
          }
        } catch (error) {
          console.error('Error reading data from Nicla Sense ME:', error);
        }
      }
    }, 5000); // Update readings every 5 seconds

    return () => clearInterval(interval);
  }, [alertSettings, toast]);

  return (
    <AlertContext.Provider value={{ alertSettings, setAlertSettings, lastReadings }}>
      {children}
    </AlertContext.Provider>
  );
};
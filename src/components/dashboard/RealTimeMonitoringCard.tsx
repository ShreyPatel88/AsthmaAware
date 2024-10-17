import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bluetoothService } from '@/services/BluetoothService';
import { useToast } from "@/hooks/use-toast";

const RealTimeMonitoringCard: React.FC = () => {
  const [data, setData] = useState({
    iaq: 0,
    temperature: 0,
    humidity: 0,
    pressure: 0,
    co2: 0,
  });
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (bluetoothService.isConnected()) {
        setIsConnected(true);
        try {
          const temperature = await bluetoothService.readCharacteristic('temperature');
          const humidity = await bluetoothService.readCharacteristic('humidity');
          const pressure = await bluetoothService.readCharacteristic('pressure');
          const bsec = await bluetoothService.readCharacteristic('iaq');
          const co2 = await bluetoothService.readCharacteristic('co2');

          setData({
            iaq: Math.round(bsec),
            temperature: temperature,
            humidity: humidity,
            pressure: pressure,
            co2: co2,
          });

          // Check for alerts
          const iaqThreshold = Number(localStorage.getItem('iaqThreshold')) || 100;
          const humidityThreshold = Number(localStorage.getItem('humidityThreshold')) || 60;
          const temperatureThreshold = Number(localStorage.getItem('temperatureThreshold')) || 30;

          if (bsec > iaqThreshold) {
            toast({
              title: "Air Quality Alert",
              description: `IAQ level (${bsec.toFixed(1)}) exceeds threshold.`,
            });
          }
          if (humidity > humidityThreshold) {
            toast({
              title: "Humidity Alert",
              description: `Humidity (${humidity.toFixed(1)}%) exceeds threshold.`,
            });
          }
          if (temperature > temperatureThreshold) {
            toast({
              title: "Temperature Alert",
              description: `Temperature (${temperature.toFixed(1)}°C) exceeds threshold.`,
            });
          }
        } catch (error) {
          console.error('Error reading data from Nicla Sense ME:', error);
        }
      } else {
        setIsConnected(false);
      }
    };

    const interval = setInterval(fetchData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [toast]);

  const getIAQStatus = (iaq: number) => {
    if (iaq <= 50) return 'Good';
    if (iaq <= 100) return 'Moderate';
    if (iaq <= 150) return 'Unhealthy for Sensitive Groups';
    if (iaq <= 200) return 'Unhealthy';
    if (iaq <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getIAQColor = (iaq: number) => {
    if (iaq <= 50) return 'text-green-500 dark:text-green-400';
    if (iaq <= 100) return 'text-yellow-500 dark:text-yellow-400';
    if (iaq <= 150) return 'text-orange-500 dark:text-orange-400';
    if (iaq <= 200) return 'text-red-500 dark:text-red-400';
    if (iaq <= 300) return 'text-purple-500 dark:text-purple-400';
    return 'text-rose-500 dark:text-rose-400';
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Real-Time Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <>
            <div className="flex items-center space-x-2">
              <span className={`text-5xl sm:text-6xl font-bold ${getIAQColor(data.iaq)}`}>
                {data.iaq}
              </span>
              <div>
                <div className="font-semibold">{getIAQStatus(data.iaq)}</div>
                <div className="text-sm text-muted-foreground dark:text-gray-400">Indoor Air Quality</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-secondary dark:bg-gray-700 p-3 rounded-md">
                <div className="text-sm text-muted-foreground dark:text-gray-400">Temperature</div>
                <div className="text-base sm:text-lg font-semibold">
                  {data.temperature.toFixed(1)}°C
                </div>
              </div>
              <div className="bg-secondary dark:bg-gray-700 p-3 rounded-md">
                <div className="text-sm text-muted-foreground dark:text-gray-400">Humidity</div>
                <div className="text-base sm:text-lg font-semibold">
                  {data.humidity.toFixed(1)}%
                </div>
              </div>
              <div className="bg-secondary dark:bg-gray-700 p-3 rounded-md">
                <div className="text-sm text-muted-foreground dark:text-gray-400">Pressure</div>
                <div className="text-base sm:text-lg font-semibold">
                  {data.pressure.toFixed(1)} hPa
                </div>
              </div>
              <div className="bg-secondary dark:bg-gray-700 p-3 rounded-md">
                <div className="text-sm text-muted-foreground dark:text-gray-400">CO2</div>
                <div className="text-base sm:text-lg font-semibold">
                  {data.co2} ppm
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-lg font-semibold mb-2">Not Connected</p>
            <p className="text-sm text-muted-foreground">Please connect to the Nicla Sense ME device to view real-time data.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoringCard;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sunrise, Sunset, Droplets, Gauge, Eye, Thermometer } from 'lucide-react';

interface HighlightsCardProps {
  humidity: number;
  pressure: number;
  visibility: number;
  feels_like: number;
  sunrise: number;
  sunset: number;
}

const HighlightsCard: React.FC<HighlightsCardProps> = ({
  humidity,
  pressure,
  visibility,
  feels_like,
  sunrise,
  sunset
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="bg-white dark:bg-gray-800 col-span-full">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl dark:text-white">Today's Highlights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">Sunrise & Sunset</h3>
              <Sunrise className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-xl font-semibold dark:text-white">{formatTime(sunrise)}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-muted-foreground dark:text-gray-300">Sunset</p>
              <Sunset className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xl font-semibold dark:text-white">{formatTime(sunset)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">Humidity</h3>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold dark:text-white">{humidity}<span className="text-base font-normal dark:text-gray-300">%</span></p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">Pressure</h3>
              <Gauge className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-semibold dark:text-white">{pressure}<span className="text-base font-normal dark:text-gray-300">hPa</span></p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">Visibility</h3>
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-semibold dark:text-white">{(visibility / 1000).toFixed(1)}<span className="text-base font-normal dark:text-gray-300">km</span></p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium dark:text-gray-200">Feels Like</h3>
              <Thermometer className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-2xl font-semibold dark:text-white">{feels_like}<span className="text-base font-normal dark:text-gray-300">°F</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HighlightsCard;
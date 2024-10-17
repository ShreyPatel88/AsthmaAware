import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind } from 'lucide-react'; // Changed from 'Air' to 'Wind'

interface AirQualityData {
  list: [{
    main: { aqi: number },
    components: {
      no2: number,
      o3: number,
      so2: number,
      pm2_5: number
    }
  }]
}

interface AirQualityCardProps {
  airQuality: AirQualityData;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const { aqi } = airQuality.list[0].main;
  const { no2, o3, so2, pm2_5 } = airQuality.list[0].components;

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-100 text-green-800';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800';
    if (aqi <= 200) return 'bg-red-100 text-red-800';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800';
    return 'bg-rose-100 text-rose-800';
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Air Quality Index</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Wind className="w-8 h-8 text-blue-500" /> {/* Changed from Air to Wind */}
          <ul className="grid grid-cols-2 gap-4 flex-grow">
            <li className="text-center">
              <p className="text-xl font-semibold">{pm2_5.toPrecision(3)}</p>
              <p className="text-sm text-muted-foreground">PM<sub>2.5</sub></p>
            </li>
            <li className="text-center">
              <p className="text-xl font-semibold">{so2.toPrecision(3)}</p>
              <p className="text-sm text-muted-foreground">SO<sub>2</sub></p>
            </li>
            <li className="text-center">
              <p className="text-xl font-semibold">{no2.toPrecision(3)}</p>
              <p className="text-sm text-muted-foreground">NO<sub>2</sub></p>
            </li>
            <li className="text-center">
              <p className="text-xl font-semibold">{o3.toPrecision(3)}</p>
              <p className="text-sm text-muted-foreground">O<sub>3</sub></p>
            </li>
          </ul>
        </div>
        <div className={`text-center p-2 rounded-md ${getAQIColor(aqi)}`}>
          <span className="font-semibold">{getAQILevel(aqi)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityCard;
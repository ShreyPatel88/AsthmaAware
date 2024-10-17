import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const API_KEY = '1b5398b650e4a3edef0dc32752facbf8'; // Replace with your actual API key

interface AirQualityData {
  lat: number;
  lon: number;
  aqi: number;
}

const AirQualityMapCard: React.FC = () => {
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([34.0522, -118.2437]); // Los Angeles coordinates

  useEffect(() => {
    fetchAirQualityData();
  }, []);

  const fetchAirQualityData = async () => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${mapCenter[0]}&lon=${mapCenter[1]}&appid=${API_KEY}`);
      const data = response.data.list.map((item: any) => ({
        lat: mapCenter[0] + (Math.random() - 0.5) * 0.5, // Add some randomness for visualization
        lon: mapCenter[1] + (Math.random() - 0.5) * 0.5,
        aqi: item.main.aqi,
      }));
      setAirQualityData(data);
    } catch (error) {
      console.error('Error fetching air quality data:', error);
    }
  };

  const getColor = (aqi: number) => {
    if (aqi <= 50) return "#00e400";
    if (aqi <= 100) return "#ffff00";
    if (aqi <= 150) return "#ff7e00";
    if (aqi <= 200) return "#ff0000";
    if (aqi <= 300) return "#8f3f97";
    return "#7e0023";
  };

  return (
    <Card className="bg-white dark:bg-gray-800 md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl dark:text-white">Air Quality Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full overflow-hidden rounded-lg">
          <MapContainer center={mapCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {airQualityData.map((data, index) => (
              <CircleMarker
                key={index}
                center={[data.lat, data.lon]}
                radius={10}
                fillColor={getColor(data.aqi)}
                color={getColor(data.aqi)}
                weight={1}
                opacity={0.8}
                fillOpacity={0.6}
              >
                <Tooltip className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-0 shadow-lg">
                  AQI: {data.aqi}
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirQualityMapCard;
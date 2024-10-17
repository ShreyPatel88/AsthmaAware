import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, CloudSun, Wind, Droplets, Search, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from 'axios';

const API_KEY = '1b5398b650e4a3edef0dc32752facbf8'; // Replace with your actual API key

interface AirQualityData {
  list: [{
    main: { aqi: number },
    components: {
      no2: number,
      o3: number,
      so2: number,
      pm2_5: number,
      pm10: number
    }
  }]
}

interface WeatherData {
  location: string;
  temperature: number;
  high: number;
  low: number;
  description: string;
  humidity: number;
  airQuality: AirQualityData;
}

interface WeatherCardProps {
  onLocationChange: (location: string) => void;
  onWeatherDataUpdate: (data: WeatherData) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ onLocationChange, onWeatherDataUpdate }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { toast } = useToast();

  const californiaLocations = [
    "Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose",
    "Fresno", "Long Beach", "Oakland", "Bakersfield", "Anaheim"
  ];

  useEffect(() => {
    const savedLocation = localStorage.getItem('lastLocation') || "Los Angeles";
    fetchWeatherData(savedLocation, false);
  }, []);

  const fetchWeatherData = async (location: string, isManualUpdate: boolean) => {
    try {
      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location},CA,US&units=imperial&appid=${API_KEY}`);
      const airQualityResponse = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherResponse.data.coord.lat}&lon=${weatherResponse.data.coord.lon}&appid=${API_KEY}`);
      
      const newWeatherData: WeatherData = {
        location: weatherResponse.data.name,
        temperature: Math.round(weatherResponse.data.main.temp),
        high: Math.round(weatherResponse.data.main.temp_max),
        low: Math.round(weatherResponse.data.main.temp_min),
        description: weatherResponse.data.weather[0].description,
        humidity: weatherResponse.data.main.humidity,
        airQuality: airQualityResponse.data
      };

      setWeatherData(newWeatherData);
      onWeatherDataUpdate(newWeatherData);
      
      if (isManualUpdate) {
        onLocationChange(location);
        localStorage.setItem('lastLocation', location);
        toast({
          title: "Location Updated",
          description: `Weather data updated for ${location}`,
        });
      }
    } catch (error) {
      let errorMessage = "Failed to fetch weather data. Please try again.";
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error fetching weather data:', errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (location: string) => {
    setValue(location);
    setOpen(false);
    fetchWeatherData(location, true);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`);
            const cityName = response.data[0].name;
            fetchWeatherData(cityName, true);
          } catch (error) {
            console.error('Error getting current location:', error);
            toast({
              title: "Error",
              description: "Failed to get current location. Please try again.",
              variant: "destructive",
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Error",
            description: "Failed to get current location. Please enable location services and try again.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
    }
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-400 text-green-800';
    if (aqi <= 100) return 'bg-yellow-300 text-yellow-800';
    if (aqi <= 150) return 'bg-orange-300 text-orange-800';
    if (aqi <= 200) return 'bg-red-300 text-red-800';
    if (aqi <= 300) return 'bg-purple-300 text-purple-800';
    return 'bg-rose-300 text-rose-800';
  };

  return (
    <Card className="bg-white md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm sm:text-base">{weatherData?.location || 'Loading...'}</span>
          </div>
          <div className="flex space-x-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[130px] justify-start">
                  {value ? (
                    <>{value}</>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      <span>Select city</span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup>
                    {californiaLocations.map((city) => (
                      <CommandItem
                        key={city}
                        value={city}
                        onSelect={() => handleLocationSelect(city)}
                      >
                        {city}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" onClick={handleCurrentLocation}>
              <Crosshair className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {weatherData ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-4xl sm:text-5xl font-bold">{weatherData.temperature}°</div>
                <div className="text-sm sm:text-base text-muted-foreground">{weatherData.high}° / {weatherData.low}°</div>
              </div>
              <CloudSun className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>

            <div className="mb-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Humidity</h3>
                <Droplets className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-semibold">{weatherData.humidity}<span className="text-base font-normal">%</span></p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-medium">Air Quality Index</h3>
                </div>
                <div className={`px-3 py-1 rounded-full ${getAQIColor(weatherData.airQuality.list[0].main.aqi)} flex items-center`}>
                  <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                  <span className="font-medium text-sm">{getAQILevel(weatherData.airQuality.list[0].main.aqi)}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-gray-700">{weatherData.airQuality.list[0].components.pm2_5.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">PM<sub>2.5</sub></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-semibold text-gray-700">{weatherData.airQuality.list[0].components.so2.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">SO<sub>2</sub></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-semibold text-gray-700">{weatherData.airQuality.list[0].components.no2.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">NO<sub>2</sub></span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-2xl font-semibold text-gray-700">{weatherData.airQuality.list[0].components.o3.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">O<sub>3</sub></span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4">Loading weather data...</div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
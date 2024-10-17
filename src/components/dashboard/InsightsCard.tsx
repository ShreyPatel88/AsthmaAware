import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ThumbsUp, Wind } from "lucide-react";

interface InsightsCardProps {
  aqi: number;
  temperature: number;
  humidity: number;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ aqi, temperature, humidity }) => {
  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getInsights = () => {
    const insights = [];

    // AQI-based insights
    if (aqi <= 50) {
      insights.push("Air quality is good. It's a great day for outdoor activities!");
    } else if (aqi <= 100) {
      insights.push("Air quality is moderate. Consider reducing prolonged outdoor exertion if you're sensitive to air pollution.");
    } else if (aqi <= 150) {
      insights.push("Air quality is unhealthy for sensitive groups. Limit outdoor activities and keep your rescue inhaler handy.");
    } else if (aqi > 150) {
      insights.push("Air quality is unhealthy. Stay indoors if possible and ensure your living space has good air filtration.");
    }

    // Temperature-based insights
    if (temperature < 32) {
      insights.push("Cold temperatures can trigger asthma. Wear a scarf over your mouth and nose when going outside.");
    } else if (temperature > 90) {
      insights.push("High temperatures can affect breathing. Stay cool and hydrated.");
    }

    // Humidity-based insights
    if (humidity < 30) {
      insights.push("Low humidity can dry out airways. Use a humidifier indoors.");
    } else if (humidity > 60) {
      insights.push("High humidity can promote mold growth. Use dehumidifiers and check for indoor mold.");
    }

    return insights;
  };

  const getPreventiveMeasures = () => {
    const measures = [
      "Take your prescribed asthma medications as directed",
      "Keep your rescue inhaler with you at all times",
      "Monitor your peak flow regularly",
      "Follow your asthma action plan",
    ];

    if (aqi > 100) {
      measures.push("Use air purifiers with HEPA filters indoors");
      measures.push("Limit outdoor activities, especially during peak pollution hours");
    }

    if (aqi > 150) {
      measures.push("Wear an N95 mask if you must go outside");
    }

    return measures;
  };

  const insights = getInsights();
  const measures = getPreventiveMeasures();

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Asthma Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Current Conditions
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
              {insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-green-500" />
              Preventive Measures
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base">
              {measures.map((measure, index) => (
                <li key={index}>{measure}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
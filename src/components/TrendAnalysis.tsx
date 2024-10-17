import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendAnalysisProps {
  data: Array<{
    date: string;
    attacks: number;
    pm25: number;
    humidity: number;
    temperature: number;
  }>;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data }) => {
  const calculateTrend = (metric: 'attacks' | 'pm25' | 'humidity' | 'temperature') => {
    if (data.length < 6) return 'insufficient data';
    const values = data.map(item => item[metric]);
    const firstHalf = values.slice(0, 3);
    const secondHalf = values.slice(-3);
    const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    return secondHalfAvg > firstHalfAvg ? 'up' : 'down';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trend Analysis</CardTitle>
        <CardDescription>Analysis of your health and environmental trends</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-center">
            <span className="font-medium mr-2">Asthma Attacks:</span>
            {calculateTrend('attacks') === 'up' ? (
              <TrendingUp className="text-red-500" />
            ) : calculateTrend('attacks') === 'down' ? (
              <TrendingDown className="text-green-500" />
            ) : (
              <span className="text-yellow-500">Insufficient data</span>
            )}
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-2">Humidity:</span>
            {calculateTrend('humidity') === 'up' ? (
              <TrendingUp className="text-blue-500" />
            ) : calculateTrend('humidity') === 'down' ? (
              <TrendingDown className="text-orange-500" />
            ) : (
              <span className="text-yellow-500">Insufficient data</span>
            )}
          </li>
          <li className="flex items-center">
            <span className="font-medium mr-2">Temperature:</span>
            {calculateTrend('temperature') === 'up' ? (
              <TrendingUp className="text-red-500" />
            ) : calculateTrend('temperature') === 'down' ? (
              <TrendingDown className="text-blue-500" />
            ) : (
              <span className="text-yellow-500">Insufficient data</span>
            )}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface ChartWrapperProps {
  data: Array<{
    date: string;
    attacks: number;
    pm25: number;
    humidity: number;
    temperature: number;
  }>;
  activeMetrics: {
    attacks: boolean;
    pm25: boolean;
    humidity: boolean;
    temperature: boolean;
  };
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ data, activeMetrics }) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <>
      <div className="w-full h-[300px] sm:h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: '0.7rem' }}
              tickFormatter={(value) => value.slice(5)}
              tickMargin={10}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: '0.7rem' }}
              width={40}
              tickFormatter={(value) => `${value}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--muted-foreground)', fontSize: '0.7rem' }}
              width={40}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              cursor={{ stroke: 'var(--muted)', strokeWidth: 1 }}
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
                      <p className="text-sm font-semibold">{payload[0].payload.date}</p>
                      {activeMetrics.attacks && <p className="text-xs">Asthma Attacks: <span className="font-semibold">{payload[0].value}</span></p>}
                      {activeMetrics.pm25 && <p className="text-xs">PM2.5: <span className="font-semibold">{payload[1].value.toFixed(2)} µg/m³</span></p>}
                      {activeMetrics.humidity && <p className="text-xs">Humidity: <span className="font-semibold">{payload[2].value.toFixed(2)}%</span></p>}
                      {activeMetrics.temperature && <p className="text-xs">Temperature: <span className="font-semibold">{payload[3].value.toFixed(2)}°F</span></p>}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              iconSize={10}
              iconType="circle"
            />
            {activeMetrics.attacks && (
              <Area 
                yAxisId="left"
                type="monotone"
                dataKey="attacks" 
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorAttacks)"
                name="Asthma Attacks"
              />
            )}
            {activeMetrics.pm25 && (
              <Area 
                yAxisId="right"
                type="monotone"
                dataKey="pm25" 
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorPM25)"
                name="PM2.5 (µg/m³)"
              />
            )}
            {activeMetrics.humidity && (
              <Area 
                yAxisId="right"
                type="monotone"
                dataKey="humidity" 
                stroke="hsl(var(--chart-3))"
                fillOpacity={1}
                fill="url(#colorHumidity)"
                name="Humidity (%)"
              />
            )}
            {activeMetrics.temperature && (
              <Area 
                yAxisId="right"
                type="monotone"
                dataKey="temperature" 
                stroke="hsl(var(--chart-4))"
                fillOpacity={1}
                fill="url(#colorTemperature)"
                name="Temperature (°F)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ChartWrapper;
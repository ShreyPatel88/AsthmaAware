import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LogEntry {
  date: string;
  attacks: number;
  pm25: number;
  humidity: number;
  temperature: number;
}

interface SymptomLogProps {
  entries: LogEntry[];
}

const SymptomLog: React.FC<SymptomLogProps> = ({ entries }) => {
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentLogs = sortedEntries.slice(0, 5); // Show only the 5 most recent entries

  return (
    <Card className="h-[400px] flex flex-col"> {/* Set a fixed height and use flex */}
      <CardHeader>
        <CardTitle>Recent Symptom Logs</CardTitle>
        <CardDescription>Your most recent asthma attack entries</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto"> {/* Allow vertical scrolling */}
        <ul className="space-y-4">
          {recentLogs.map((log, index) => (
            <li key={index} className="border-b pb-2 last:border-b-0">
              <p className="font-semibold">{new Date(log.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Asthma Attacks:</span> {log.attacks}</p>
              <p><span className="font-medium">PM2.5:</span> {log.pm25.toFixed(2)} µg/m³</p>
              <p><span className="font-medium">Temperature:</span> {log.temperature.toFixed(2)}°F</p>
              <p><span className="font-medium">Humidity:</span> {log.humidity.toFixed(2)}%</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SymptomLog;
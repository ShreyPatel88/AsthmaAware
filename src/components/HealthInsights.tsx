import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ChartWrapper from './ChartWrapper';
import SymptomLog from './SymptomLog';
import TrendAnalysis from './TrendAnalysis';
import { Plus, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface LogEntry {
  date: string;
  attacks: number;
  pm25: number;
  humidity: number;
  temperature: number;
}

const generateMockData = (): LogEntry[] => {
  const today = new Date();
  const data: LogEntry[] = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      attacks: Math.floor(Math.random() * 3),
      pm25: Math.random() * 50 + 10,
      humidity: Math.random() * 30 + 40,
      temperature: Math.random() * 15 + 60,
    });
  }
  return data;
};

const HealthInsights: React.FC = () => {
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [attackCount, setAttackCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [activeMetrics, setActiveMetrics] = useState({
    attacks: true,
    pm25: true,
    humidity: true,
    temperature: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    const mockData = generateMockData();
    setLogEntries(mockData);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date.",
        variant: "destructive",
      });
      return;
    }

    setLogEntries(prevEntries => {
      const updatedEntries = prevEntries.map(entry => {
        if (entry.date === selectedDate) {
          return {
            ...entry,
            attacks: entry.attacks + attackCount,
          };
        }
        return entry;
      });

      if (!updatedEntries.some(entry => entry.date === selectedDate)) {
        updatedEntries.push({
          date: selectedDate,
          attacks: attackCount,
          pm25: Math.random() * 50 + 10,
          humidity: Math.random() * 30 + 40,
          temperature: Math.random() * 15 + 60,
        });
      }

      return updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    toast({
      title: "Success",
      description: `Logged ${attackCount} asthma attack(s) for ${selectedDate}`,
    });

    setIsDialogOpen(false);
    setSelectedDate('');
    setAttackCount(1);
    setNotes('');
  };

  const toggleMetric = (metric: keyof typeof activeMetrics) => {
    setActiveMetrics(prev => ({ ...prev, [metric]: !prev[metric] }));
  };

  const filteredData = logEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return entryDate >= oneMonthAgo;
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold mb-4">Health Insights</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Asthma and Environmental Factors</span>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuCheckboxItem
                    checked={activeMetrics.attacks}
                    onCheckedChange={() => toggleMetric('attacks')}
                  >
                    Asthma Attacks
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeMetrics.pm25}
                    onCheckedChange={() => toggleMetric('pm25')}
                  >
                    PM2.5
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeMetrics.humidity}
                    onCheckedChange={() => toggleMetric('humidity')}
                  >
                    Humidity
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeMetrics.temperature}
                    onCheckedChange={() => toggleMetric('temperature')}
                  >
                    Temperature
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Asthma Attack
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Asthma Attack</DialogTitle>
                    <DialogDescription>
                      Record the details of your asthma attack.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="attacks">Number of Attacks</Label>
                        <Input
                          id="attacks"
                          type="number"
                          min="1"
                          value={attackCount}
                          onChange={(e) => setAttackCount(parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Textarea
                          id="notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button type="submit">Log Attack</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardTitle>
          <CardDescription>Asthma attacks, PM2.5 levels, humidity, and temperature over time</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <ChartWrapper data={filteredData} activeMetrics={activeMetrics} />
          ) : (
            <p>No data available for the selected time period.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <SymptomLog entries={logEntries} />
        <TrendAnalysis data={logEntries} />
      </div>
    </div>
  );
};

export default HealthInsights;
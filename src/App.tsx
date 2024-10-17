import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Activity, Bell, BookOpen } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import HealthInsights from '@/components/HealthInsights';
import Notifications from '@/components/Notifications';
import Resources from '@/components/Resources';
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from '@/components/ErrorBoundary';
import { bluetoothService } from '@/services/BluetoothService';
import { useToast } from "@/hooks/use-toast";
import { AlertProvider } from '@/contexts/AlertContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  return (
    <ErrorBoundary>
      <AlertProvider>
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <main className="flex-grow overflow-auto pb-24">
              <TabsContent value="home" className="mt-0 h-full">
                <Dashboard />
              </TabsContent>
              <TabsContent value="health" className="mt-0 h-full">
                <HealthInsights />
              </TabsContent>
              <TabsContent value="notifications" className="mt-0 h-full">
                <Notifications />
              </TabsContent>
              <TabsContent value="resources" className="mt-0 h-full">
                <Resources />
              </TabsContent>
            </main>
            <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-[1000]">
              <TabsList className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 h-auto">
                <TabsTrigger value="home" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 rounded-full px-4 py-2 transition-all duration-200 ease-in-out">
                  <div className="flex flex-col items-center">
                    <Home className="h-5 w-5" />
                    <span className="text-xs mt-1">Home</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 rounded-full px-4 py-2 transition-all duration-200 ease-in-out">
                  <div className="flex flex-col items-center">
                    <Activity className="h-5 w-5" />
                    <span className="text-xs mt-1">Health</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 rounded-full px-4 py-2 transition-all duration-200 ease-in-out">
                  <div className="flex flex-col items-center">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs mt-1">Alerts</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="resources" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-gray-600 rounded-full px-4 py-2 transition-all duration-200 ease-in-out">
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-xs mt-1">Resources</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          <Toaster />
        </div>
      </AlertProvider>
    </ErrorBoundary>
  );
};

export default App;
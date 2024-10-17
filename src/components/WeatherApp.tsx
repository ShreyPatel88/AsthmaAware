import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Bluetooth, CloudSun } from "lucide-react"

export default function WeatherApp() {
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" alt="Jason" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm sm:text-base text-muted-foreground">Good Afternoon,</div>
            <div className="font-semibold text-lg sm:text-xl">
              Jason <span className="text-yellow-400">👋</span>
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="flex items-center">
          <Bluetooth className="w-4 h-4 mr-2" />
          Connect
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm sm:text-base">Long Beach, CA</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold">85°</div>
                <div className="text-sm sm:text-base text-muted-foreground">87° / 63°</div>
              </div>
              <CloudSun className="w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4">
              {[
                { label: "AQI", value: "54" },
                { label: "PM2.5", value: "52" },
                { label: "PM10", value: "13" },
                { label: "Humidity", value: "57%" },
              ].map((item) => (
                <div key={item.label} className="bg-secondary p-2 sm:p-3 rounded-md text-center">
                  <div className="text-sm sm:text-base font-medium">{item.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Real-Time Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl sm:text-6xl font-bold text-green-500">32</span>
              <div>
                <div className="font-semibold">Good</div>
                <div className="text-sm text-muted-foreground">Great air here today</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: "IAQ", value: "32", unit: "" },
                { label: "Humidity", value: "0.0", unit: "%" },
                { label: "Temperature", value: "72", unit: "°F" },
                { label: "Pressure", value: "0.0", unit: "hPa" },
                { label: "CO2", value: "0", unit: "ppm" },
              ].map((item) => (
                <div key={item.label} className="bg-secondary p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-base sm:text-lg font-semibold">
                    {item.value}
                    {item.unit}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm sm:text-base text-muted-foreground">
              Please wear a mask. Find an indoor place to stay away from bad air quality, use a humidifier.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Air Quality Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-40 sm:h-64 rounded-md flex items-center justify-center text-muted-foreground">
              Map Placeholder
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
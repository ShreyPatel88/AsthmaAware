import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Wind, Activity, BookOpen, Megaphone, Calendar } from 'lucide-react';

const resources = [
  {
    id: 'education',
    title: 'Education',
    icon: BookOpen,
    content: [
      { title: 'Lung Health Basics', link: 'https://www.lung.org/lung-health-diseases/lung-health-basics' },
      { title: 'Lung Disease Lookup', link: 'https://www.lung.org/lung-health-diseases' },
      { title: 'Asthma Management', link: 'https://www.lung.org/lung-health-diseases/lung-disease-lookup/asthma' },
      { title: 'Air Quality', link: 'https://www.lung.org/clean-air' },
    ]
  },
  {
    id: 'advocacy',
    title: 'Advocacy',
    icon: Megaphone,
    content: [
      { title: 'Current Initiatives', link: 'https://www.lung.org/policy-advocacy/current-initiatives' },
      { title: 'Take Action', link: 'https://www.lung.org/policy-advocacy/take-action' },
      { title: 'Healthy Air Campaign', link: 'https://www.lung.org/policy-advocacy/healthy-air-campaign' },
    ]
  },
  {
    id: 'events',
    title: 'Events',
    icon: Calendar,
    content: [
      { title: 'LUNG FORCE Walk', date: '2023-09-15', location: 'Various Locations', link: 'https://www.lung.org/get-involved/events/lung-force-walk' },
      { title: 'Asthma Education Day', date: '2023-10-01', location: 'Online Webinar', link: 'https://www.lung.org/get-involved/events' },
      { title: 'Clean Air Challenge', date: '2023-11-05', location: 'Nationwide', link: 'https://www.lung.org/get-involved/events' },
    ]
  },
];

const originalResources = [
  {
    id: 1,
    type: 'article',
    title: 'Understanding Asthma Triggers',
    description: 'Learn about common asthma triggers and how to avoid them.',
    icon: Stethoscope,
    content: 'Asthma triggers are substances or conditions that can cause asthma symptoms to worsen. Common triggers include allergens like pollen, dust mites, and pet dander; irritants such as smoke and strong odors; respiratory infections; physical activity; and weather changes. Identifying and avoiding your personal triggers is key to managing asthma effectively.'
  },
  {
    id: 2,
    type: 'article',
    title: 'Interpreting Air Quality Metrics',
    description: 'Understanding PM2.5, AQI, and other air quality measurements.',
    icon: Wind,
    content: 'Air quality metrics help us understand the level of pollution in the air we breathe. The Air Quality Index (AQI) is a scale from 0 to 500, where lower numbers indicate better air quality. PM2.5 refers to fine particulate matter that can penetrate deep into the lungs. Understanding these metrics can help you make informed decisions about outdoor activities, especially if you have asthma.'
  },
  {
    id: 3,
    type: 'article',
    title: 'Exercise and Asthma',
    description: 'Tips for staying active while managing your asthma.',
    icon: Activity,
    content: 'Regular exercise is important for overall health, including for people with asthma. With proper management, most people with asthma can participate in their chosen physical activities. Key tips include using your inhaler before exercise, warming up properly, being aware of your environment, and gradually increasing your activity level. Always consult with your healthcare provider before starting a new exercise regimen.'
  },
];

export default function Resources() {
  const [selectedResource, setSelectedResource] = React.useState(null);

  const handleReadMore = (resource) => {
    setSelectedResource(resource);
  };

  return (
    <div className="p-4 space-y-8 pb-24">
      <h1 className="text-3xl font-bold mb-6">Lung Health Resources</h1>

      {resources.map((section) => (
        <Card key={section.id} className="mb-8">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <section.icon className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {section.content.map((item, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  {section.id === 'events' ? (
                    <span className="text-sm text-muted-foreground">
                      {item.date} - {item.location}
                    </span>
                  ) : null}
                  <Button variant="outline" size="sm" asChild>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">Learn More</a>
                  </Button>
                </li>
              ))}
            </ul>
            {section.id === 'advocacy' && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Get Involved</h3>
                <p className="mb-4">Your voice matters in the fight for healthy lungs. Join us in advocating for cleaner air and better lung health policies.</p>
                <Button asChild>
                  <a href="https://www.lung.org/policy-advocacy/take-action" target="_blank" rel="noopener noreferrer">Take Action Now</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <h2 className="text-2xl font-bold mt-8 mb-4">Additional Resources</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {originalResources.map((resource) => (
          <Card key={resource.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <resource.icon className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">{resource.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription className="mb-4">{resource.description}</CardDescription>
              <Button onClick={() => handleReadMore(resource)} className="mt-auto">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedResource && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedResource.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{selectedResource.content}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
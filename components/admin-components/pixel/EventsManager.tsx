'use client'

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Analytics } from './Analytics';
import { Separator } from '@/components/ui/separator';
import { InDevelopment } from '@/components/shared/InDevelopment';
import { toast } from '@/components/ui/use-toast';
import { updatePixelEvents } from '@/lib/actions/pixel.actions';

export default function EventManagement({ _id, initialEvents }: { _id: string, initialEvents: Record<string, boolean> }) {
  const [events, setEvents] = useState(initialEvents);
  const [hasChanged, setHasChanged] = useState(false);

  const toggleEvent = (eventName: string) => {
    setEvents((prevEvents) => {
      const updatedEvents = {
        ...prevEvents,
        [eventName]: !prevEvents[eventName],
      };

      if (JSON.stringify(updatedEvents) !== JSON.stringify(initialEvents)) {
        setHasChanged(true);
      } else {
        setHasChanged(false);
      }

      return updatedEvents;
    });
  }

  const saveChanges = async () => {
    try {
      const response = await updatePixelEvents({ _id: _id, events: events })
      
      if (response && response.success) {
        toast({
          title: "Events Updated",
          description: "Pixel events were updated successfully.",
          duration: 3000,
          variant: "success",
        })

        console.log("Success")
      } else {
        throw new Error("Failed to update events")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pixel events. Please try again.",
        variant: "error",
        duration: 3000,
      })
    }
    
    console.log('Saving changes:', events)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Event Tracking</h3>
        <p className="text-sm text-gray-600 mb-4">Select the events you would like to track for this pixel. Enabling an event allows you to gather data when that specific action occurs on your website.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(events).map(([event, isEnabled]) => (
            <div
              key={event}
              className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200"
            >
              <span className="text-small-medium font-medium text-gray-800 capitalize">{event.replace(/([A-Z])/g, ' $1').trim()}</span>
              <Switch
                checked={isEnabled}
                disabled={event == "pageView"}
                onCheckedChange={() => toggleEvent(event)}
                className="data-[state=checked]:bg-stone-800 data-[state=unchecked]:bg-gray-300 h-5"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" className="text-small-medium px-3 py-1 h-8">Cancel</Button>
          <Button 
           onClick={saveChanges} 
           className="text-small-medium px-3 py-1 h-8 bg-black hover:bg-blue-700 text-white"
           disabled={!hasChanged}
          > 
            Save Changes
          </Button>
        </div>
      </div>
      <InDevelopment >
        <h3 className="text-lg font-semibold">Pixel Analytics</h3>
        <Analytics />
      </InDevelopment >
    </div>
  )
}
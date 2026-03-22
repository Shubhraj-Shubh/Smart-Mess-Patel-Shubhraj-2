"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateGCEvent,
  CreateGCItem,
  AddRefreshmentEntry,
} from "@/actions/gcActions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface GCItem {
  _id: string;
  name: string;
  isCustom: boolean;
}

interface AddRefreshmentFormProps {
  events: GCItem[];
  items: GCItem[];
}

export default function AddRefreshmentForm({
  events,
  items,
}: AddRefreshmentFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [customEvent, setCustomEvent] = useState("");
  const [customItem, setCustomItem] = useState("");
  const [showCustomEvent, setShowCustomEvent] = useState(false);
  const [showCustomItem, setShowCustomItem] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWithinTimeWindow, setIsWithinTimeWindow] = useState(true);
  const [timeMessage, setTimeMessage] = useState("");

  // Check time window on mount and every minute
  useEffect(() => {
    const checkTimeWindow = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinutes;
      const startTime = 16 * 60; // 4:00 PM
      const endTime = 20 * 60; // 8:00 PM

      const withinWindow = currentTime >= startTime && currentTime < endTime;
      setIsWithinTimeWindow(withinWindow);

      if (currentTime < startTime) {
        const minutesUntil = startTime - currentTime;
        const hoursUntil = Math.floor(minutesUntil / 60);
        const minsUntil = minutesUntil % 60;
        setTimeMessage(
          `Entry submission opens at 4:00 PM (in ${hoursUntil}h ${minsUntil}m)`
        );
      } else if (!withinWindow) {
        setTimeMessage(
          "Entry submission is closed for today. Entries can be added between 4:00 PM - 8:00 PM"
        );
      } else {
        const minutesLeft = endTime - currentTime;
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        setTimeMessage(
          `Submission closes in ${hoursLeft}h ${minsLeft}m (at 8:00 PM)`
        );
      }
    };

    checkTimeWindow();
    const interval = setInterval(checkTimeWindow, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    setShowCustomEvent(value === "custom");
    if (value !== "custom") {
      setCustomEvent("");
    }
  };

  const handleItemChange = (value: string) => {
    setSelectedItem(value);
    setShowCustomItem(value === "custom");
    if (value !== "custom") {
      setCustomItem("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check time window first
    if (!isWithinTimeWindow) {
      toast({
        title: "⏰ Outside Submission Window",
        description: "Refreshment entries can only be added between 4:00 PM and 8:00 PM",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate event selection
      if (!selectedEvent || selectedEvent === "") {
        toast({
          title: "⚠️ Missing Information",
          description: "Please select an event before submitting",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate custom event input
      if (showCustomEvent && !customEvent.trim()) {
        toast({
          title: "⚠️ Missing Information",
          description: "Please enter the custom event name",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate item selection
      if (!selectedItem || selectedItem === "") {
        toast({
          title: "⚠️ Missing Information",
          description: "Please select an item before submitting",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate custom item input
      if (showCustomItem && !customItem.trim()) {
        toast({
          title: "⚠️ Missing Information",
          description: "Please enter the custom item name",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate quantity
      if (!quantity || quantity.trim() === "") {
        toast({
          title: "⚠️ Missing Information",
          description: "Please enter the quantity",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const quantityNum = parseInt(quantity);
      if (quantityNum <= 0 || isNaN(quantityNum)) {
        toast({
          title: "⚠️ Invalid Quantity",
          description: "Please enter a valid quantity greater than 0",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      let eventId = selectedEvent;
      let itemId = selectedItem;

      // Handle custom event creation
      if (showCustomEvent) {
        const result = await CreateGCEvent(customEvent.trim());
        if (!result.success) {
          throw new Error(result.error || "Failed to create custom event");
        }
        eventId = result.event!._id;
      }

      // Handle custom item creation
      if (showCustomItem) {
        const result = await CreateGCItem(customItem.trim());
        if (!result.success) {
          throw new Error(result.error || "Failed to create custom item");
        }
        itemId = result.item!._id;
      }

      // Add refreshment entry
      const result = await AddRefreshmentEntry({
        eventId,
        itemId,
        quantity: quantityNum,
      });

      if (!result.success) {
        // Handle time window error specifically
        if (result.error?.includes("4:00 PM") || result.error?.includes("8:00 PM")) {
          toast({
            title: "⏰ Time Restriction",
            description: result.error,
            variant: "destructive",
            duration: 6000,
          });
          // Recheck time window
          setIsWithinTimeWindow(false);
        } else {
          throw new Error(result.error || "Failed to add entry");
        }
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "✅ Success!",
        description: "Refreshment entry added successfully and sent for verification",
        className: "bg-green-50 border-green-200",
        duration: 4000,
      });

      // Reset form
      setSelectedEvent("");
      setSelectedItem("");
      setQuantity("");
      setCustomEvent("");
      setCustomItem("");
      setShowCustomEvent(false);
      setShowCustomItem(false);

      // Refresh the page after a short delay
      setTimeout(() => {
        router.refresh();
      }, 1000);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to add refreshment entry. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-8 border rounded-lg shadow-sm bg-card">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Add Refreshment Entry</h2>
          <p className="text-sm text-muted-foreground">
            Fill in the details to record refreshment consumption
          </p>
        </div>

        {/* Time Window Alert */}
        {!isWithinTimeWindow ? (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-red-600 text-lg">🚫</span>
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Submission Currently Closed
                </p>
                <p className="text-xs text-red-700 mt-1">{timeMessage}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✅</span>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Submission Window Open
                </p>
                <p className="text-xs text-green-700 mt-1">{timeMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Event <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedEvent}
            onValueChange={handleEventChange}
            disabled={!isWithinTimeWindow}
          >
            <SelectTrigger className={!selectedEvent ? "border-red-300" : ""}>
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event._id} value={event._id}>
                  {event.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Other/Custom</SelectItem>
            </SelectContent>
          </Select>
          {showCustomEvent && (
            <Input
              placeholder="Enter custom event name"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className={showCustomEvent && !customEvent ? "border-red-300" : ""}
              disabled={!isWithinTimeWindow}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Item <span className="text-red-500">*</span>
          </label>
          <Select
            value={selectedItem}
            onValueChange={handleItemChange}
            disabled={!isWithinTimeWindow}
          >
            <SelectTrigger className={!selectedItem ? "border-red-300" : ""}>
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Other/Custom</SelectItem>
            </SelectContent>
          </Select>
          {showCustomItem && (
            <Input
              placeholder="Enter custom item name"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              className={showCustomItem && !customItem ? "border-red-300" : ""}
              disabled={!isWithinTimeWindow}
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Quantity <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min="1"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={!quantity ? "border-red-300" : ""}
            disabled={!isWithinTimeWindow}
            required
          />
          <p className="text-xs text-muted-foreground">
            Enter the number of items consumed
          </p>
        </div>

        <div className="space-y-3">
          <Button
            type="submit"
            disabled={isSubmitting || !isWithinTimeWindow}
            className="w-full h-11"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">⏳</span>
                Adding Entry...
              </>
            ) : !isWithinTimeWindow ? (
              <>
                <span className="mr-2">🔒</span>
                Submission Closed
              </>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Add Entry
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            All fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </form>
    </div>
  );
}

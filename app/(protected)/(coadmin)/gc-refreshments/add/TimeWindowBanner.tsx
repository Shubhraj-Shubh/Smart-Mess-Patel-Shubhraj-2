"use client";

import { useState, useEffect } from "react";

export default function TimeWindowBanner() {
  const [currentTime, setCurrentTime] = useState("");
  const [timeMessage, setTimeMessage] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTime = currentHour * 60 + currentMinutes;
      const startTime = 16 * 60; // 4:00 PM
      const endTime = 20 * 60; // 8:00 PM

      // Format current time
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);

      // Calculate time message
      if (currentTime < startTime) {
        const minutesUntil = startTime - currentTime;
        const hoursUntil = Math.floor(minutesUntil / 60);
        const minsUntil = minutesUntil % 60;
        setTimeMessage(
          `Submission opens at 4:00 PM (in ${hoursUntil}h ${minsUntil}m)`
        );
      } else if (currentTime >= startTime && currentTime < endTime) {
        const minutesLeft = endTime - currentTime;
        const hoursLeft = Math.floor(minutesLeft / 60);
        const minsLeft = minutesLeft % 60;
        setTimeMessage(
          `Entries accepted: 4:00 PM - 8:00 PM (${hoursLeft}h ${minsLeft}m remaining)`
        );
      } else {
        setTimeMessage("Entry submission is closed. Opens tomorrow at 4:00 PM");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-amber-800 font-medium">
          ⏰ Current Time: {currentTime || "Loading..."}
        </p>
        <p className="text-xs text-amber-700">
          {timeMessage || "Loading..."}
        </p>
      </div>
    </div>
  );
}

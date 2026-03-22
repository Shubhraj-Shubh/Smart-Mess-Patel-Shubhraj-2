"use client";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function CopyButton({ eventId }: { eventId: string }) {
  const handleCopy = () => {
    const eventLink = `${window.location.origin}/scan-event/${eventId}`;
    navigator.clipboard.writeText(eventLink);
    toast.success("Link copied to clipboard");
  };

  return (
    <button
      onClick={() => handleCopy()}
      className="absolute top-4 right-4 p-2 rounded-full transition"
    >
      <Copy />
    </button>
  );
}

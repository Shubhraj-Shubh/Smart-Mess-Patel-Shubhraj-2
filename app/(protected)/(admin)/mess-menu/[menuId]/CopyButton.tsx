"use client";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function CopyButton({ pollId }: { pollId: string }) {
  const handleCopy = () => {
    const eventLink = `${window.location.origin}/menu-feedback/${pollId}`;
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

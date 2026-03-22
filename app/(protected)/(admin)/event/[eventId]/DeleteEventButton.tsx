"use client";

import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/actions/EventActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
}

export default function DeleteEventButton({
  eventId,
  eventName,
}: DeleteEventButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${eventName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteEvent(eventId);

      if (result.success) {
        toast.success(result.message);
        router.push("/event");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete Event"}
    </Button>
  );
}

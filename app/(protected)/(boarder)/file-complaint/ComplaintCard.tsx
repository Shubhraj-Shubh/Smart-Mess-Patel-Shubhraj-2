"use client";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

type ComplaintType = {
  _id: string;
  description: string;
  status: "Pending" | "Resolved";
  adminMessage?: string;
};

interface ComplaintCardProps {
  complaint: ComplaintType;
  onViewDetails?: (complaint: ComplaintType) => void;
}

export default function ComplaintCard({
  complaint,
}: ComplaintCardProps) {
  return (
    <div className="space-y-2 my-2 border p-4 rounded-lg">
      <div className="flex gap-2 justify-between  ">
        <p className="text-sm">{complaint.description}</p>
        {complaint.status === "Pending" ? (
          <Badge variant="destructive">{complaint.status} </Badge>
        ) : (
          <Badge className="bg-green-300">{complaint.status} </Badge>
        )}
      </div>
      {complaint.adminMessage && (
        <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
          <MessageCircle className="h-4 w-4 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-medium">Response</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {complaint.adminMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

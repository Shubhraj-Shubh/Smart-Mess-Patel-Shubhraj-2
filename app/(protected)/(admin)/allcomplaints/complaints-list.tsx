"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ComplaintDetailDialog } from "./complaint-detail-dialog";

type ComplaintStatus = "Pending" | "Resolved";

type Complaint = {
  _id: string;
  userId: string;
  userName: string;
  rollno: string;
  description: string;
  status: ComplaintStatus;
  adminMessage: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ComplaintsListProps {
  complaints: Complaint[];
}

export function ComplaintsList({ complaints }: ComplaintsListProps) {
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleComplaintClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="max-w-screen-xl w-full m-auto border-b">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className="flex border-t p-2 items-center justify-around"
            onClick={() => handleComplaintClick(complaint)}
          >
            <div className="font-medium">
              {format(new Date(complaint.createdAt), "PP")}
            </div>
            <div>{complaint.userName}</div>
            <div>{complaint.rollno}</div>
            <div>
              <Badge
                variant={
                  complaint.status === "Pending" ? "destructive" : "default"
                }
              >
                {complaint.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {selectedComplaint && (
        <ComplaintDetailDialog
          complaint={selectedComplaint}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}

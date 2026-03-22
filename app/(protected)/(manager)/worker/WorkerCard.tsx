"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { RemoveWorker } from "@/actions/adminActions";
import { toast } from "sonner";

type WorkerType = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
};

export default function WorkerCard({ worker }: { worker: WorkerType }) {
  async function DeleteFromWorkers(id: string) {
    try {
      const res = await RemoveWorker(id);

      if (res.success) {
        toast.success("Worker Removed");
      } else {
        toast.error("Failed to remove worker");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove worker");
    }
  }

  return (
    <div className="flex items-center justify-between border-t p-4 w-full">
      <div className="w-full">
        <div className="text-sm font-medium">{worker.name}</div>
        <div className="text-xs text-gray-500">{worker.email}</div>
      </div>
      <div className="w-full text-center text-sm">{worker.phoneNo}</div>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => DeleteFromWorkers(worker._id)}
            >
              Remove Worker
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

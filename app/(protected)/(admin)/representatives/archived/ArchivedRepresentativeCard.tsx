"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import {
  DeleteRepresentative,
  UnarchiveRepresentative,
} from "@/actions/adminActions";
import { toast } from "sonner";
import Image from "next/image";

type RepresentativeType = {
  _id: string;
  name: string;
  rollno: string;
  role: string;
  department?: string;
  phoneNo?: string;
  session: number; // changed to number
  photoUrl?: string;
  isArchived: boolean;
};

export default function ArchivedRepresentativeCard({
  representative,
}: {
  representative: RepresentativeType;
}) {
  async function handleDelete() {
    try {
      const res = await DeleteRepresentative(representative._id);

      if (res.success) {
        toast.success("Representative deleted");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete representative");
    }
  }

  async function handleUnarchive() {
    try {
      const res = await UnarchiveRepresentative(representative._id);

      if (res.success) {
        toast.success("Representative unarchived");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unarchive representative");
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md opacity-75">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {representative.photoUrl && (
            <div className="mb-4 flex justify-center">
              <Image
                src={representative.photoUrl}
                alt={representative.name}
                width={120}
                height={120}
                className="rounded-full object-cover grayscale"
              />
            </div>
          )}
          <h3 className="font-bold text-lg text-center">{representative.name}</h3>
          <p className="text-sm text-muted-foreground text-center">{representative.role}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUnarchive}>
              Unarchive
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Roll No:</span>
          <span className="font-medium">{representative.rollno}</span>
        </div>
        {representative.department && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span className="font-medium">{representative.department}</span>
          </div>
        )}
        {representative.phoneNo && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{representative.phoneNo}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Session:</span>
          <span className="font-medium">{representative.session}-{representative.session + 1}</span>
        </div>
      </div>
    </div>
  );
}

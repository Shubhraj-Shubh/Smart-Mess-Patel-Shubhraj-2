"use client";

import { useRouter } from "next/navigation";
import { clearSingleFine, deleteFine } from "@/actions/fineActions";
import EditFineButton from "./edit-fine-button";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type FineType = {
  _id: string;
  adminName: string;
  reason: string;
  fineAmount: number;
  paid: boolean;
  season: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function FineCard({
  fine,
  onFineCleared,
  onFineUpdated,
  onFineDeleted,
  adminRole,
}: {
  fine: FineType;
  onFineCleared: (fineId: string) => void;
  onFineUpdated: (fineId: string, data: Partial<FineType>) => void;
  onFineDeleted: (fineId: string) => void;
  adminRole: "admin" | "coadmin" | "manager";
}) {
  const router = useRouter();

  const handleClear = async () => {
    const res = await clearSingleFine(fine._id);
    if (res === "success") {
      toast.success("Fine marked as paid");
      onFineCleared(fine._id);
      router.refresh();
    } else {
      toast.error("Failed to clear fine");
    }
  };

  const handleDelete = async () => {
    const res = await deleteFine(fine._id);
    if (res.success) {
      toast.success("Fine deleted");
      onFineDeleted(fine._id);
      router.refresh();
    } else {
      toast.error("Failed to delete fine");
    }
  };

  return (
    <div className="flex border-t p-2 items-center justify-around">
      <div className="w-full text-center">{fine.fineAmount}</div>
      <div className="w-full text-center">{fine.reason}</div>
      <div className="w-full text-center">{fine.adminName}</div>
      <div className="w-full text-center">
        {fine.createdAt.getHours() + ":" + fine.createdAt.getMinutes()}
      </div>
      {adminRole === "admin" && (
        <div className="w-full text-center flex items-center justify-center gap-2">
          <EditFineButton
            fine={{ _id: fine._id, reason: fine.reason, fineAmount: fine.fineAmount }}
            onUpdate={(data) => onFineUpdated(fine._id, data)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this fine?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove the fine and refund the amount.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                Mark Paid
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Mark fine as paid?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the fine as paid.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>
                  Mark Paid
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

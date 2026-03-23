"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  deleteUtensilFine,
  markUtensilFinePaid,
} from "@/actions/UtensilFineAction";

type UtensilFineType = {
  _id: string;
  issuedByWorkerName: string;
  returnedToWorkerName: string;
  fineAmount: number;
  fineApplied: boolean;
  paid: boolean;
  issuedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
};

export default function UtensilFineCard({
  row,
  onDelete,
  onMarkPaid,
  adminRole,
}: {
  row: UtensilFineType;
  onDelete: (id: string) => void;
  onMarkPaid: (id: string) => void;
  adminRole: "admin" | "coadmin" | "manager";
}) {
  const router = useRouter();

  const issuedLabel = new Date(row.issuedAt).toLocaleString("en-IN");
  const dueLabel = new Date(row.dueAt).toLocaleString("en-IN");
  const returnedLabel = row.returnedAt
    ? new Date(row.returnedAt).toLocaleString("en-IN")
    : "Not returned";

  const handleMarkPaid = async () => {
    const res = await markUtensilFinePaid(row._id);
    if (res === "success") {
      toast.success("Utensil fine marked as paid");
      onMarkPaid(row._id);
      router.refresh();
      return;
    }

    toast.error("Failed to mark utensil fine paid");
  };

  const handleDelete = async () => {
    const res = await deleteUtensilFine(row._id);
    if (res.success) {
      toast.success("Utensil entry deleted");
      onDelete(row._id);
      router.refresh();
      return;
    }

    toast.error("Failed to delete utensil entry");
  };

  return (
    <div className="flex border-t p-2 items-center justify-around">
      <div className="w-full text-center">{row.issuedByWorkerName}</div>
      <div className="w-full text-center">{row.returnedToWorkerName || "-"}</div>
      <div className="w-full text-center">{issuedLabel}</div>
      <div className="w-full text-center">{returnedLabel}</div>
      <div className="w-full text-center">{dueLabel}</div>
      <div className="w-full text-center">
        {row.fineApplied ? `Fine Added: Rs ${row.fineAmount}` : "No Fine"}
      </div>
      {adminRole === "admin" && (
        <div className="w-full text-center flex items-center justify-center gap-2">
          {row.fineApplied && !row.paid && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Mark Paid
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark utensil fine as paid?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark this utensil fine entry as paid.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleMarkPaid}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete utensil entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes this utensil transaction record.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

type Row = {
  _id: string;
  userId: string;
  userName: string;
  issuedByWorkerName: string;
  returnedToWorkerName: string;
  fineAmount: number;
  fineApplied: boolean;
  paid: boolean;
  issuedAt: Date;
  returnedAt: Date | null;
  dueAt: Date;
};

export default function UtensilAdminTable({
  initialRows,
  canManage,
}: {
  initialRows: Row[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initialRows);

  const handleMarkPaid = async (id: string) => {
    const res = await markUtensilFinePaid(id);
    if (res === "success") {
      toast.success("Utensil fine marked as paid");
      setRows((prev) =>
        prev.map((row) =>
          row._id === id
            ? {
                ...row,
                paid: true,
              }
            : row
        )
      );
      router.refresh();
      return;
    }

    toast.error("Failed to mark paid");
  };

  const handleDelete = async (id: string) => {
    const res = await deleteUtensilFine(id);
    if (res.success) {
      toast.success("Utensil entry deleted");
      setRows((prev) => prev.filter((row) => row._id !== id));
      router.refresh();
      return;
    }

    toast.error("Failed to delete entry");
  };

  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No utensil records found.
      </div>
    );
  }

  return (
    <>
      {rows.map((row) => (
        <div key={row._id} className="flex border-t p-2 items-center justify-around">
          <div className="w-full text-center">{row.userName || "Unknown Boarder"}</div>
          <div className="w-full text-center">{row.issuedByWorkerName}</div>
          <div className="w-full text-center">{row.returnedToWorkerName || "-"}</div>
          <div className="w-full text-center">{new Date(row.issuedAt).toLocaleString("en-IN")}</div>
          <div className="w-full text-center">
            {row.returnedAt ? new Date(row.returnedAt).toLocaleString("en-IN") : "Not returned"}
          </div>
          <div className="w-full text-center">{new Date(row.dueAt).toLocaleString("en-IN")}</div>
          <div className="w-full text-center">
            {row.fineApplied ? `Fine Added: Rs ${row.fineAmount} ${row.paid ? "(Paid)" : "(Unpaid)"}` : "No Fine"}
          </div>
          {canManage && (
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
                      <AlertDialogTitle>Mark as paid?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark this utensil fine entry as paid.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleMarkPaid(row._id)}>
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
                    <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove this utensil transaction.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(row._id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      ))}
    </>
  );
}

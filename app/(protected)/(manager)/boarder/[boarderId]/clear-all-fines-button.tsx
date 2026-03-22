"use client";

import { clearAllFinesForBoarder } from "@/actions/fineActions";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ClearAllFinesButton({ boarderId }: { boarderId: string }) {
  const router = useRouter();

  const handlePaidClick = async () => {
    const res = await clearAllFinesForBoarder(boarderId);
    if (res === "success") {
      toast.success("All fines cleared");
      router.refresh();
    } else {
      toast.error("Failed to clear fines");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-red-600 hover:bg-red-700" asChild>
        <Button>Clear Fines</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all fines?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently clear all
            fines and marked them as{" "}
            <span className="bg-green-400 mx-2 px-4 py-2 rounded-full font-medium">
              Paid
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handlePaidClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

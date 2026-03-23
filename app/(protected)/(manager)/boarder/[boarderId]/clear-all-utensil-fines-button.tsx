"use client";

import { clearAllUtensilFinesForBoarder } from "@/actions/UtensilFineAction";
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

export default function ClearAllUtensilFinesButton({
  boarderId,
}: {
  boarderId: string;
}) {
  const router = useRouter();

  const handlePaidClick = async () => {
    const res = await clearAllUtensilFinesForBoarder(boarderId);
    if (res === "success") {
      toast.success("All utensil fines cleared");
      router.refresh();
    } else {
      toast.error("Failed to clear utensil fines");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-amber-600 hover:bg-amber-700" asChild>
        <Button>Clear Utensil Fines</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear all utensil fines for this boarder?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark all unpaid, applied utensil fines as
            <span className="bg-green-400 mx-2 px-4 py-2 rounded-full font-medium">
              Paid
            </span>
            for this boarder.
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

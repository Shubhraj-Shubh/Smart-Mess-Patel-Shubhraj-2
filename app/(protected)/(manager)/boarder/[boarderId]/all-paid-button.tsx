"use client";
import { clearCosts } from "@/actions/dashboardActions";
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

export default function AllPaidButton({ boarderId }: { boarderId: string }) {
  const router = useRouter();

  const handlePaidClick = async () => {
    const res = await clearCosts(boarderId);
    if (res === "success") {
      toast.success("Costs cleared");
      router.refresh();
    } else {
      toast.error("Failed to clear costs");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-yellow-500 hover:bg-yellow-600" asChild>
        <Button>Clear</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently clear the
            amounts and marked them as{" "}
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

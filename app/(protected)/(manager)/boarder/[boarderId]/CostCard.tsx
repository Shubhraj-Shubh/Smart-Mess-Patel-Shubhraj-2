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
import { clearSingleCost } from "@/actions/dashboardActions";
import EditCostButton from "./edit-cost-button";

// const boarderSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   rollno: z.string().min(1, {
//     message: "Roll number is required.",
//   }),
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   cardNo: z.string().min(1, {
//     message: "Card number is required.",
//   }),
//   phoneNo: z.string().min(1, {
//     message: "Phone number is required.",
//   }),
//   session: z.string().min(1, {
//     message: "Session is required",
//   }),
// });

type CostType = {
  _id: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  paid: boolean;
  category: string;
  createdAt: Date;
};

export default function CostCard({
  cost,
  onCostCleared,
  onCostUpdated,
  adminRole,
}: {
  cost: CostType;
  onCostCleared: (costId: string) => void;
  onCostUpdated: (costId: string, data: Partial<CostType>) => void;
  adminRole: "admin" | "coadmin" | "manager";
}) {
  const router = useRouter();

  const handleClear = async () => {
    const res = await clearSingleCost(cost._id);
    if (res === "success") {
      toast.success("Marked as paid");
      onCostCleared(cost._id);
      router.refresh();
    } else {
      toast.error("Failed to clear cost");
    }
  };

  return (
    <div className="flex border-t p-2 items-center justify-around">
      <div className="w-full text-center">{cost.amount}</div>
      <div className="w-full text-center">{cost.workerName}</div>
      <div className="w-full text-center">
        {cost.createdAt.getHours() + ":" + cost.createdAt.getMinutes()}
      </div>
      <div className="w-full text-center">{cost.category}</div>
      {adminRole === "admin" && (
        <div className="w-full text-center flex items-center justify-center gap-2">
          <EditCostButton
            cost={cost}
            onUpdate={(data) => onCostUpdated(cost._id, data)}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive">
                Clear
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear this cost?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark only this entry as paid and reduce outstanding
                  amount.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClear}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}

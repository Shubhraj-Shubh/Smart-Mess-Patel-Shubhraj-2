"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateCost } from "@/actions/dashboardActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const editCostSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
});

export type CostForEdit = {
  _id: string;
  amount: number;
  category: string;
  workerName: string;
};

export default function EditCostButton({
  cost,
  onUpdate,
}: {
  cost: CostForEdit;
  onUpdate: (data: Partial<CostForEdit>) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editCostSchema>>({
    resolver: zodResolver(editCostSchema),
    defaultValues: {
      amount: cost.amount,
      category: cost.category,
    },
  });

  const onSubmit = async (values: z.infer<typeof editCostSchema>) => {
    const res = await updateCost(cost._id, {
      ...values,
      workerName: cost.workerName,
    });
    if (res.success) {
      toast.success("Cost updated");
      setOpen(false);
      onUpdate({
        ...values,
        workerName: cost.workerName,
      });
      router.refresh();
    } else {
      toast.error("Failed to update cost");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Cost</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="submit" size="sm">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

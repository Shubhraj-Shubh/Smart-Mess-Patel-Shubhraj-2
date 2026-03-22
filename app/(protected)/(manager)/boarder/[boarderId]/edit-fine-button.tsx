"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateFine } from "@/actions/fineActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const editFineSchema = z.object({
  reason: z.string().min(2, "Reason is required"),
  fineAmount: z.coerce.number().positive("Fine amount must be positive"),
});

export type FineForEdit = {
  _id: string;
  reason: string;
  fineAmount: number;
};

export default function EditFineButton({
  fine,
  onUpdate,
}: {
  fine: FineForEdit;
  onUpdate: (data: Partial<FineForEdit>) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof editFineSchema>>({
    resolver: zodResolver(editFineSchema),
    defaultValues: {
      reason: fine.reason,
      fineAmount: fine.fineAmount,
    },
  });

  const onSubmit = async (values: z.infer<typeof editFineSchema>) => {
    const res = await updateFine(fine._id, values);
    if (res.success) {
      toast.success("Fine updated");
      setOpen(false);
      onUpdate(values);
      router.refresh();
    } else {
      toast.error("Failed to update fine");
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
          <DialogTitle>Edit Fine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Reason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fineAmount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Fine Amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

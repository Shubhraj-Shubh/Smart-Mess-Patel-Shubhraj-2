"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { addFine } from "@/actions/fineActions";
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

const fineSchema = z.object({
  reason: z.string().min(2, "Reason is required"),
  fineAmount: z.coerce.number().positive("Fine amount must be positive"),
});

export default function AddFineForm({ boarderId }: { boarderId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const getSeason = () => {
    const month = new Date().getMonth() + 1;
    return month >= 1 && month <= 6 ? "Spring (Jan-Jun)" : "Autumn (Jul-Dec)";
  };

  const form = useForm<z.infer<typeof fineSchema>>({
    resolver: zodResolver(fineSchema),
    defaultValues: {
      reason: "",
      fineAmount: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof fineSchema>) => {
    const res = await addFine({
      userId: boarderId,
      reason: values.reason,
      fineAmount: values.fineAmount,
      season: getSeason(),
    });

    if (res.success) {
      toast.success("Fine added successfully");
      setOpen(false);
      form.reset();
      router.refresh();
    } else {
      toast.error(res.message || "Failed to add fine");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">
          Add Fine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Fine</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Reason for fine" {...field} />
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
              <Button type="submit">Add Fine</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

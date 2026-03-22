"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createComplaint } from "@/actions/complaintActions";

const complaintFormSchema = z.object({
  userId: z.string().min(1, {
    message: "User ID is required.",
  }),
  userName: z.string().min(1, {
    message: "User name is required.",
  }),
  rollno: z.string().min(1, {
    message: "Roll No. is required.",
  }),
  description: z
    .string()
    .min(50, {
      message: "Description must be at least 50 characters.",
    })
    .max(1000, {
      message: "Description must not be longer than 1000 characters.",
    }),
});

type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

interface ComplaintDialogProps {
  userId: string;
  rollno: string;
  userName: string;
  trigger?: React.ReactNode;
}

export default function ComplaintForm({
  userId,
  rollno,
  userName,
  trigger,
}: ComplaintDialogProps) {
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: {
      userId,
      rollno,
      userName,
      description: "",
    },
  });

  async function onSubmit(data: ComplaintFormValues) {
    try {
      const res = await createComplaint(data);

      console.log(res);
      if (res.success) {
        toast.success("Complaint submitted");
        form.reset();
      } else {
        toast.error("There was a problem submitting your complaint.");
      }
    } catch {
      toast.error("There was a problem submitting your complaint.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || <Button className="hover:text-primary">Submit Complaint</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit a Complaint</DialogTitle>
          <DialogDescription>
            Please describe your complaint in detail below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your complaint in detail..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible about your complaint.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full hover:text-primary">
              Submit Complaint
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

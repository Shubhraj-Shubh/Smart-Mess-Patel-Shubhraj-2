"use client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { updateComplaint } from "@/actions/complaintActions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type ComplaintStatus = "Pending" | "Resolved";

type Complaint = {
  _id: string;
  userId: string;
  userName: string;
  rollno: string;
  description: string;
  status: ComplaintStatus;
  adminMessage: string;
  createdAt: Date;
  updatedAt: Date;
};

interface ComplaintDetailDialogProps {
  complaint: Complaint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const complaintSchema = z.object({
  _id: z.string().min(1, {
    message: "User ID is required.",
  }),
  status: z.string(),
  adminMessage: z
    .string()
    .min(6, {
      message: "Message must be at least 6 characters.",
    })
    .max(500, {
      message: "Message must not be longer than 500 characters.",
    }),
});

export function ComplaintDetailDialog({
  complaint,
  open,
  onOpenChange,
}: ComplaintDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      _id: complaint?._id || "",
      status: complaint?.status || "Pending",
      adminMessage: complaint?.adminMessage || "",
    },
  });

  if (!complaint) return null;

  async function onSubmit(values: z.infer<typeof complaintSchema>) {
    try {
      setIsSubmitting(true);
      await updateComplaint(values);
      toast.success("Complaint has been updated successfully.");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update complaint. Please try again.");
      console.log(error)
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Complaint Details</DialogTitle>
          <DialogDescription>
            Submitted on {format(new Date(complaint.createdAt), "PPP")}
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{complaint.userName}</CardTitle>
                <CardDescription>Roll No: {complaint.rollno}</CardDescription>
              </div>
              <Badge
                variant={
                  complaint.status === "Pending" ? "secondary" : "default"
                }
              >
                {complaint.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold">Description</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {complaint.description}
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adminMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Response</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your response..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
            <div className="text-xs text-muted-foreground">
              Last updated:{" "}
              {format(new Date(complaint.updatedAt), "PPP 'at' pp")}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

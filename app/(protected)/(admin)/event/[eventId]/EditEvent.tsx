"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ArrayInput } from "@/components/global/ArrayInput";
import { useState } from "react";
import { updateEvent, deleteEvent } from "@/actions/EventActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  eventName: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  emails: z.array(z.string()).min(1, "At least one email is required"),
});

type FormValues = z.infer<typeof formSchema>;

type EventDataType = {
  _id: string;
  eventName: string;
  description?: string;
  date: Date;
  emails: string[];
};

export default function EditEvent({ event }: { event: EventDataType }) {
  const [showForm, setShowForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: event.eventName,
      description: event.description,
      emails: event.emails,
      date: event.date,
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      const res = await updateEvent(event._id, data);

      if (res.success) {
        toast.success(res.message);
        form.reset();
        setShowForm(false);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      `Are you sure you want to delete "${event.eventName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteEvent(event._id);

      if (result.success) {
        toast.success(result.message);
        router.push("/event");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full items-center flex flex-col py-20 mb-4">
      <div className="flex gap-4 mb-4">
        <Button
          className="hover:text-primary"
          onClick={() => setShowForm(true)}
        >
          Update Event
        </Button>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete Event"}
        </Button>
      </div>

      {showForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4 space-y-2"
          >
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails</FormLabel>
                  <FormDescription>
                    Press &quot;enter&quot; key to add emails
                  </FormDescription>
                  <FormControl>
                    <ArrayInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter emails required"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-start space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="hover:text-primary">
                Update
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

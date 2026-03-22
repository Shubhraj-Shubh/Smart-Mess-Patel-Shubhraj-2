"use client";
import { CreateMenuPoll } from "@/actions/MenuPollActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const FormSchema = z.object({
  expiryDate: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default function CreatePoll({ menuId }: { menuId: string }) {
  const [create, setCreate] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const res = await CreateMenuPoll({ ...data, menuId });

      if (res.status === 500) {
        toast.error("Internal Server Error");
        return;
      } else {
        form.reset()
        toast.success("Poll Created");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <div className="max-w-screen-xl m-auto">
      {create ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
          >
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Poll Expirty Date</FormLabel>
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
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button onClick={() => setCreate(false)}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      ) : (
        <Button onClick={() => setCreate(true)}>Create Poll</Button>
      )}
    </div>
  );
}

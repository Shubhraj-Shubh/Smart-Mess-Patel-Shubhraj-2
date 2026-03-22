"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { createWorker } from "@/actions/workerActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const workerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNo: z.string().min(1, {
    message: "Phone number is required.",
  }),
  deletedAt: z.date().optional(),
});

export function UserInputForm() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNo: "",
    },
  });

  async function onSubmit(values: z.infer<typeof workerSchema>) {
    try {
      const res = await createWorker(values);

      if (res.status === 200) {
        toast.success("Worker added successfully");
        form.reset();
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <>
      <div className="my-4 flex items-center justify-center ">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover:text-primary">Add a Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Staff</DialogTitle>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                  <div className="">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`email`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="john.doe@kgpian.iitkgp.ac.in"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`phoneNo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full mt-4 hover:text-primary"
                    >
                      Add Staff
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

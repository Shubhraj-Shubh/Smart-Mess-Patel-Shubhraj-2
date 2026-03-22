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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { AddAdmin } from "@/actions/adminActions";

const workerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  rollno: z.string().min(1, {
    message: "Roll number is required.",
  }),
  role: z.enum(["admin", "coadmin", "manager"], {
    message: "Please select a valid role.",
  }),
});

type AdminFormProps = {
  adminId: string;
  adminRole: string;
};

export function UserInputForm({ adminId, adminRole }: AdminFormProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      email: "",
      rollno: "",
      role: "coadmin",
    },
  });

  async function onSubmit(values: z.infer<typeof workerSchema>) {
    try {
      const res = await AddAdmin(
        {
          name: values.name,
          email: values.email,
          rollno: values.rollno,
        },
        adminId,
        values.role as "admin" | "coadmin" | "manager"
      );

      if (res.success === true) {
        toast.success("Admin added successfully");
        form.reset({ role: "coadmin" });
        setOpen(false);
      } else {
        toast.error(res.message || "Failed to add admin");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  if (adminRole !== "admin") {
    return null;
  }

  return (
    <>
      <div className="my-4 flex items-center justify-center ">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="hover:text-primary">Add an admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Admin</DialogTitle>
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
                        name={`rollno`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Roll Number</FormLabel>
                            <FormControl>
                              <Input placeholder="22XY10011" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="coadmin">
                                  Co-Admin
                                </SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="mt-4">
                      Add Admin
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

"use client";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddRepresentative } from "@/actions/adminActions";

const representativeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rollno: z.string().min(1, { message: "Roll number is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  department: z.string().optional(),
  phoneNo: z.string().optional(),
  session: z.string().min(1, { message: "Session is required." }),
  photoUrl: z.string().optional(),
});

export function AddRepresentativeForm() {
  const form = useForm<z.infer<typeof representativeSchema>>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      name: "",
      rollno: "",
      role: "",
      department: "",
      phoneNo: "",
      session: "",
      photoUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof representativeSchema>) {
    try {
      const res = await AddRepresentative(values);

      if (res.success) {
        toast.success("Representative added successfully");
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add representative");
    }
  }

  return (
    <div className="my-4 flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:text-primary">Add Representative</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Representative</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rollno"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Roll Number" {...field} />
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
                    <FormControl>
                      <Input placeholder="Role" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <FormControl>
                      <Input placeholder="2024 or 2024-2025" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Photo URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add Representative
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

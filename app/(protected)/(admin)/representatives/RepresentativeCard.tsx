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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import {
  UpdateRepresentative,
  DeleteRepresentative,
  ArchiveRepresentative,
} from "@/actions/adminActions";
import { toast } from "sonner";
import Image from "next/image";

const representativeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  rollno: z.string().min(1, { message: "Roll number is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  department: z.string().optional(),
  phoneNo: z.string().optional(),
  session: z.string().min(1, { message: "Session is required." }),
  photoUrl: z.string().optional(),
});

type RepresentativeType = {
  _id: string;
  name: string;
  rollno: string;
  role: string;
  department?: string;
  phoneNo?: string;
  session: number;
  photoUrl?: string;
  isArchived: boolean;
};

export default function RepresentativeCard({
  representative,
}: {
  representative: RepresentativeType;
}) {
  const form = useForm<z.infer<typeof representativeSchema>>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      name: representative.name,
      rollno: representative.rollno,
      role: representative.role,
      department: representative.department || "",
      phoneNo: representative.phoneNo || "",
      session: representative.session.toString(),
      photoUrl: representative.photoUrl || "",
    },
  });

  async function onSubmit(values: z.infer<typeof representativeSchema>) {
    try {
      const res = await UpdateRepresentative(representative._id, values);

      if (res.success) {
        toast.success("Representative updated successfully");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update representative");
    }
  }

  async function handleDelete() {
    try {
      const res = await DeleteRepresentative(representative._id);

      if (res.success) {
        toast.success("Representative deleted");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete representative");
    }
  }

  async function handleArchive() {
    try {
      const res = await ArchiveRepresentative(representative._id);

      if (res.success) {
        toast.success("Representative archived");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive representative");
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {representative.photoUrl && (
            <div className="mb-4 flex justify-center">
              <Image
                src={representative.photoUrl}
                alt={representative.name}
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
          )}
          <h3 className="font-bold text-lg text-center">{representative.name}</h3>
          <p className="text-sm text-muted-foreground text-center">{representative.role}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  Edit
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Update Representative</DialogTitle>
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
                    <Button type="submit" className="w-full hover:text-primary">
                      Update Representative
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <DropdownMenuItem onClick={handleArchive}>Archive</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Roll No:</span>
          <span className="font-medium">{representative.rollno}</span>
        </div>
        {representative.department && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Department:</span>
            <span className="font-medium">{representative.department}</span>
          </div>
        )}
        {representative.phoneNo && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phone:</span>
            <span className="font-medium">{representative.phoneNo}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Session:</span>
          <span className="font-medium">{representative.session}-{representative.session + 1}</span>
        </div>
      </div>
    </div>
  );
}

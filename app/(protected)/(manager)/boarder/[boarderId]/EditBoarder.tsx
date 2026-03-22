"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Html5Qrcode } from "html5-qrcode";
import { EditBoarder } from "@/actions/adminActions";
import { Checkbox } from "@/components/ui/checkbox";

const boarderSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  rollno: z.string().min(1, {
    message: "Roll number is required.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email address.",
    }),
  cardNo: z.string().length(5, {
    message: "Card number must be exactly 5 characters.",
  }),
  phoneNo: z.string().regex(/^(91\d{10}|\d{10})$/, {
    message: "Phone number must be 10 digits or 12 digits starting with 91.",
  }),
  session: z
    .string()
    .regex(/^\d{4}$/, { message: "Session must be a 4-digit year." })
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        return year >= 2020 && year <= 2100;
      },
      {
        message: "Session must be between 2020 and 2100.",
      }
    ),
  secret: z.string().min(8, {
    message: "Secret must be at least 8 characters.",
  }),
  active: z.boolean(),
});

type BoarderType = {
  _id: string;
  name: string;
  phoneNo: string;
  rollno: string;
  cardNo: string;
  email: string;
  secret: string;
  session: number;
  amount?: number;
  active: boolean;
};

export default function EditBoarderComponent({
  boarder,
}: {
  boarder: BoarderType;
}) {
  const form = useForm<z.infer<typeof boarderSchema>>({
    resolver: zodResolver(boarderSchema),
    defaultValues: {
      name: boarder.name,
      email: boarder.email,
      phoneNo: boarder.phoneNo,
      rollno: boarder.rollno,
      cardNo: boarder.cardNo,
      session: String(boarder.session) || "2024",
      secret: boarder.secret,
      active: boarder.active,
    },
  });

  const scanQR = () => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // console.log(decodedText);
        form.setValue("secret", decodedText);
        html5QrCode.stop();
      },
      (error) => {
        console.warn(`Error scanning: ${error}`);
      }
    );
  };

  async function onSubmit(values: z.infer<typeof boarderSchema>) {
    try {
      console.log(values);
      const res = await EditBoarder(boarder._id, values);

      if (res.success) {
        toast.success("Boarder updated successfully");
      } else {
        toast.error("Failed to update boarder");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update boarder");
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hover:text-primary">Edit</Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg">
          <DialogHeader className="rounded-lg">
            <DialogTitle>Edit Boarder</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <div className="">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Boarder Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex w-full gap-4">
                      <FormField
                        control={form.control}
                        name={`rollno`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="22XY10011" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`session`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="2024" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`email`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="boarder.email@kgpian.iitkgp.ac.in"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`cardNo`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="22111" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`phoneNo`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <Input placeholder="1234567890" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name={`secret`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="QR Secret" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between p-3 rounded-md border bg-yellow-50 border-yellow-300">
                          <FormLabel className="text-sm font-medium text-yellow-900">
                            Active (boarder will be shown in the list)
                          </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5 accent-yellow-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {!form.watch("active") && (
                      <p className="text-sm text-red-600 mt-2">
                        ⚠️ Warning: Marking this boarder as inactive will remove
                        them from the boarder list and disable access.
                      </p>
                    )}
                  </div>
                  <div className="my-4 flex justify-between ">
                    <Button
                      type="button"
                      onClick={scanQR}
                      className="hover:text-primary"
                    >
                      Replace QR
                    </Button>
                    <Button type="submit" className="hover:text-primary">
                      Submit
                    </Button>
                  </div>
                  <div
                    id="reader"
                    style={{ width: "300px", margin: "auto" }}
                  ></div>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

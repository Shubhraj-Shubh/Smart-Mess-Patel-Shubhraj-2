"use client";
import React, { useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { verifyQRCode } from "@/actions/QRActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCost } from "@/actions/workerActions";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  cardNo: string;
  rollno: string;
};

const costSchema = z.object({
  workerId: z.string().min(1, {
    message: "Worker Id is required.",
  }),
  workerName: z.string().min(1, {
    message: "Worker name is required.",
  }),
  amount: z.string().min(1, {
    message: "Amount is required.",
  }),
});

const QRScannerCustom = ({
  workerId,
  workerName,
}: {
  workerId: string;
  workerName: string;
}) => {
  const [user, setUser] = useState<User | null>(null);

  const form = useForm<z.infer<typeof costSchema>>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      workerId,
      workerName,
      amount: "",
    },
  });

  async function onSubmit(values: z.infer<typeof costSchema>) {
    if (!user) return;
    try {
      const res = await addCost({ ...values, userId: user._id });

      if (res.success) {
        toast.success("Cost updated");
        setUser(null);
        form.reset();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  const fetchUser = async (decodedText: string) => {
    try {
      const res = await verifyQRCode(decodedText);

      if (res && res.valid && res.user) {
        if (res.user.active === false) {
          toast.error("Inactive Card");
          setUser(null);
          return;
        }
        setUser(res.user);
      } else {
        toast.error("Invalid User");
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    }
  };

  const scanQR = () => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 300, height: 300 } };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        fetchUser(decodedText);
        html5QrCode.stop();
      },
      (error) => {
        console.warn(`Error scanning: ${error}`);
      }
    );

    return () => {
      html5QrCode.stop().catch((err) => console.error(err));
    };
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <Button type="button" onClick={scanQR} className="hover:text-primary">
        Scan QR
      </Button>
      <div
        id="reader"
        style={{ width: "300px", margin: "auto" }}
        className="border-2 border-primary rounded-lg transition-all"
      ></div>
      {user && (
        <>
          <div className="font-medium flex flex-col p-4 w-full items-center">
            <div>Name: {user.name}</div>
            <div>Roll No.: {user.rollno}</div>
            <div>Card No.: {user.cardNo}</div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="flex gap-4">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="5" type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Add
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};

export default QRScannerCustom;

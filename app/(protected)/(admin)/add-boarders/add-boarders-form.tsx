"use client";
import { addBoarders } from "@/actions/QRActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import * as XLSX from "xlsx";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";

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
    })
    .regex(/@kgpian\.iitkgp\.ac\.in$/, {
      message: "Email must end with @kgpian.iitkgp.ac.in.",
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
});

const formSchema = z.object({
  boarders: z.array(boarderSchema).min(1, {
    message: "At least one user is required.",
  }),
});

type UserType = {
  name: string;
  rollno: string;
  email: string;
  cardNo: string;
  phoneNo: string;
};

type UserNotAdded = {
  user: UserType;
  message: string;
};

export function UserInputForm() {
  const [usersNotAdded, setUsersNotAdded] = useState<UserNotAdded[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      boarders: [
        {
          name: "",
          rollno: "",
          email: "",
          cardNo: "",
          phoneNo: "",
          session: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "boarders",
    control: form.control,
  });

  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   try {
  //     const res = await addBoarders(values.boarders);

  //     if (res.success) {
  //       toast.success("Users added successfully.");
  //       setUsersNotAdded(res.usersNotAdded);
  //       form.reset();
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   }
  // }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const BATCH_SIZE = 15;
    const DELAY_MS = 5000;
    const allBoarders = values.boarders;
    const notAdded: UserNotAdded[] = [];

    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

    for (let i = 0; i < allBoarders.length; i += BATCH_SIZE) {
      const batch = allBoarders.slice(i, i + BATCH_SIZE);

      try {
        const res = await addBoarders(batch);

        if (res.success) {
          toast.success(`Batch ${i / BATCH_SIZE + 1} added successfully.`);
          if (res.usersNotAdded && res.usersNotAdded.length > 0) {
            notAdded.push(...res.usersNotAdded);
          }
        } else {
          toast.error(`Batch ${i / BATCH_SIZE + 1} failed.`);
        }
      } catch (error) {
        console.error(`Batch ${i / BATCH_SIZE + 1} failed:`, error);
        toast.error(`Batch ${i / BATCH_SIZE + 1} encountered an error.`);
      }

      if (i + BATCH_SIZE < allBoarders.length) {
        await sleep(DELAY_MS); // Wait DELAY_MS milliseconds before next batch
      }
    }

    if (notAdded.length > 0) {
      setUsersNotAdded(notAdded);
      toast.warning(`${notAdded.length} users were not added.`);
    } else {
      form.reset();
      toast.success("All users added successfully.");
    }
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const ab = e.target?.result;
      if (!ab) return;

      const workbook = XLSX.read(ab, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const sheetData: string[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });

      const boarders = sheetData.slice(1).map((row) => ({
        name: String(row[0]),
        rollno: String(row[1]),
        email: String(row[2]),
        cardNo: String(row[3]),
        phoneNo: String(row[4]),
        session: String(row[5]),
      }));

      form.setValue("boarders", boarders);
      // setData(sheetData);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <div className="flex flex-col gap-4 max-w-screen-xl m-auto">
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <div>
          File upload will always be in format: Name, RollNo, Email (kgpian
          only), card no. (length 5), phone no.(10 digit or 12 digit starting
          with 91 only), session(eg. 2024)
        </div>
        <div className="flex items-center justify-center">or</div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="flex gap-4 flex-wrap">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 w-full max-w-sm">
                  <FormField
                    control={form.control}
                    name={`boarders.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Boarder Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`boarders.${index}.rollno`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-muted-foreground px-2">
                            Roll No.
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="22XY10011" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`boarders.${index}.phoneNo`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-muted-foreground px-2">
                            Phone No.
                          </FormLabel>
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
                    name={`boarders.${index}.email`}
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
                      name={`boarders.${index}.cardNo`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-muted-foreground">
                            Card No.
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="22111" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`boarders.${index}.session`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-muted-foreground">
                            Session
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => remove(index)}
                    >
                      Remove User
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 w-full flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: "",
                    rollno: "",
                    email: "",
                    cardNo: "",
                    phoneNo: "",
                    session: "",
                  })
                }
              >
                More Feilds
              </Button>
              <LoadingButton
                isLoading={form.formState.isSubmitting}
                text="Add Users"
              />
            </div>
          </form>
        </Form>
      </div>

      {usersNotAdded.length > 0 && (
        <h2 className="mt-8 text-xl text-destructive">
          These boarders not added:
        </h2>
      )}
      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {usersNotAdded.map((user, index) => (
          <div
            key={index}
            className="bg-destructive text-white p-4 rounded-lg shadow"
          >
            <p>{user.user.name}</p>
            <p>{user.user.rollno}</p>
            <p>{user.user.email}</p>
            <p>{user.user.cardNo}</p>
            <p>{user.message}</p>
          </div>
        ))}
      </div>
    </>
  );
}

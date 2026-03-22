"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  handleCredentialSignUp,
  handleCredentialsSignIn,
  sendOTP,
} from "@/actions/authActions";

import LoadingButton from "@/components/loading-button";
import ErrorAlert from "@/components/error-alert";
import { Checkbox } from "@/components/ui/checkbox";

const emailSchema = string().email({ message: "Invalid Email Address" });

export default function SignUp() {
  const [globalError, setGlobalError] = useState<string>("");
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "",
      otp: "",
    },
  });

  const sendOtp = async () => {
    const email = form.watch("email");
    const validation = emailSchema.safeParse(email);

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    const response = await sendOTP(email);

    if (response === "success") {
      toast.success("OTP sent successfully");
      setIsOtpSent(true);
    }
    else toast.error("Failed to send OTP");
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const result = await handleCredentialSignUp(data);

      if (result !== "success") {
        setGlobalError(result);
      } else {
        toast.success("Account created successfully");
        await handleCredentialsSignIn({
          email: data.email,
          password: data.password
        })
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error occurred");
    }
  };

  return (
    <>
      <div className="text-popover-foreground  flex flex-col mt-5">
        <div className="text-[#666] font-medium text-sm mb-1">Hey Champ!</div>
        <div className="font-semibold text-[#444] text-2xl mb-4 ">
          Create your wiZe Account
          <div className="h-[2px] my-2 bg-gradient-to-r from-white to-gray-400 max-w-[300px] rounded-full mt-3 "></div>
        </div>
      </div>

      {globalError && <ErrorAlert message={globalError} />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-2 justify-between w-full">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Given Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Family Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter company name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col md:flex-row md:space-x-2 items-center">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full relative">
                  <FormControl>
                    <Input type="text" placeholder="Enter OTP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 gap-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    All your information is collected, stored, and processed as
                    per our data processing guidelines. By signing up on wiZe,
                    you agree to our{" "}
                    <Link
                      href="/privacypolicy"
                      className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/termsandconditions"
                      className="text-purple-500 hover:text-purple-700 transition-colors duration-300"
                    >
                      Terms of Use
                    </Link>
                    .
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Button
            variant={"outline"}
            className="mr-4"
            type="button"
            onClick={sendOtp}
          >
            {isOtpSent ? "Resend OTP" : "Send OTP"}
          </Button>
          <LoadingButton
            isLoading={form.formState.isSubmitting}
            text="Sign in"
          />
        </form>
      </Form>
      <p className="mt-12 text-gray-500">
        Already have an account, please{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Login
        </Link>
        .
      </p>
    </>
  );
}

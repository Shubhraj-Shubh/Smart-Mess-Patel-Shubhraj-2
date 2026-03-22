import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <div className="bg-default-foreground flex flex-col items-center justify-center relative p-4 md:p-0 min-h-screen">
        <div className="w-full max-w-xl p-4 md:p-6 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </>
  );
}

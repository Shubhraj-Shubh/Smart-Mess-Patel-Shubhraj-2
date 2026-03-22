import { getBoarder } from "@/actions/boarderActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UnknownLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const boarder = await getBoarder(session.user.email as string);

  if (boarder) redirect("/dashboard");

  return <>{children}</>;
}

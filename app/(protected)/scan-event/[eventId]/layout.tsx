import { verifyEventUserById } from "@/actions/EventActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UnknownLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ eventId: string }>;
}) {
  const session = await auth();

    const eventId = (await params).eventId;

  if (!session?.user) {
    redirect("/");
  }

  const res = await verifyEventUserById(eventId, session.user.email as string);

  if (!res.success) redirect("/");

  return <>{children}</>;
}

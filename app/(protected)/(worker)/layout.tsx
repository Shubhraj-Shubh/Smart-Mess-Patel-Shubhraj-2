import { getWorker } from "@/actions/workerActions";
import WorkerNavbar from "@/components/worker/WorkerNavbar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const worker = await getWorker(session.user.email);

  if (!worker) {
    redirect("/");
  }

  return (
    <>
      <WorkerNavbar />
      {children}
    </>
  );
}

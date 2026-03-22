import { getWorker } from "@/actions/workerActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function WorkerPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const worker = await getWorker(session.user.email);

  if (!worker) {
    redirect("/");
  }

  return (
    <div>
      <div>{worker.name}</div>
      <div>{worker.email}</div>
      <div>{worker.phoneNo}</div>
    </div>
  );
}

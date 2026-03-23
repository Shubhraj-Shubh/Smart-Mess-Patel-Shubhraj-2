import { auth } from "@/lib/auth";
import { getWorker } from "@/actions/workerActions";
import UtensilScanner from "./UtensilScanner";

export default async function WorkerUtensilPage() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const worker = await getWorker(session.user.email);
  if (!worker) {
    return null;
  }

  return (
    <div className="px-8">
      <UtensilScanner
        workerId={worker._id.toString()}
        workerName={worker.name}
      />
    </div>
  );
}

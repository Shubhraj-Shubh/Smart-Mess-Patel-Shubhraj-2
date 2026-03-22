import { auth } from "@/lib/auth";
import QRScanner from "./QRScanner";
import { getWorker } from "@/actions/workerActions";

export default async function ScanBoardersPage() {
  const session = await auth();

  if (!session?.user || !session?.user.id) {
    return null;
  }

  const worker = await getWorker(session.user.email as string);

  if (!worker) return null;

  return (
    <div className="px-8">
      <QRScanner
        workerId={worker._id.toString()}
        workerName={worker.name}
      />
    </div>
  );
}

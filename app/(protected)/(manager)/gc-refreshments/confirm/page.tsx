import { GetPendingRefreshments,
  GetRefreshmentHistory
 } from "@/actions/gcActions";
import PendingRefreshments from "./PendingRefreshments";
import RefreshmentHistory from "./RefreshmentHistory";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ConfirmRefreshmentsPage() {
    const history = await GetRefreshmentHistory();
  const pendingEntries = await GetPendingRefreshments();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">GC Refreshments - Confirm Entries</h1>
        <p className="text-muted-foreground">
          Review and verify refreshment entries submitted by co-admins
        </p>
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading pending entries...</p>
          </div>
        </div>
      }>
        <PendingRefreshments entries={pendingEntries} />
        <RefreshmentHistory entries={history} />
      </Suspense>
    </div>
     
  );
}

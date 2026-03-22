import {
  GetAllGCEvents,
  GetAllGCItems,
  SeedGCEvents,
  SeedGCItems,
} from "@/actions/gcActions";
import AddRefreshmentForm from "./AddRefreshmentForm";
import TimeWindowBanner from "./TimeWindowBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AddRefreshmentPage() {
  // Seed events and items on first load
  await SeedGCEvents();
  await SeedGCItems();

  const events = await GetAllGCEvents();
  const items = await GetAllGCItems();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">GC Refreshments - Add Entry</h1>
          <p className="text-muted-foreground mt-1">
            Record and manage refreshment consumption for GC events
          </p>
        </div>
        <TimeWindowBanner />
      </div>

      <div className="space-y-10">
        <AddRefreshmentForm events={events} items={items} />
      </div>
    </div>
  );
}

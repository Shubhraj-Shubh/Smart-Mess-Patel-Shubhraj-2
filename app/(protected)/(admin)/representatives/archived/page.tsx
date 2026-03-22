import { GetArchivedRepresentatives } from "@/actions/adminActions";
import ArchivedRepresentativeCard from "./ArchivedRepresentativeCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export default async function ArchivedRepresentativesPage() {
  const representatives = await GetArchivedRepresentatives();

  return (
    <>
      <div className="flex justify-between items-center px-8">
        <h1 className="text-center text-2xl my-4">Archived Representatives</h1>
        <Link href="/representatives">
          <Button variant="outline">Back to Active</Button>
        </Link>
      </div>
      <div className="max-w-screen-xl m-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
          {representatives.map((rep) => (
            <ArchivedRepresentativeCard key={rep._id} representative={rep} />
          ))}
        </div>
      </div>
    </>
  );
}

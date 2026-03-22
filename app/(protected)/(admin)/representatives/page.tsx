import ShowRepresentatives from "./ShowRepresentatives";
import { AddRepresentativeForm } from "./AddRepresentatives";
import Link from "next/link";
import { Button } from "@/components/ui/button";


export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RepresentativesPage() {
  return (
    <>
      <div className="flex justify-between items-center px-8">
        <h1 className="text-center text-2xl my-4">Representatives</h1>
  <AddRepresentativeForm />
        <Link href="/representatives/archived">
          <Button variant="outline">View Archived</Button>
        </Link>
      </div>
     
      <ShowRepresentatives />
     
    </>
  );
}

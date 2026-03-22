import Image from "next/image";
import Link from "next/link";
import { Amatic_SC } from "next/font/google";
import { GetArchivedRepresentatives } from "@/actions/adminActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const amaticSC = Amatic_SC({ subsets: ["latin"], weight: ["400", "700"] });

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamArchivePage() {
  const representatives = await GetArchivedRepresentatives();

  // Group representatives by session (numeric year)
  const groupedBySession = representatives.reduce((acc, rep) => {
    const session = rep.session;
    if (!acc[session]) {
      acc[session] = [];
    }
    acc[session].push(rep);
    return acc;
  }, {} as Record<number, typeof representatives>);

  // Sort sessions in descending order (latest first)
  const sortedSessions = Object.keys(groupedBySession)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="py-20">
      {/* Navigation Header */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Archived Representatives</h2>
            <Badge variant="secondary" className="text-sm">
              {representatives.length} {representatives.length === 1 ? "representative" : "representatives"}
            </Badge>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/team">Current Representatives</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/team/archived">View Archive</Link>
            </Button>
          </div>
        </div>
      </div>

      {sortedSessions.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-muted-foreground text-lg">No archived representatives yet.</p>
        </div>
      ) : (
        sortedSessions.map((session) => {
          const sessionReps = groupedBySession[session];
          const generalSecretary = sessionReps.find((rep) =>
            rep.role.toLowerCase().includes("general secretary")
          );
          const otherReps = sessionReps.filter(
            (rep) => !rep.role.toLowerCase().includes("general secretary")
          );

          return (
            <section key={session} className="contact py-24 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <h3
                  className={`title text-5xl font-bold capitalize ${amaticSC.className}`}
                >
                  Student Representative&apos;s {session}-{session + 1}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Archived
                </Badge>
              </div>
              <hr className="w-64 h-1 bg-primary mb-12 mx-auto" />

              <div className="flex items-center flex-col flex-wrap p-2">
                {generalSecretary && (
                  <div className="mb-8 relative">
                    <Image
                      src={generalSecretary.photoUrl || "/team/default.jpg"}
                      width={200}
                      height={200}
                      alt={generalSecretary.name}
                      className="rounded-full mb-4 object-cover opacity-90"
                    />
                    <h3 className="font-semibold">{generalSecretary.name}</h3>
                    <p className="text-sm">{generalSecretary.role}</p>
                    {generalSecretary.department && (
                      <p className="text-xs text-gray-500">
                        {generalSecretary.department}
                      </p>
                    )}
                  </div>
                )}

                {otherReps.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg w-full mt-8">
                    {otherReps.map((rep) => (
                      <div key={rep._id} className="flex flex-col items-center">
                        <Image
                          src={rep.photoUrl || "/team/default.jpg"}
                          width={165}
                          height={165}
                          alt={rep.name}
                          className="rounded-full mb-4 object-cover opacity-90"
                        />
                        <h3 className="font-semibold">{rep.name}</h3>
                        <p className="text-sm">{rep.role}</p>
                        {rep.department && (
                          <p className="text-xs text-gray-500">
                            {rep.department}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}

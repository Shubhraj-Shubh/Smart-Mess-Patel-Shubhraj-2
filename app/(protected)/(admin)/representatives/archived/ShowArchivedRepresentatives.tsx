import { GetArchivedRepresentatives } from "@/actions/adminActions";
import ArchivedRepresentativeCard from "./ArchivedRepresentativeCard";

export default async function ShowArchivedRepresentatives() {
  const representatives = await GetArchivedRepresentatives();

  // Group representatives by session (numeric year like 2024)
  const groupedBySession = representatives.reduce((acc, rep) => {
    if (!acc[rep.session]) {
      acc[rep.session] = [];
    }
    acc[rep.session].push(rep);
    return acc;
  }, {} as Record<number, typeof representatives>);

  // Sort sessions by year descending (latest first)
  const sortedSessions = Object.keys(groupedBySession)
    .map(Number)
    .sort((a, b) => b - a);

  if (sortedSessions.length === 0) {
    return (
      <div className="max-w-screen-xl m-auto px-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No archived representatives yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl m-auto px-4">
      {sortedSessions.map((session) => (
        <div key={session} className="mb-8">
          <div className="flex items-center gap-3 mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">
              Session {session}-{session + 1}
            </h2>
            <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
              Archived
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedBySession[session].map((rep) => (
              <ArchivedRepresentativeCard key={rep._id} representative={rep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

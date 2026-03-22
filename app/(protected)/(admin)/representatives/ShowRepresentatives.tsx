import { GetAllRepresentatives } from "@/actions/adminActions";
import RepresentativeCard from "./RepresentativeCard";

export default async function ShowRepresentatives() {
  const representatives = await GetAllRepresentatives();

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

  return (
    <div className="max-w-screen-xl m-auto px-4">
      {sortedSessions.map((session) => (
        <div key={session} className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Session {session}-{session + 1}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedBySession[session].map((rep) => (
              <RepresentativeCard key={rep._id} representative={rep} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

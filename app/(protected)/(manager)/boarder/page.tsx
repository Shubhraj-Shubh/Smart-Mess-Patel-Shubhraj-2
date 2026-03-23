import { GetAllBoarders, GetAdmin } from "@/actions/adminActions";
import Boarders from "./Boarders";
import { auth } from "@/lib/auth";
import { getUtensilFineTotalsByBoarderIds } from "@/actions/UtensilFineAction";

export default async function Workers() {
  const boarders = await GetAllBoarders();
  const utensilTotals = await getUtensilFineTotalsByBoarderIds(
    boarders.map((boarder) => boarder._id.toString())
  );

  const boardersWithUtensil = boarders.map((boarder) => ({
    ...boarder,
    utensilFineAmount: utensilTotals[boarder._id.toString()] ?? 0,
  }));

  const session = await auth();
  const admin = session?.user?.email ? await GetAdmin(session.user.email as string) : null;

  return (
    <>
      <h1 className="text-center text-2xl my-4">Boarders</h1>
      <Boarders previous={boardersWithUtensil} adminRole={admin?.role} />
    </>
  );
}

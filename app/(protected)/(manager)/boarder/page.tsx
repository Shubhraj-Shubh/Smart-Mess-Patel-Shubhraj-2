import { GetAllBoarders, GetAdmin } from "@/actions/adminActions";
import Boarders from "./Boarders";
import { auth } from "@/lib/auth";

export default async function Workers() {
  const boarders = await GetAllBoarders();
  const session = await auth();
  const admin = session?.user?.email ? await GetAdmin(session.user.email as string) : null;

  return (
    <>
      <h1 className="text-center text-2xl my-4">Boarders</h1>
      <Boarders previous={boarders} adminRole={admin?.role} />
    </>
  );
}

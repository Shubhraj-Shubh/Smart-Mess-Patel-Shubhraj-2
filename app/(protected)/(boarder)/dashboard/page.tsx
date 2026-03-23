import { getCosts } from "@/actions/dashboardActions";
import { getFines } from "@/actions/fineActions";
import { auth } from "@/lib/auth";
import { getBoarder } from "@/actions/boarderActions";
import CostsPage from "./costs";
import FinesPageBoarder from "./fines";
import BoarderCostsAndFinesNav from "./BoarderCostsAndFinesNav";
import BoarderUtensilPage from "./utensil";
import {
  getUtensilFineTotalForBoarder,
  getUtensilHistoryForBoarder,
} from "@/actions/UtensilFineAction";

export type Cost = {
  _id: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  category: string;
  createdAt: Date;
};

export type Fine = {
  _id: string;
  userId: string;
  adminId: string;
  adminName: string;
  reason: string;
  session: number;
  season: string;
  fineAmount: number;
  paid: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UtensilEntry = {
  _id: string;
  issuedByWorkerName: string;
  returnedToWorkerName: string;
  fineAmount: number;
  fineApplied: boolean;
  paid: boolean;
  issuedAt: Date;
  dueAt: Date;
  returnedAt: Date | null;
};

const LIMIT = 50;

export default async function Dasboard() {
  const session = await auth();
  if (!session?.user) return null;

  const boarder = await getBoarder(session.user.email as string);

  if (!boarder) return null;

  const costs: Cost[] = await getCosts(boarder._id as string, LIMIT);
  const fines: Fine[] = await getFines(boarder._id as string, LIMIT, true);
  const utensilEntries: UtensilEntry[] = await getUtensilHistoryForBoarder(
    boarder._id as string,
    LIMIT
  );
  const utensilFineTotal = await getUtensilFineTotalForBoarder(boarder._id as string);

  return (
    <div className="pb-20">
      <h1 className="text-center text-2xl my-8"> Dashboard </h1>

      <div className="max-w-screen-xl m-auto mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex-1 bg-gradient-to-r from-red-900 to-orange-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Amount Due</h2>
          <p className="text-4xl font-bold">₹ {boarder.amount}</p>
          <p className="text-sm mt-2 opacity-90">Unpaid add-ons and extras</p>
        </div>
        <div className="flex-1 bg-gradient-to-r from-purple-900 to-pink-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Fine Due</h2>
          <p className="text-4xl font-bold">₹ {boarder.fineAmount}</p>
          <p className="text-sm mt-2 opacity-90">Outstanding fines</p>
        </div>
        <div className="flex-1 bg-gradient-to-r from-amber-900 to-yellow-700 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Utensil Fine Due</h2>
          <p className="text-4xl font-bold">₹ {utensilFineTotal}</p>
          <p className="text-sm mt-2 opacity-90">Late utensil returns</p>
        </div>
          <div className="flex-1 bg-gradient-to-r from-green-900 to-teal-800 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Total Due</h2>
          <p className="text-4xl font-bold">₹ {boarder.amount + boarder.fineAmount + utensilFineTotal}</p>
          <p className="text-sm mt-2 opacity-90">Amount + Fine + Utensil Fine</p>
        </div>
      </div>

      <div className="max-w-screen-xl m-auto border-b">
        <BoarderCostsAndFinesNav/>
        <div id="boarder-costs-section">
          <div className="flex border-t p-2 items-center justify-around">
            <div className="w-full text-center">Amount</div>
            <div className="w-full text-center">Added By</div>
            <div className="w-full text-center">Time </div>
            <div className="w-full text-center">Category</div>
          </div>
          <CostsPage boarderId={boarder._id} lastCosts={costs} />
        </div>
        <div id="boarder-fines-section" className="hidden">
          <div className="flex border-t p-2 items-center justify-around">
            <div className="w-full text-center">Amount</div>
            <div className="w-full text-center">Reason</div>
            <div className="w-full text-center">Added By</div>
            <div className="w-full text-center">Time</div>
            <div className="w-full text-center">Status</div>
          </div>
          <FinesPageBoarder boarderId={boarder._id} lastFines={fines} />
        </div>
        <div id="boarder-utensil-section" className="hidden">
          <div className="flex border-t p-2 items-center justify-around">
            <div className="w-full text-center">Issued By</div>
            <div className="w-full text-center">Taken By</div>
            <div className="w-full text-center">Issued Time</div>
            <div className="w-full text-center">Returned Time</div>
            <div className="w-full text-center">Due Time</div>
            <div className="w-full text-center">Fine Status</div>
          </div>
          <BoarderUtensilPage boarderId={boarder._id} lastEntries={utensilEntries} />
        </div>
      </div>
    </div>
  );
}

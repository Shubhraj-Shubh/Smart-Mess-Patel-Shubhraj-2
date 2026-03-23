import { getBoarderWithId, getCosts } from "@/actions/dashboardActions";
import { getFines } from "@/actions/fineActions";
import EditBoarderComponent from "./EditBoarder";
import CostsPage from "./costs";
import FinesPage from "./fines";
import AddFineForm from "./AddFineForm";
import CostsAndFinesNav from "./CostsAndFinesNav";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GetAdmin } from "@/actions/adminActions";
import AllPaidButton from "./all-paid-button";
import ClearAllFinesButton from "./clear-all-fines-button";
import UtensilPage from "./utensil";
import {
  getUtensilFineAmount,
  getUtensilFineTotalForBoarder,
  getUtensilHistoryForBoarder,
} from "@/actions/UtensilFineAction";
import UpdateUtensilFineAmountButton from "./update-utensil-fine-amount-button";
import ClearAllUtensilFinesButton from "./clear-all-utensil-fines-button";

export type Cost = {
  _id: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  paid: boolean;
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

export default async function BoarderPage({
  params,
}: {
  params: Promise<{ boarderId: string }>;
}) {
  const { boarderId } = await params;

  const boarder = await getBoarderWithId(boarderId as string);
  if (!boarder) return null;

  const costs: Cost[] = await getCosts(boarderId as string, LIMIT);
  const fines: Fine[] = await getFines(boarderId as string, LIMIT, true);
  const utensilEntries: UtensilEntry[] = await getUtensilHistoryForBoarder(
    boarderId as string,
    LIMIT
  );
  const utensilFineTotal = await getUtensilFineTotalForBoarder(boarderId as string);
  const utensilFineAmountRes = await getUtensilFineAmount();
  const utensilFineAmount = utensilFineAmountRes.amount;

  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const admin = await GetAdmin(session.user.email as string);

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="pb-20">
      <div className="max-w-screen-xl m-auto px-4">
        <div className="my-8 flex flex-col items-center gap-4">
          <div>
            <h1 className="text-center text-2xl"> {boarder.name} </h1>
            <p className="text-center text-sm text-gray-600 mt-2">
              Amount: Rs {boarder.amount} | Fine: Rs {boarder.fineAmount} |
              Utensil Fine: Rs {utensilFineTotal} | Total: Rs {boarder.amount + boarder.fineAmount + utensilFineTotal}
            </p>
          </div>

          {admin.role === "admin" && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <AllPaidButton boarderId={boarderId} />
              <ClearAllFinesButton boarderId={boarderId} />
              <AddFineForm boarderId={boarderId} />
              <ClearAllUtensilFinesButton boarderId={boarderId} />
              <UpdateUtensilFineAmountButton currentAmount={utensilFineAmount} />
              <EditBoarderComponent boarder={boarder} />
            </div>
          )}
        </div>
      </div>
      <div className="max-w-screen-xl m-auto border-b">
        <CostsAndFinesNav/>
      </div>
      <div className="max-w-screen-xl m-auto border-b" id="costs-section">
        <div className="flex border-t p-2 items-center justify-around">
          <div className="w-full text-center">Amount</div>
          <div className="w-full text-center">Added By</div>
          <div className="w-full text-center">Time </div>
          <div className="w-full text-center">Category</div>
           {admin.role === "admin" && <div className="w-full text-center">Actions</div>}
        </div>
        <CostsPage boarderId={boarderId} lastCosts={costs} adminRole={admin.role} />
      </div>
      <div className="max-w-screen-xl m-auto border-b hidden" id="fines-section">
        <div className="flex border-t p-2 items-center justify-around">
          <div className="w-full text-center">Amount</div>
          <div className="w-full text-center">Reason</div>
          <div className="w-full text-center">Added By</div>
          <div className="w-full text-center">Time</div>
          <div className="w-full text-center">Status</div>
          {admin.role === "admin" && <div className="w-full text-center">Actions</div>}
        </div>
        <FinesPage boarderId={boarderId} lastFines={fines} adminRole={admin.role} />
      </div>
      <div className="max-w-screen-xl m-auto border-b hidden" id="utensil-section">
        <div className="flex border-t p-2 items-center justify-around">
          <div className="w-full text-center">Issued By</div>
          <div className="w-full text-center">Taken By</div>
          <div className="w-full text-center">Issued Time</div>
          <div className="w-full text-center">Returned Time</div>
          <div className="w-full text-center">Due Time</div>
          <div className="w-full text-center">Fine Status</div>
          {admin.role === "admin" && <div className="w-full text-center">Actions</div>}
        </div>
        <UtensilPage
          boarderId={boarderId}
          lastEntries={utensilEntries}
          adminRole={admin.role}
        />
      </div>
    </div>
  );
}

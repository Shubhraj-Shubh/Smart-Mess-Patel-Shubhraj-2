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
  const fines: Fine[] = await getFines(boarderId as string, LIMIT);

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
      <div className="flex justify-center items-center max-w-screen-xl gap-4 m-auto relative">
        <div>
          <h1 className="text-center text-2xl my-8"> {boarder.name} </h1>
          <p className="text-center text-sm text-gray-600">Amount: ₹{boarder.amount} | Fine: ₹{boarder.fineAmount} | Total: ₹{boarder.amount + boarder.fineAmount}</p>
        </div>
        <div className="absolute right-0 flex gap-2">
          {admin.role === "admin" && <AllPaidButton boarderId={boarderId} />}
          {admin.role === "admin" && <ClearAllFinesButton boarderId={boarderId} />}
          {admin.role === "admin" && <AddFineForm boarderId={boarderId} />}
          {admin.role === "admin" && <EditBoarderComponent boarder={boarder} />}
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
          {admin.role === "admin" && <div className="w-full text-center">Actions</div>}
        </div>
        <FinesPage boarderId={boarderId} lastFines={fines} adminRole={admin.role} />
      </div>
    </div>
  );
}

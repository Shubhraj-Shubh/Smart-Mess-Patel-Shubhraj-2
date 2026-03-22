import { getCosts } from "@/actions/dashboardActions";
import CostCard from "./CostCard";
import { auth } from "@/lib/auth";
import { getBoarder } from "@/actions/boarderActions";

type Cost = {
  _id: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  category: string;
  createdAt: Date;
};

export default async function CostPage() {
  const session = await auth();
  if (!session?.user) return null;

  const boarder = await getBoarder(session.user.email as string);

  if (!boarder) return null;

  const costs: Cost[] = await getCosts(boarder._id as string);

  let prevDate: string | null = null;

  return (
    <div className="pb-20">
      <h1 className="text-center text-2xl my-8"> Dashboard </h1>
      <div className="max-w-screen-xl m-auto border-b">
        <div className="flex border-t p-2 items-center justify-around">
          <div className="w-full text-center">Amount</div>
          <div className="w-full text-center">Added By</div>
          <div className="w-full text-center">Time </div>
          <div className="w-full text-center">Category</div>
        </div>
        {costs.map((cost, index) => {
          const costDate = cost.createdAt
            .toLocaleString("en-IN")
            .substring(0, 10);

          let dateHeader = null;
          if (prevDate !== costDate) {
            dateHeader = (
              <div className="text-center border-t py-2">{costDate}</div>
            );
            prevDate = costDate;
          }

          return (
            <div key={index}>
              {dateHeader}
              <CostCard cost={cost} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

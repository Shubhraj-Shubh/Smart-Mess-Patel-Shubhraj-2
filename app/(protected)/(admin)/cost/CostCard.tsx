"use client";

type CostType = {
  _id: string;
  userId: string;
  workerId: string;
  workerName: string;
  amount: number;
  category: string;
  createdAt: Date;
};

export default function CostCard({ cost }: { cost: CostType }) {
  return (
    <div className="flex border-t p-2 items-center justify-around">
      <div className="w-full text-center">{cost.amount}</div>
      <div className="w-full text-center">{cost.workerName}</div>
      <div className="w-full text-center">
        {cost.createdAt.getHours() + ":" + cost.createdAt.getMinutes()}
      </div>
      <div className="w-full text-center">{cost.category}</div>
    </div>
  );
}

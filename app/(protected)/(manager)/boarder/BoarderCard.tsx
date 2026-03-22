import Link from "next/link";

type BoarderType = {
  _id: string;
  name: string;
  phoneNo: string;
  rollno: string;
  cardNo: string;
  email: string;
  secret: string;
  session: number;
  amount: number;
  fineAmount: number;
};

export default function BoarderCard({ boarder, serialNo }: { boarder: BoarderType; serialNo: number }) {
  const total = boarder.amount + boarder.fineAmount;
  return (
    <>
      <Link
        href={`/boarder/${boarder._id}`}
        className="flex border-t p-2 items-center justify-around"
      >
        <div className="w-full text-center">{serialNo}</div>
        <div className="w-full text-center">{boarder.name}</div>
        <div className="w-full text-center">{boarder.phoneNo}</div>
        <div className="w-full text-center">{boarder.rollno}</div>
        <div className="w-full text-center">{boarder.amount || 0}</div>
        <div className="w-full text-center">{boarder.fineAmount}</div>
        <div className="w-full text-center font-bold text-red-600">{total}</div>
      </Link>
    </>
  );
}

import { getBoarder } from "@/actions/boarderActions";
import ComplaintForm from "./ComplaintForm";
import { auth } from "@/lib/auth";
import { getUserComplaints } from "@/actions/complaintActions";
import ComplaintCard from "./ComplaintCard";

export default async function FileComplaint() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const boarder = await getBoarder(session.user.email as string);

  if (!boarder) return null;

  const complaints = await getUserComplaints(boarder._id as string);

  let prevDate: string | null = null;

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <h1 className="text-center text-2xl my-8"> Complaints </h1>
        <div className="max-w-screen-xl m-auto w-full ">
          {complaints.map((complaint, index) => {
            const complaintDate = complaint.createdAt
              .toLocaleString("en-IN")
              .substring(0, 10);

            let dateHeader = null;
            if (prevDate !== complaintDate) {
              dateHeader = (  
                <div className="text-center py-2">{complaintDate}</div>
              );
              prevDate = complaintDate;
            }

            return (
              <div key={index}>
                {dateHeader}
                <ComplaintCard complaint={complaint} />
              </div>
            );
          })}
        </div>
        <ComplaintForm
          userId={boarder._id}
          userName={boarder.name}
          rollno={boarder.rollno}
        />
      </div>
    </>
  );
}

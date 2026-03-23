"use client";
import { getComplaints } from "@/actions/complaintActions";
import { PaginationControls } from "./pagination-controls";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ComplaintsList } from "./complaints-list";

type Complaint = {
  _id: string;
  userId: string;
  userName: string;
  rollno: string;
  description: string;
  status: "Pending" | "Resolved";
  adminMessage: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function ComplaintsPage() {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const [total, setTotal] = useState(0);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const res = await getComplaints(page, limit);
      if (res.success) {
        setComplaints(res.data);
        setTotal(res.total as number);
      }
    };

    fetchComplaints();
  }, [page, limit]);

  return (
    <div className="container max-w-screen-lg m-auto space-y-8">
      <h1 className="text-center text-2xl my-4">Complaints</h1>
      <PaginationControls
        currentPage={page}
        totalPages={Math.floor(total / limit)}
        pageSize={limit}
      />

      <ComplaintsList complaints={complaints} />
    </div>
  );
}

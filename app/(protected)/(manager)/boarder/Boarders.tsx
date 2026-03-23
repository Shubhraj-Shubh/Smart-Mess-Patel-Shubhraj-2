"use client";

import { useState, useTransition } from "react";
import BoarderCard from "./BoarderCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchBoardersWithNameSession } from "@/actions/boarderActions";
import { clearAllBoardersCosts } from "@/actions/dashboardActions";
import { clearAllFinesSystem } from "@/actions/fineActions";
import {
  clearAllUtensilFinesSystem,
  getUtensilFineTotalsByBoarderIds,
} from "@/actions/UtensilFineAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type BoarderType = {
  _id: string;
  name: string;
  phoneNo: string;
  rollno: string;
  cardNo: string;
  email: string;
  session: number;
  secret: string;
  amount: number;
  fineAmount: number;
  utensilFineAmount: number;
};

export default function Boarders({ previous, adminRole }: { previous: BoarderType[], adminRole?: string }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() ?? "";
  const selectedSession =
    searchParams.get("session") ?? `${new Date().getFullYear()}`;

  const [boarders, setBoarders] = useState(
    previous.filter((boarder) => {
      return (
        boarder.name.toLowerCase().includes(searchQuery) ||
        boarder.rollno.toLowerCase().includes(searchQuery)
      );
    })
  );
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key === "search") {
      const query = value.toLowerCase();

      if (query === "") {
        setBoarders(previous);
      } else {
        setBoarders(
          previous.filter((boarder) => {
            return (
              boarder.name.toLowerCase().includes(query) ||
              boarder.rollno.toLowerCase().includes(query)
            );
          })
        );
      }
    }

    console.log(isPending);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Patel Hall of Residence", 10, 10);

    const date = new Date();
    doc.setFontSize(12);
    doc.text(
      `Boarders add-ons and fines details: ${date.toLocaleDateString("en-IN")}`,
      10,
      15
    );

    const tableColumns = [
      "Name",
      "Roll No",
      "Amount",
      "Fine",
      "Utensil Fine",
      "Total",
    ];
    const tableRows = boarders.map((item) => [
      item.name,
      item.rollno,
      item.amount ?? "-",
      item.fineAmount ?? "-",
      item.utensilFineAmount ?? "-",
      (item.amount ?? 0) + (item.fineAmount ?? 0) + (item.utensilFineAmount ?? 0),
    ]);

    doc.autoTable({
      startY: 20,
      head: [tableColumns],
      body: tableRows,
      styles: {
        cellPadding: 2,
        fontSize: 12,
        halign: "center",
        valign: "middle",
        lineWidth: 0.1,
      },
    });

    doc.save("StudentAmounts.pdf");
  };

  const currentYear = new Date().getFullYear();
  const sessionOptions = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => `${2020 + i}`
  );

  const handleSearch = async () => {
    const data = await searchBoardersWithNameSession(
      query,
      Number(selectedSession)
    );

    const totals = await getUtensilFineTotalsByBoarderIds(
      data.map((item) => item._id)
    );

    setBoarders(
      data.map((item) => ({
        ...item,
        utensilFineAmount: totals[item._id] ?? 0,
      }))
    );
  };

  const handleClearAllCosts = async () => {
    const res = await clearAllBoardersCosts();
    if (res === "success") {
      toast.success("All boarders costs cleared successfully");
      router.refresh();
    } else {
      toast.error("Failed to clear all costs");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-screen-md mx-auto w-full gap-4">
        <div className="relative w-full ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search by name or roll number..."
            className="pl-10 md:max-w-screen-sm w-full"
            value={query}
            onChange={(e) => {
              updateQueryParam("search", e.target.value);
              setQuery(e.target.value);
            }}
          />
        </div>

        <Select onValueChange={(value) => updateQueryParam("session", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Session" />
          </SelectTrigger>
          <SelectContent>
            {sessionOptions.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="">
          Search
        </Button>
      </div>
      <div className="max-w-screen-xl w-full m-auto border-b">
        {boarders.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No boarders found matching your search.
          </p>
        ) : (
          <>
            <div className="flex border-t p-2 items-center justify-around font-bold bg-gray-100">
              <div className="w-full text-center">S.No</div>
              <div className="w-full text-center">Name</div>
              <div className="w-full text-center">Phone No</div>
              <div className="w-full text-center">Roll No</div>
              <div className="w-full text-center">Amount</div>
              <div className="w-full text-center">Fine</div>
              <div className="w-full text-center">Utensil Fine</div>
              <div className="w-full text-center">Total</div>
            </div>
            {boarders.map((boarder, index) => (
              <BoarderCard boarder={boarder} key={boarder._id} serialNo={index + 1} />
            ))}
          </>
        )}
      </div>
      
      <div className="flex gap-4 max-w-md mx-auto my-10 w-full">
        <Button
          onClick={generatePDF}
          className="w-full hover:text-primary"
        >
          Download PDF
        </Button>
        
        {adminRole === "admin" && (
          <>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Clear All Costs
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all boarders costs?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will mark ALL costs as paid and reset ALL boarders amounts to 0.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAllCosts}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full bg-purple-600 hover:bg-purple-700">
                  Clear All Fines
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all boarders fines?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will mark ALL fines as paid and reset ALL boarders fines to 0.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  const res = await clearAllFinesSystem();
                  if (res === "success") {
                    toast.success("All fines cleared");
                    router.refresh();
                  } else {
                    toast.error("Failed to clear fines");
                  }
                }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full bg-amber-600 hover:bg-amber-700">
                  Clear All Utensil Fines
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all boarders utensil fines?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark ALL unpaid applied utensil fines as paid.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  const res = await clearAllUtensilFinesSystem();
                  if (res === "success") {
                    toast.success("All utensil fines cleared");
                    router.refresh();
                  } else {
                    toast.error("Failed to clear utensil fines");
                  }
                }}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}

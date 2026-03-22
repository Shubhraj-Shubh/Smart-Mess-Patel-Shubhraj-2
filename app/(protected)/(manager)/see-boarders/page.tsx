"use client";
import Card from "@/components/BoarderCard";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchBoardersWithNameSession } from "@/actions/boarderActions";

type User = {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  rollno: string;
  secret: string;
  cardNo: string;
  session?: number;
};

const LIMIT = 50;

export default function SeeBoarders() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = parseInt(searchParams.get("page") || "1");
  const [users, setUsers] = useState<User[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(initialPage);
  const [query, setQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>("all");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchUsers = useCallback(async (page: number) => {
    try {
      const res = await fetch(`/api/get-boarders?page=${page}&limit=${LIMIT}`);
      const data = await res.json();

      if (res.ok) {
        setUsers(data.data);
        setIsSearchMode(false);
      } else {
        toast.error("Failed to fetch boarders");
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    if (isSearchMode) {
      toast.info("Please reset to use pagination");
      return;
    }
    setPage(newPage);
    router.push(`?page=${newPage}`);
    fetchUsers(newPage);
  };

  useEffect(() => {
    fetchUsers(page);
  }, [fetchUsers, page]);

  useEffect(() => {
    const getNumberOfBoarders = async () => {
      try {
        const res = await fetch("/api/get-boarders/count");
        const data = await res.json();

        if (res.ok) {
          setCount(data.count);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNumberOfBoarders();
  }, []);

  const totalPages = Math.ceil(count / LIMIT);

  const currentYear = new Date().getFullYear();
  const sessionOptions = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => `${2020 + i}`
  );

  const handleSearch = async () => {
    if (!query && selectedSession === "all") {
      fetchUsers(1);
      setPage(1);
      const res = await fetch("/api/get-boarders/count");
      const data = await res.json();
      if (res.ok) {
        setCount(data.count);
      }
      return;
    }

    const session =
      selectedSession !== "all" ? Number(selectedSession) : undefined;
    const data = await searchBoardersWithNameSession(query || "", session);
    setUsers(data);
    setCount(data.length);
    setIsSearchMode(true);
  };

  const handleReset = () => {
    setQuery("");
    setSelectedSession("all");
    setPage(1);
    setIsSearchMode(false);
    fetchUsers(1);
    // Refetch count
    fetch("/api/get-boarders/count")
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(console.error);
  };

  return (
    <>
      <h1 className="text-center text-2xl my-4">See Boarders</h1>

      <div className="flex max-w-screen-md mx-auto w-full gap-4 mb-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="search"
            placeholder="Search by name or roll number..."
            className="pl-10 w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <Select value={selectedSession} onValueChange={setSelectedSession}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {sessionOptions.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div className="flex gap-4 mb-6 justify-center">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1 || isSearchMode}
          onClick={() => handlePageChange(page - 1)}
        >
          Prev Page
        </Button>
        <Button variant="outline" disabled>
          {isSearchMode
            ? `Showing ${users.length} results`
            : `Page ${page} of ${totalPages || 1}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={page >= totalPages || isSearchMode}
          onClick={() => handlePageChange(page + 1)}
        >
          Next Page
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 gap-y-8 justify-center">
        {users.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            No boarders found matching your search.
          </p>
        ) : (
          users.map((user) => <Card key={user._id} user={user} />)
        )}
      </div>
    </>
  );
}

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
}: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateQueryParams = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-evenly max-w-screen-lg m-auto">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">Items per page</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            updateQueryParams("limit", value);
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => updateQueryParams("page", currentPage - 1)}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => updateQueryParams("page", currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import UtensilFineCard from "./UtensilFineCard";
import { getMoreUtensilHistoryForBoarder } from "@/actions/UtensilFineAction";

type UtensilEntry = {
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

export default function UtensilPage({
  lastEntries,
  boarderId,
  adminRole,
}: {
  lastEntries: UtensilEntry[];
  boarderId: string;
  adminRole: "admin" | "coadmin" | "manager";
}) {
  const [entries, setEntries] = useState<UtensilEntry[]>(lastEntries);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);

  const fetchMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore || entries.length === 0) return;

    isLoadingRef.current = true;

    const lastEntry = entries[entries.length - 1];
    const cursor = lastEntry?._id;

    if (!cursor) {
      setHasMore(false);
      isLoadingRef.current = false;
      return;
    }

    const res = await getMoreUtensilHistoryForBoarder(boarderId, cursor, LIMIT);

    if (res.length < LIMIT) setHasMore(false);

    setEntries((prev) => [...prev, ...res]);
    isLoadingRef.current = false;
  }, [entries, boarderId, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entriesList) => {
        const first = entriesList[0];
        if (first.isIntersecting) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchMore]);

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry._id !== id));
  };

  const markEntryPaid = (id: string) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry._id === id
          ? {
              ...entry,
              paid: true,
            }
          : entry
      )
    );
  };

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No utensil transactions found.
      </div>
    );
  }

  return (
    <>
      {entries.map((row) => (
        <UtensilFineCard
          key={row._id}
          row={row}
          onDelete={removeEntry}
          onMarkPaid={markEntryPaid}
          adminRole={adminRole}
        />
      ))}
      {hasMore && (
        <div
          ref={observerRef}
          className="py-6 text-center text-muted-foreground"
        >
          Loading more...
        </div>
      )}
    </>
  );
}

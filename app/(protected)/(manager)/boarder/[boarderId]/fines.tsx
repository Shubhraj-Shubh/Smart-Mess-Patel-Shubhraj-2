"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Fine } from "./page";
import FineCard from "./FineCard";
import { getMoreFines } from "@/actions/fineActions";

const LIMIT = 50;

export default function FinesPage({
  lastFines,
  boarderId,
  adminRole,
}: {
  lastFines: Fine[];
  boarderId: string;
  adminRole: "admin" | "coadmin" | "manager";
}) {
  const [fines, setFines] = useState<Fine[]>(lastFines);

  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  let prevDate: string | null = null;

  const fetchMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;

    const lastFine = fines[fines.length - 1];

    const cursor = lastFine?._id;

    const res = await getMoreFines(boarderId, cursor, LIMIT, true);

    if (res.length < LIMIT) setHasMore(false);

    setFines((prev) => [...prev, ...res]);
    isLoadingRef.current = false;
  }, [fines, boarderId, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
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

  const markFinePaidInList = (fineId: string) => {
    setFines((prev) =>
      prev.map((fine) =>
        fine._id === fineId
          ? {
              ...fine,
              paid: true,
            }
          : fine
      )
    );
  };

  const removeFine = (fineId: string) => {
    setFines((prev) => prev.filter((fine) => fine._id !== fineId));
  };

  const updateFineInList = (fineId: string, updatedData: Partial<Fine>) => {
    setFines((prev) =>
      prev.map((fine) =>
        fine._id === fineId ? { ...fine, ...updatedData } : fine
      )
    );
  };

  return (
    <>
      {fines.map((fine, index) => {
        const fineDate = fine.createdAt
          .toLocaleString("en-IN")
          .substring(0, 10);

        let dateHeader = null;
        if (prevDate !== fineDate) {
          dateHeader = (
            <div className="text-center border-t py-2">{fineDate}</div>
          );
          prevDate = fineDate;
        }

        return (
          <div key={index}>
            {dateHeader}
            <FineCard
              fine={fine}
              onFineCleared={markFinePaidInList}
              onFineUpdated={updateFineInList}
              onFineDeleted={removeFine}
              adminRole={adminRole}
            />
          </div>
        );
      })}
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

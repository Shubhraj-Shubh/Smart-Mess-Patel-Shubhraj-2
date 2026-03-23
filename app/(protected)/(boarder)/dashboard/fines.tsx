"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Fine } from "./page";
import { getMoreFines } from "@/actions/fineActions";

const LIMIT = 50;

type FineCardBoarderProps = {
  fine: Fine;
};

function FineCardBoarder({ fine }: FineCardBoarderProps) {
  return (
    <div className="flex border-t p-2 items-center justify-around">
      <div className="w-full text-center">{fine.fineAmount}</div>
      <div className="w-full text-center">{fine.reason}</div>
      <div className="w-full text-center">{fine.adminName}</div>
      <div className="w-full text-center">
        {fine.createdAt.getHours() + ":" + fine.createdAt.getMinutes()}
      </div>
      <div className="w-full text-center font-medium">
        {fine.paid ? "Paid" : "Unpaid"}
      </div>
    </div>
  );
}

export default function FinesPageBoarder({
  lastFines,
  boarderId,
}: {
  lastFines: Fine[];
  boarderId: string;
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
            <FineCardBoarder fine={fine} />
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

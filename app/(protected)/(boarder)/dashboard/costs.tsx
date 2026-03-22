"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cost } from "./page";
import CostCard from "./CostCard";
import { getMoreCosts } from "@/actions/dashboardActions";

const LIMIT = 50;

export default function CostsPage({
  lastCosts,
  boarderId,
}: {
  lastCosts: Cost[];
  boarderId: string;
}) {
  const [costs, setCosts] = useState<Cost[]>(lastCosts);

  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRef = useRef(false);
  let prevDate: string | null = null;

  const fetchMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;

    const lastCost = costs[costs.length - 1];

    const cursor = lastCost?._id;

    const res = await getMoreCosts(boarderId, cursor, LIMIT);

    if (res.length < LIMIT) setHasMore(false);

    setCosts((prev) => [...prev, ...res]);
    isLoadingRef.current = false;
  }, [costs, hasMore, boarderId]);

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
      {costs.map((cost, index) => {
        const costDate = cost.createdAt
          .toLocaleString("en-IN")
          .substring(0, 10);

        let dateHeader = null;
        if (prevDate !== costDate) {
          dateHeader = (
            <div className="text-center border-t py-2">{costDate}</div>
          );
          prevDate = costDate;
        }

        return (
          <div key={index}>
            {dateHeader}
            <CostCard cost={cost} />
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

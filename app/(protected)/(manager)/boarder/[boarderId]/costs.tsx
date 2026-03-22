"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Cost } from "./page";
import CostCard from "./CostCard";
import { getMoreCosts } from "@/actions/dashboardActions";

const LIMIT = 50;

export default function CostsPage({
  lastCosts,
  boarderId,
  adminRole,
}: {
  lastCosts: Cost[];
  boarderId: string;
  adminRole: "admin" | "coadmin" | "manager";
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
    console.log(res);

    if (res.length < LIMIT) setHasMore(false);

    setCosts((prev) => [...prev, ...res]);
    isLoadingRef.current = false;
  }, [costs, boarderId, hasMore]);

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

  const removeCost = (costId: string) => {
    setCosts((prev) => prev.filter((cost) => cost._id !== costId));
  };

  const updateCostInList = (costId: string, updatedData: Partial<Cost>) => {
    setCosts((prev) =>
      prev.map((cost) =>
        cost._id === costId ? { ...cost, ...updatedData } : cost
      )
    );
  };

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
            <CostCard
              cost={cost}
              onCostCleared={removeCost}
              onCostUpdated={updateCostInList}
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

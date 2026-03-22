"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

interface RefreshmentEntry {
  _id: string;
  date: string;
  time: string;
  event: { name: string } | null;
  item: { name: string } | null;
  quantity: number;
  addedBy: { name: string; email: string; rollno: string } | null;
  isVerified: boolean;
}

interface RefreshmentHistoryProps {
  entries: RefreshmentEntry[];
}

export default function RefreshmentHistory({ entries }: RefreshmentHistoryProps) {
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const groupByDateAndItem = () => {
    const grouped: {
      [date: string]: {
        [itemName: string]: RefreshmentEntry[];
      };
    } = {};

    entries.forEach((entry) => {
      const date = formatDate(entry.date);
      const itemName = entry.item?.name || "N/A";

      if (!grouped[date]) {
        grouped[date] = {};
      }
      if (!grouped[date][itemName]) {
        grouped[date][itemName] = [];
      }
      grouped[date][itemName].push(entry);
    });

    return grouped;
  };

  const getItemSummary = (entriesForDate: {
    [itemName: string]: RefreshmentEntry[];
  }) => {
    const summary: { [key: string]: number } = {};
    Object.entries(entriesForDate).forEach(([itemName, itemEntries]) => {
      const totalQty = itemEntries.reduce((sum, entry) => sum + entry.quantity, 0);
      summary[itemName] = totalQty;
    });
    return summary;
  };

  const getEventBreakdown = (itemEntries: RefreshmentEntry[]) => {
    const breakdown: { [eventName: string]: number } = {};
    itemEntries.forEach((entry) => {
      const eventName = entry.event?.name || "N/A";
      breakdown[eventName] = (breakdown[eventName] || 0) + entry.quantity;
    });
    return breakdown;
  };

  const toggleDateExpand = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const toggleItemExpand = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedItems(newExpanded);
  };

  const groupedEntries = groupByDateAndItem();
  const sortedDates = Object.keys(groupedEntries).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate total items across all entries
  const totalItemsCount = entries.reduce((sum, entry) => sum + entry.quantity, 0);

  // Calculate item-wise totals
  const itemWiseTotals: { [itemName: string]: number } = {};
  entries.forEach((entry) => {
    const itemName = entry.item?.name || "N/A";
    itemWiseTotals[itemName] = (itemWiseTotals[itemName] || 0) + entry.quantity;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Recent Entries History</h2>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm">
            {entries.length} total {entries.length === 1 ? "entry" : "entries"}
          </Badge>
          <Badge variant="secondary" className="text-sm text-primary text-base font-bold">
            Total Items: {totalItemsCount}
          </Badge>
        </div>
      </div>

      {/* Item-wise Total Summary */}
      {Object.keys(itemWiseTotals).length > 0 && (
        <div className="bg-secondary/10 border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2">Item-wise Total Summary</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(itemWiseTotals)
              .sort(([, a], [, b]) => b - a)
              .map(([itemName, total]) => (
                <div
                  key={itemName}
                  className="bg-background border rounded-md px-3 py-2 shadow-sm"
                >
                  <span className="text-sm font-medium text-muted-foreground">{itemName}:</span>{" "}
                  <span className="text-base font-bold text-primary">{total}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entries yet. Add your first entry above.
          </div>
        ) : (
          <div className="divide-y">
            {sortedDates.map((date) => {
              const isDateExpanded = expandedDates.has(date);
              const itemsForDate = groupedEntries[date];
              const itemSummary = getItemSummary(itemsForDate);

              return (
                <div key={date}>
                  {/* Date Header */}
                  <button
                    onClick={() => toggleDateExpand(date)}
                    className="w-full bg-slate-50 hover:bg-slate-100 px-6 py-4 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isDateExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-lg">{date}</p>
                        <p className="text-sm text-muted-foreground">
                          {Object.entries(itemSummary)
                            .map(([item, qty]) => `${item}: ${qty}`)
                            .join(" • ")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {Object.keys(itemsForDate).length} {Object.keys(itemsForDate).length === 1 ? "item type" : "item types"}
                    </Badge>
                  </button>

                  {/* Items grouped by type */}
                  {isDateExpanded && (
                    <div className="bg-white">
                      {Object.entries(itemsForDate).map(([itemName, itemEntries]) => {
                        const itemKey = `${date}-${itemName}`;
                        const isItemExpanded = expandedItems.has(itemKey);
                        const totalQty = itemEntries.reduce((sum, entry) => sum + entry.quantity, 0);
                        const eventBreakdown = getEventBreakdown(itemEntries);
                        const verifiedCount = itemEntries.filter(e => e.isVerified).length;
                        const pendingCount = itemEntries.length - verifiedCount;

                        return (
                          <div key={itemKey} className="border-t">
                            {/* Item Header */}
                            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                              <button
                                onClick={() => toggleItemExpand(itemKey)}
                                className="flex items-center gap-3 flex-1 text-left"
                              >
                                {isItemExpanded ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                                <div>
                                  <p className="font-semibold text-base">{itemName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Total Quantity: <span className="font-bold">{totalQty}</span> • 
                                    Events: {Object.entries(eventBreakdown)
                                      .map(([event, qty]) => `${event} (${qty})`)
                                      .join(", ")}
                                  </p>
                                </div>
                              </button>
                              
                              {/* Status Summary */}
                              <div className="flex gap-2">
                                {verifiedCount > 0 && (
                                  <Badge variant="default" className="bg-green-600">
                                    ✓ Verified: {verifiedCount}
                                  </Badge>
                                )}
                                {pendingCount > 0 && (
                                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                    ⏳ Pending: {pendingCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Individual Entries */}
                            {isItemExpanded && (
                              <div className="max-h-[400px] overflow-y-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Time</TableHead>
                                      <TableHead>Event</TableHead>
                                      <TableHead className="text-right">Quantity</TableHead>
                                      <TableHead>Added By</TableHead>
                                      <TableHead>Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {itemEntries.map((entry) => (
                                      <TableRow key={entry._id}>
                                        <TableCell className="text-sm">{entry.time}</TableCell>
                                        <TableCell className="text-sm font-medium">
                                          {entry.event?.name || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{entry.quantity}</TableCell>
                                        <TableCell className="text-sm">
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {entry.addedBy?.name || "Unknown"}
                                            </span>
                                            {entry.addedBy?.rollno && (
                                              <span className="text-xs text-muted-foreground">
                                                {entry.addedBy.rollno}
                                              </span>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          {entry.isVerified ? (
                                            <Badge variant="default" className="bg-green-600">
                                              ✓ Verified
                                            </Badge>
                                          ) : (
                                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                              ⏳ Pending
                                            </Badge>
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

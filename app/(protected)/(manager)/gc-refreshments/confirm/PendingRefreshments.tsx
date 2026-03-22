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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  VerifyRefreshmentEntry,
  DeleteRefreshmentEntry,
  VerifyMultipleRefreshmentEntries,
  DeleteMultipleRefreshmentEntries,
} from "@/actions/gcActions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
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

interface PendingRefreshmentsProps {
  entries: RefreshmentEntry[];
}

export default function PendingRefreshments({
  entries: initialEntries,
}: PendingRefreshmentsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [verifyingBulk, setVerifyingBulk] = useState<string | null>(null);
  const [deletingBulk, setDeletingBulk] = useState<string | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const handleVerify = async (entryId: string) => {
    setVerifying(entryId);
    try {
      const result = await VerifyRefreshmentEntry(entryId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Entry verified successfully",
        });
        setEntries(entries.filter((e) => e._id !== entryId));
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to verify");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify entry",
        variant: "destructive",
      });
    } finally {
      setVerifying(null);
    }
  };

  const handleVerifyBulk = async (entryIds: string[], itemName: string) => {
    const bulkKey = `${itemName}-bulk`;
    setVerifyingBulk(bulkKey);
    try {
      const result = await VerifyMultipleRefreshmentEntries(entryIds);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || `All ${itemName} entries verified successfully`,
        });
        setEntries(entries.filter((e) => !entryIds.includes(e._id)));
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to verify");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify entries",
        variant: "destructive",
      });
    } finally {
      setVerifyingBulk(null);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    setDeleting(entryId);
    try {
      const result = await DeleteRefreshmentEntry(entryId);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Entry deleted successfully",
        });
        setEntries(entries.filter((e) => e._id !== entryId));
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete entry",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteBulk = async (entryIds: string[], itemName: string) => {
    if (!confirm(`Are you sure you want to delete all ${itemName} entries?`)) {
      return;
    }

    const bulkKey = `${itemName}-bulk`;
    setDeletingBulk(bulkKey);
    try {
      const result = await DeleteMultipleRefreshmentEntries(entryIds);
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || `All ${itemName} entries deleted successfully`,
        });
        setEntries(entries.filter((e) => !entryIds.includes(e._id)));
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete entries",
        variant: "destructive",
      });
    } finally {
      setDeletingBulk(null);
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Pending Verifications</h2>
        <Badge variant="secondary" className="text-sm">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pending entries to verify
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
                        const entryIds = itemEntries.map(e => e._id);
                        const bulkKey = `${itemName}-bulk`;

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
                              
                              {/* Bulk Actions */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleVerifyBulk(entryIds, itemName)}
                                  disabled={verifyingBulk === bulkKey || deletingBulk === bulkKey}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  {verifyingBulk === bulkKey ? "Verifying..." : `Verify All (${itemEntries.length})`}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteBulk(entryIds, itemName)}
                                  disabled={verifyingBulk === bulkKey || deletingBulk === bulkKey}
                                >
                                  {deletingBulk === bulkKey ? "Deleting..." : "Delete All"}
                                </Button>
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
                                      <TableHead className="text-right">Actions</TableHead>
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
                                              {entry.addedBy?.name || "Unknown Admin"}
                                            </span>
                                            {entry.addedBy?.rollno && (
                                              <span className="text-xs text-muted-foreground">
                                                {entry.addedBy.rollno}
                                              </span>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              size="sm"
                                              onClick={() => handleVerify(entry._id)}
                                              disabled={verifying === entry._id || deleting === entry._id}
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              {verifying === entry._id ? "Verifying..." : "Verify"}
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="destructive"
                                              onClick={() => handleDelete(entry._id)}
                                              disabled={verifying === entry._id || deleting === entry._id}
                                            >
                                              {deleting === entry._id ? "Deleting..." : "Delete"}
                                            </Button>
                                          </div>
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

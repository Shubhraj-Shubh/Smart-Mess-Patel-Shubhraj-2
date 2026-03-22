"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeactivateBoardersByRollNos } from "@/actions/adminActions";

type DeactivateResult = {
	updatedCount: number;
	alreadyInactiveCount: number;
	notFoundRollNos: string[];
	totalProcessed: number;
};

export default function RemoveBoarderForm() {
	const [rollNos, setRollNos] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [result, setResult] = useState<DeactivateResult | null>(null);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				const rawData = e.target?.result;
				if (!rawData) {
					toast.error("Failed to read file");
					return;
				}

				const workbook = XLSX.read(rawData, { type: "array" });
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				const rows: (string | number | null)[][] = XLSX.utils.sheet_to_json(
					worksheet,
					{
						header: 1,
						defval: "",
					}
				);

				// First column contains roll numbers, skip empty/header-like values.
				const parsedRollNos = Array.from(
					new Set(
						rows
							.map((row) => String(row[0] ?? "").trim())
							.filter((rollNo) => rollNo.length > 0)
					)
				);

				if (parsedRollNos.length === 0) {
					toast.error("No roll numbers found in first column");
					setRollNos([]);
					setResult(null);
					return;
				}

				setRollNos(parsedRollNos);
				setResult(null);
				toast.success(`${parsedRollNos.length} roll numbers loaded`);
			};

			reader.readAsArrayBuffer(file);
		} catch (error) {
			console.error("Error parsing upload file:", error);
			toast.error("Failed to parse XLS/XLSX file");
		}
	};

	const handleDeactivate = async () => {
		if (rollNos.length === 0) {
			toast.error("Please upload a file with roll numbers first");
			return;
		}

		setIsSubmitting(true);
		try {
			const response = await DeactivateBoardersByRollNos(rollNos);

			if (!response.success) {
				toast.error(response.message || "Failed to deactivate boarders");
				return;
			}

			const summary: DeactivateResult = {
				updatedCount: response.updatedCount || 0,
				alreadyInactiveCount: response.alreadyInactiveCount || 0,
				notFoundRollNos: response.notFoundRollNos || [],
				totalProcessed: response.totalProcessed || 0,
			};

			setResult(summary);
			toast.success(
				`${summary.updatedCount} boarder${summary.updatedCount === 1 ? "" : "s"} marked inactive`
			);
		} catch (error) {
			console.error("Error deactivating boarders:", error);
			toast.error("Failed to deactivate boarders");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<Input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
				<p className="text-sm text-muted-foreground">
					Upload XLS/XLSX file. First column should contain boarder roll numbers.
				</p>
			</div>

			<div className="flex items-center justify-between gap-4 flex-wrap">
				<p className="text-sm">
					Loaded roll numbers: <span className="font-semibold">{rollNos.length}</span>
				</p>
				<Button onClick={handleDeactivate} disabled={isSubmitting || rollNos.length === 0}>
					{isSubmitting ? "Updating..." : "Mark As Inactive"}
				</Button>
			</div>

			{result && (
				<div className="rounded-lg border p-4 space-y-3 bg-muted/30">
					<h3 className="font-semibold">Update Summary</h3>
					<p className="text-sm">Total processed: {result.totalProcessed}</p>
					<p className="text-sm text-green-700">Updated to inactive: {result.updatedCount}</p>
					<p className="text-sm text-amber-700">
						Already inactive: {result.alreadyInactiveCount}
					</p>
					<p className="text-sm text-red-700">
						Not found: {result.notFoundRollNos.length}
					</p>

					{result.notFoundRollNos.length > 0 && (
						<div className="space-y-1">
							<p className="text-sm font-medium text-red-700">Missing Roll Numbers</p>
							<div className="max-h-40 overflow-y-auto rounded border bg-background p-2">
								<p className="text-xs break-words">
									{result.notFoundRollNos.join(", ")}
								</p>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

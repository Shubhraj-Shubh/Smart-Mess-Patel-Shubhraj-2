"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import Boarder from "@/models/Boarder";
import WorkerModel from "@/models/WorkerModel";
import { GetAdmin } from "./adminActions";
import UtensilFineModel from "@/models/UtensilFineModel";
import UtensilFineConfigModel from "@/models/UtensilFineConfigModel";

const DEFAULT_UTENSIL_FINE_AMOUNT = 20;

type UtensilFineRow = {
	_id: string;
	userId: string;
	userName: string;
	issuedByWorkerId: string;
	returnedToWorkerId: string | null;
	issuedByWorkerName: string;
	returnedToWorkerName: string;
	configuredFineAmount: number;
	fineAmount: number;
	fineApplied: boolean;
	fineAppliedAt: Date | null;
	category: string;
	dueAt: Date;
	issuedAt: Date;
	returnedAt: Date | null;
	paid: boolean;
	createdAt: Date;
	updatedAt: Date;
};

type ScanUtensilInput = {
	userId: string;
	workerId: string;
	workerName: string;
};

const getCutoffForDate = (date: Date) => {
	const cutoff = new Date(date);
	cutoff.setHours(20, 30, 0, 0);
	return cutoff;
};

async function ensureConfig() {
	const config = await UtensilFineConfigModel.findOneAndUpdate(
		{ key: "GLOBAL" },
		{
			$setOnInsert: {
				key: "GLOBAL",
				amount: DEFAULT_UTENSIL_FINE_AMOUNT,
			},
		},
		{ upsert: true, new: true }
	);

	return config;
}

function mapRow(row: {
	_id: ObjectId;
	userId: ObjectId;
	issuedByWorkerId: ObjectId;
	returnedToWorkerId?: ObjectId | null;
	issuedByWorkerName: string;
	returnedToWorkerName?: string;
	configuredFineAmount: number;
	fineAmount: number;
	fineApplied: boolean;
	fineAppliedAt?: Date | null;
	category: string;
	dueAt: Date;
	issuedAt: Date;
	returnedAt?: Date | null;
	paid: boolean;
	createdAt: Date;
	updatedAt: Date;
}): UtensilFineRow {
	return {
		_id: row._id.toString(),
		userId: row.userId.toString(),
		userName: "",
		issuedByWorkerId: row.issuedByWorkerId.toString(),
		returnedToWorkerId: row.returnedToWorkerId
			? row.returnedToWorkerId.toString()
			: null,
		issuedByWorkerName: row.issuedByWorkerName,
		returnedToWorkerName: row.returnedToWorkerName || "",
		configuredFineAmount: row.configuredFineAmount,
		fineAmount: row.fineAmount,
		fineApplied: row.fineApplied,
		fineAppliedAt: row.fineAppliedAt || null,
		category: row.category,
		dueAt: row.dueAt,
		issuedAt: row.issuedAt,
		returnedAt: row.returnedAt || null,
		paid: row.paid,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

export async function applyPendingUtensilFines() {
	const now = new Date();
	const overdue = await UtensilFineModel.find({
		returnedAt: null,
		fineApplied: false,
		dueAt: { $lt: now },
	})
		.select("_id configuredFineAmount")
		.lean();

	if (overdue.length === 0) return 0;

	const updates = overdue.map((entry) => ({
		updateOne: {
			filter: { _id: entry._id, fineApplied: false },
			update: {
				$set: {
					fineApplied: true,
					fineAppliedAt: now,
					fineAmount: entry.configuredFineAmount,
					paid: false,
				},
			},
		},
	}));

	if (updates.length > 0) {
		await UtensilFineModel.bulkWrite(updates);
	}

	return updates.length;
}

export async function getUtensilFineAmount() {
	try {
		const config = await ensureConfig();
		return { success: true, amount: config.amount };
	} catch (error) {
		console.error("Failed to fetch utensil fine amount:", error);
		return { success: false, amount: DEFAULT_UTENSIL_FINE_AMOUNT };
	}
}

export async function updateUtensilFineAmount(amount: number) {
	try {
		const session = await auth();
		if (!session?.user?.email)
			return { success: false, message: "Unauthorized" };

		const admin = await GetAdmin(session.user.email);
		if (!admin || admin.role !== "admin") {
			return { success: false, message: "Only admin can update fine amount" };
		}

		if (!Number.isFinite(amount) || amount < 0) {
			return { success: false, message: "Amount must be a valid number" };
		}

		await UtensilFineConfigModel.findOneAndUpdate(
			{ key: "GLOBAL" },
			{
				$set: {
					amount,
					updatedByAdminId: admin._id,
				},
			},
			{ upsert: true }
		);

		revalidatePath("/boarder");
		return { success: true, message: "Utensil fine amount updated" };
	} catch (error) {
		console.error("Failed to update utensil fine amount:", error);
		return { success: false, message: "Failed to update amount" };
	}
}

export async function issueUtensil(data: ScanUtensilInput) {
	try {
		const boarder = await Boarder.findById(data.userId);
		if (!boarder) return { success: false, message: "Boarder not found" };

		const worker = await WorkerModel.findById(data.workerId);
		if (!worker || worker.disabled) {
			return { success: false, message: "Invalid worker" };
		}

		const existingOpen = await UtensilFineModel.findOne({
			userId: new ObjectId(data.userId),
			returnedAt: null,
		});

		if (existingOpen) {
			return {
				success: false,
				message: "This boarder already has an active utensil issue",
			};
		}

		const config = await ensureConfig();
		const issuedAt = new Date();
		const dueAt = getCutoffForDate(issuedAt);

		await UtensilFineModel.create({
			userId: new ObjectId(data.userId),
			issuedByWorkerId: worker._id,
			issuedByWorkerName: data.workerName,
			configuredFineAmount: config.amount,
			fineAmount: 0,
			fineApplied: false,
			category: "UTENSIL_FINE",
			dueAt,
			issuedAt,
			paid: false,
		});

		revalidatePath("/dashboard");
		revalidatePath(`/boarder/${data.userId}`);
		return { success: true, message: "Utensil issued" };
	} catch (error) {
		console.error("Failed to issue utensil:", error);
		return { success: false, message: "Failed to issue utensil" };
	}
}

export async function returnUtensil(data: ScanUtensilInput) {
	try {
		const worker = await WorkerModel.findById(data.workerId);
		if (!worker || worker.disabled) {
			return { success: false, message: "Invalid worker" };
		}

		const entry = await UtensilFineModel.findOne({
			userId: new ObjectId(data.userId),
			returnedAt: null,
		}).sort({ createdAt: -1 });

		if (!entry) {
			return { success: false, message: "No active utensil issue found" };
		}

		const now = new Date();
		const shouldFine = now > entry.dueAt;

		entry.returnedAt = now;
		entry.returnedToWorkerId = worker._id;
		entry.returnedToWorkerName = data.workerName;

		if (shouldFine && !entry.fineApplied) {
			entry.fineApplied = true;
			entry.fineAppliedAt = now;
			entry.fineAmount = entry.configuredFineAmount;
			entry.paid = false;
		}

		await entry.save();

		revalidatePath("/dashboard");
		revalidatePath(`/boarder/${data.userId}`);

		if (entry.fineApplied) {
			return {
				success: true,
				message: `Utensil returned. Fine added: Rs ${entry.fineAmount}`,
			};
		}

		return { success: true, message: "Utensil returned within time" };
	} catch (error) {
		console.error("Failed to return utensil:", error);
		return { success: false, message: "Failed to return utensil" };
	}
}

export async function getUtensilFines(
	userId: string,
	limit = 10,
	includePaid = false
) {
	try {
		await applyPendingUtensilFines();

		const query: {
			userId: string;
			fineApplied: boolean;
			paid?: boolean;
		} = {
			userId,
			fineApplied: true,
		};

		if (!includePaid) {
			query.paid = false;
		}

		const fines = await UtensilFineModel.find(query)
			.sort({ createdAt: "desc" })
			.limit(limit)
			.lean();

		return fines.map((fine) => mapRow(fine));
	} catch (error) {
		console.log("Failed to fetch utensil fines:", error);
		return [];
	}
}

export async function getMoreUtensilFines(
	boarderId: string,
	cursor: string,
	limit = 10,
	includePaid = false
) {
	await applyPendingUtensilFines();

	const query: {
		userId: ObjectId;
		fineApplied: boolean;
		paid?: boolean;
		_id: { $lt: ObjectId };
	} = {
		userId: new ObjectId(boarderId),
		fineApplied: true,
		_id: { $lt: new ObjectId(cursor) },
	};

	if (!includePaid) {
		query.paid = false;
	}

	const fines = await UtensilFineModel.find(query)
		.sort({ _id: -1 })
		.limit(limit)
		.lean();

	return fines.map((fine) => mapRow(fine));
}

export async function getUtensilHistoryForBoarder(
	boarderId: string,
	limit = 50,
	includePaid = true
) {
	try {
		await applyPendingUtensilFines();

		const query: {
			userId: ObjectId;
			paid?: boolean;
		} = {
			userId: new ObjectId(boarderId),
		};

		if (!includePaid) {
			query.paid = false;
		}

		const rows = await UtensilFineModel.find(query)
			.sort({ _id: -1 })
			.limit(limit)
			.lean();

		return rows.map((row) => mapRow(row));
	} catch (error) {
		console.error("Failed to fetch utensil history:", error);
		return [];
	}
}

export async function getMoreUtensilHistoryForBoarder(
	boarderId: string,
	cursor: string,
	limit = 50,
	includePaid = true
) {
	await applyPendingUtensilFines();

	const query: {
		userId: ObjectId;
		_id: { $lt: ObjectId };
		paid?: boolean;
	} = {
		userId: new ObjectId(boarderId),
		_id: { $lt: new ObjectId(cursor) },
	};

	if (!includePaid) {
		query.paid = false;
	}

	const rows = await UtensilFineModel.find(query)
		.sort({ _id: -1 })
		.limit(limit)
		.lean();

	return rows.map((row) => mapRow(row));
}

export async function getUtensilFineTotalForBoarder(boarderId: string) {
	try {
		await applyPendingUtensilFines();

		const result = await UtensilFineModel.aggregate([
			{
				$match: {
					userId: new ObjectId(boarderId),
					fineApplied: true,
					paid: false,
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: "$fineAmount" },
				},
			},
		]);

		return result[0]?.total ?? 0;
	} catch (error) {
		console.error("Failed to compute utensil total:", error);
		return 0;
	}
}

export async function getUtensilFineTotalsByBoarderIds(boarderIds: string[]) {
	try {
		if (boarderIds.length === 0) return {} as Record<string, number>;

		await applyPendingUtensilFines();

		const ids = boarderIds.map((id) => new ObjectId(id));
		const rows = await UtensilFineModel.aggregate([
			{
				$match: {
					userId: { $in: ids },
					fineApplied: true,
					paid: false,
				},
			},
			{
				$group: {
					_id: "$userId",
					total: { $sum: "$fineAmount" },
				},
			},
		]);

		const totals: Record<string, number> = {};
		for (const row of rows) {
			totals[row._id.toString()] = row.total;
		}

		return totals;
	} catch (error) {
		console.error("Failed to compute utensil totals map:", error);
		return {} as Record<string, number>;
	}
}

export async function markUtensilFinePaid(entryId: string) {
	try {
		const session = await auth();
		if (!session?.user?.email) return "failed";

		const admin = await GetAdmin(session.user.email);
		if (!admin || admin.role !== "admin") return "failed";

		await UtensilFineModel.updateOne(
			{
				_id: new ObjectId(entryId),
				fineApplied: true,
			},
			{
				$set: {
					paid: true,
				},
			}
		);

		return "success";
	} catch (error) {
		console.error("Failed to mark utensil fine paid:", error);
		return "failed";
	}
}

export async function deleteUtensilFine(entryId: string) {
	try {
		const session = await auth();
		if (!session?.user?.email) return { success: false };

		const admin = await GetAdmin(session.user.email);
		if (!admin || admin.role !== "admin") return { success: false };

		await UtensilFineModel.deleteOne({ _id: new ObjectId(entryId) });
		return { success: true };
	} catch (error) {
		console.error("Failed to delete utensil fine:", error);
		return { success: false };
	}
}

export async function clearAllUtensilFinesForBoarder(boarderId: string) {
	try {
		const session = await auth();
		if (!session?.user?.email) return "failed";

		const admin = await GetAdmin(session.user.email);
		if (!admin || admin.role !== "admin") return "failed";

		await UtensilFineModel.updateMany(
			{
				userId: new ObjectId(boarderId),
				fineApplied: true,
				paid: false,
			},
			{
				$set: {
					paid: true,
				},
			}
		);

		revalidatePath(`/boarder/${boarderId}`);
		revalidatePath("/boarder");
		revalidatePath("/dashboard");
		revalidatePath("/utensil-fine");
		return "success";
	} catch (error) {
		console.error("Failed to clear boarder utensil fines:", error);
		return "failed";
	}
}

export async function clearAllUtensilFinesSystem() {
	try {
		const session = await auth();
		if (!session?.user?.email) return "failed";

		const admin = await GetAdmin(session.user.email);
		if (!admin || admin.role !== "admin") return "failed";

		await UtensilFineModel.updateMany(
			{
				fineApplied: true,
				paid: false,
			},
			{
				$set: {
					paid: true,
				},
			}
		);

		revalidatePath("/boarder");
		revalidatePath("/dashboard");
		revalidatePath("/utensil-fine");
		return "success";
	} catch (error) {
		console.error("Failed to clear all utensil fines:", error);
		return "failed";
	}
}

export async function getAllUtensilEntries(limit = 200) {
	try {
		await applyPendingUtensilFines();

		const rows = await UtensilFineModel.find({})
			.sort({ _id: -1 })
			.limit(limit)
			.lean();

		const boarderIds = Array.from(
			new Set(rows.map((row) => row.userId.toString()))
		);

		const boarders = await Boarder.find({ _id: { $in: boarderIds } })
			.select("_id name")
			.lean();

		const boarderNameMap = new Map<string, string>();
		for (const boarder of boarders) {
			boarderNameMap.set(boarder._id.toString(), boarder.name);
		}

		return rows.map((row) => {
			const mapped = mapRow(row);
			return {
				...mapped,
				userName: boarderNameMap.get(mapped.userId) || "Unknown Boarder",
			};
		});
	} catch (error) {
		console.error("Failed to fetch utensil entries:", error);
		return [];
	}
}

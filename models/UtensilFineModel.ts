import mongoose, { Schema, Document, Model } from "mongoose";

interface IUtensilFine extends Document {
	_id: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId;
	issuedByWorkerId: mongoose.Types.ObjectId;
	returnedToWorkerId?: mongoose.Types.ObjectId;
	issuedByWorkerName: string;
	returnedToWorkerName?: string;
	configuredFineAmount: number;
	fineAmount: number;
	fineApplied: boolean;
	fineAppliedAt?: Date;
	category: string;
	dueAt: Date;
	issuedAt: Date;
	returnedAt?: Date;
	paid: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const UtensilFineSchema: Schema = new Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Boarder",
			required: true,
			index: true,
		},
		issuedByWorkerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Worker",
			required: true,
		},
		returnedToWorkerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Worker",
			required: false,
			default: null,
		},
		issuedByWorkerName: {
			type: String,
			required: true,
			trim: true,
		},
		returnedToWorkerName: {
			type: String,
			required: false,
			default: "",
			trim: true,
		},
		configuredFineAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		fineAmount: {
			type: Number,
			required: true,
			default: 0,
			min: 0,
		},
		fineApplied: {
			type: Boolean,
			required: true,
			default: false,
			index: true,
		},
		fineAppliedAt: {
			type: Date,
			required: false,
			default: null,
		},
		category: {
			type: String,
			default: "UTENSIL_FINE",
		},
		dueAt: {
			type: Date,
			required: true,
		},
		issuedAt: {
			type: Date,
			required: true,
		},
		returnedAt: {
			type: Date,
			required: false,
			default: null,
		},
		paid: {
			type: Boolean,
			default: false,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

UtensilFineSchema.index({ userId: 1, paid: 1, _id: -1 });
UtensilFineSchema.index({ returnedAt: 1, fineApplied: 1, dueAt: 1 });

const UtensilFineModel: Model<IUtensilFine> =
	mongoose.models.UtensilFine ||
	mongoose.model<IUtensilFine>("UtensilFine", UtensilFineSchema);

export default UtensilFineModel;

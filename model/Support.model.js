import mongoose from "mongoose";

export const SupportSchema = mongoose.Schema(
	{
		purpose: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		user: {
			fullname: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			id: {
				type: String,
				required: true,
			},
			image: { type: String, required: true },
		},
		ticket: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Support", SupportSchema);

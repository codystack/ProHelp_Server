import mongoose from "mongoose";

export const AlertSchema = mongoose.Schema(
	{
		type: {
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
			image: { type: String, required: false },
		},
		userId: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Alert", AlertSchema);

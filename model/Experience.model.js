import mongoose from "mongoose";

export const ExperienceSchema = mongoose.Schema({
	company: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	region: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	startDate: {
		type: Date,
		required: true,
	},
    startDate: {
		type: Date,
		required: true,
	},
});

export default mongoose.model.NOK || mongoose.model("NOK", NOKSchema);

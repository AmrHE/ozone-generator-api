import mongoose, { models } from 'mongoose';

const summaryLogSchema = new mongoose.Schema({
	// summaryLog: {
	// 	type: String,
	// 	required: true,
	// },

	sensor: {
		type: mongoose.Schema.ObjectId,
		ref: 'Sensor',
		required: [true, 'Log must belong to a Device!'],
	},

	createdAt: {
		type: Date,
		default: Date.now(),
	},

	data: {
		tempData: {
			type: Map,
		},

		log: {
			type: String,
		},

		deviceStatus: {
			type: Number,
			enum: [0, 1],
		},
	},
});

const SummaryLog =
	models.SummaryLog || mongoose.model('SummaryLog', summaryLogSchema);

export default SummaryLog;

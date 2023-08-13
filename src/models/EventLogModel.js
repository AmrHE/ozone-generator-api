import mongoose, { models } from 'mongoose';

const eventLogSchema = new mongoose.Schema({
	// eventLog: {
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

	eventName: {
		type: String,
		required: true,
	},

	eventData: {
		tempData: {
			type: Map,
		},

		maxOperatingTimePercentage: {
			type: Number,
		},

		deviceStatus: {
			type: Number,
			enum: [0, 1],
		},
	},
});

const EventLog = models.EventLog || mongoose.model('EventLog', eventLogSchema);

export default EventLog;

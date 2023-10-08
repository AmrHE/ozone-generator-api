import mongoose, { models } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import Company from './CompanyModel';

const sensorSchema = new mongoose.Schema({
	sensorName: {
		type: String,
		required: [true, 'Please enter your organization name.'],
		lowercase: true,
		unique: [true, 'This organization name has been already used.'],
		trim: true,
	},

	password: {
		type: String,
		required: [true, 'Please provide a password'],
		minlength: [8, 'Password is too short'],
		select: false,
	},

	passwordConfirm: {
		type: String,
		required: [true, 'Please confirm your password'],
		validate: {
			//This only works on "CREATE" and "SAVE" method
			validator: function (el) {
				return el === this.password;
			},
			message: "The passowrd doesn't match",
		},
	},

	createdAt: {
		type: Date,
		default: Date.now(),
	},

	schedules: [
		{
			type: [
				{
					deviceTime: {
						type: Date,
						default: Date.now(),
					},
					cycleRatio: {
						type: Number,
						min: 0,
						max: 100,
					},
					startHour: {
						type: Number,
						min: [0, 'Start hours cannot be less than 0'],
						max: 23,
					}, // start hour from 0 to 23
					startMinute: {
						type: Number,
						min: 0,
						max: 59,
					},
					endHour: {
						type: Number,
						min: 0,
						max: 23,
					}, // start hour from 0 to 23
					endMinute: {
						type: Number,
						min: 0,
						max: 59,
					},
				},
			],
			index: true,
		},
	],

	// companies: Array,
	companies: [
		{
			type: mongoose.Schema.ObjectId,
			ref: 'Company',
			required: [true, 'Device must belong to a Company!'],
		},
	],

	settings: {
		defaultTimezone: {
			type: String,
		},

		deviceTime: Number,
		cycleRatio: {
			type: Number,
			default: 40,
		},

		cycleTime: {
			type: Number,
		},

		No2AutoStop: {
			type: Number,
		},

		No2AutoStart: {
			type: Number,
		},
	},

	data: {
		deviceTime: {
			type: Number,
		},

		deviceStatus: {
			type: String,
			enum: ['on', 'off'],
		},

		temperature: {
			type: Number,
		},
		tumidity: {
			type: Number,
		},
		pressure: {
			type: Number,
		},
		gas: {
			type: Number,
		},
		No2ppm: {
			type: Number,
		},
		No2_alarm: {
			type: Boolean,
		},
		compressor_pressure: {
			type: Number,
		},
		core_temperature: {
			type: Number,
		},
	},

	events: {
		type: Map,
	},

	commands: {
		command: {
			type: Number,
			enum: [0, 1],
		},

		createdAt: {
			type: Date,
			default: Date.now(),
		},
	},

	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
//PRE-SAVE DOCUMENT MIDDLEWARE (Pre-Save Hooks)
//This Hook/Middleware runs between getting the data, and saving it to database
sensorSchema.pre('save', async function (next) {
	//Only run this func if password was modified
	if (!this.isModified('password')) return next();

	//Encrypt OR Hash the password with cost parameter of "12"
	this.password = await bcrypt.hash(this.password, 12);

	//Delete passwordConfirm from our database
	//{as we have the hashed password in our DB,
	//we don't want to save this "passwordConfirm" field}
	this.passwordConfirm = undefined;
	next();
});

//Pre-Save middleware to update the passwordChangeAt property
sensorSchema.pre('save', function (next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// /POST-SAVE DOCUMENT MIDDLEWARE (Post-Save Hook)
sensorSchema.post('save', async function (doc, next) {
	console.log(doc._id);
	console.log(doc.companies);

	doc.companies.map(async (id) => {
		console.log(id);
		const updatedDoc = await Company.findByIdAndUpdate(
			id,
			{ $push: { sensors: doc._id } },
			{
				new: true,
				runValidators: true,
			}
		);

		if (!updatedDoc) {
			return next(
				res.status(404).send({ message: 'No document found with this ID' })
			);
			// return next(new AppError('', 404));
		}
	});

	next();
});

// //Automatically populate the guide field in all querys using pre-find query middleware
// sensorSchema.pre(/^find/, function (next) {
// 	this.populate('companies');
// 	next();
// });

//Static Instance Method
//(Check if the password is correct or not)
sensorSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

//Static Instance Method
//(Check if the password is changed or not after the JWT is issued/created)
sensorSchema.methods.changedPasswordAfterJWT = function (JWTTimeStamp) {
	// console.log(this);
	// console.log('passwordChangedAt: ', this.passwordChangedAt);
	if (this.passwordChangedAt) {
		const changedTimeStamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		// console.log(changedTimeStamp, JWTTimeStamp);
		return JWTTimeStamp < changedTimeStamp;
	}
	//False means that password NOT changed
	return false;
};

sensorSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// console.log({ resetToken }, this.passwordResetToken);

	this.passwordResetExpires = Date.now() + 3 * 60 * 1000;

	return resetToken;
};

const Sensor = models.Sensor || mongoose.model('Sensor', sensorSchema);

export default Sensor;

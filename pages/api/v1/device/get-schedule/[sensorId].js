import { connectMongoDB } from '../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../src/models/SensorModel';
import protectDeviceRoute from '../../../../../src/utils/protectDeviceRoutes';
export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	await connectMongoDB();
	console.log('!!DB CONNECTED SUCCCESSFULLY!!');

	// console.log(req.query.companyId);

	protectDeviceRoute(req, res)
		.then(async (result) => {
			// console.log({ result });
			if (result.statusCode === 401) {
				// console.log({ result });
				// console.log({ result: result.message });
				res.status(401).send({
					status: 'fail',
					message: result.message,
				});
			} else {
				if (req.method !== 'GET') {
					res.status(405).json({ message: 'Only GET requests are allowed.' });
					return;
				}

				// if (req.query.companyId == result.company._id) {

				try {
					const schedule = await Sensor.findById(req.query.sensorId, {
						schedules: { $slice: [0, 1] },
					}).select('schedules');
					// .sort({ createdAt: -1 })
					// .limit(1);

					// console.log({ schedule });

					if (!schedule) {
						res.status(404).send('No document found with this ID');
					} else {
						// const fullCompanyData = company.populate('sensors');
						res.status(200).send({
							status: 'success',
							schedule: schedule.schedules[schedule.schedules.length - 1], //TODO: WE CAN USE THE AGGREGGATION PIPELINES INSTEAD OF DOING IT MANUALLY
						});
					}
				} catch (error) {
					console.log(error.message);
					res.status(400).send({ error, message: error.message });
				}

				//
				//
				//
				//
				//
				// }
				// 	res.status(400)
				// 		.send({ message: 'You are not authorized to get this data' });
			}
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: err.message });
		});
}

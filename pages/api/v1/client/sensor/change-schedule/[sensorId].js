import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../../src/models/SensorModel';
import protectClientRoute from '../../../../../../src/utils/protectClientRoutes';
export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	await connectMongoDB();
	console.log('!!DB CONNECTED SUCCCESSFULLY!!');

	// console.log(req.query.companyId);

	protectClientRoute(req, res)
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
				if (req.method !== 'PATCH') {
					res.status(405).json({ message: 'Only PATCH requests are allowed.' });
					return;
				}

				// if (req.query.companyId == result.company._id) {

				console.log(req.body.schedule);

				if (!req.body.schedule) {
					res.status(405).json({ message: 'Please Provide a valid schedule' });
					return;
				}

				try {
					const sensor = await Sensor.findByIdAndUpdate(
						req.query.sensorId,
						{ $push: { schedules: req.body.schedule } },
						{
							new: true,
							runValidators: true,
						}
					);

					// console.log({ sensor });

					if (!sensor) {
						//TODO: handle all the patch request in this point if there is not document found with the provided IDs
						res.status(404).send('No document found with this ID');

						// next(new AppError('', 404));
					} else {
						// const fullCompanyData = company.populate('sensors');
						// const devices = fullCompanyData?.sensors;
						// console.log(devices);
						res.status(200).send({
							status: 'success',
							message: 'schedule updated successfully',
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

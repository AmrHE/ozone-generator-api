/**
 * @swagger
 * \api\v1\device\update-configuration\{sensor_id}:
 *   patch:
 *     summary: Update sensor's configuration / settings
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *     tags:
 *       - Device Endpoints
 *     requestBody:
 *      content:
 *        application/json:
 *          schema:            # Request payload
 *            type: object
 *            properties:      # Request parts
 *              settings:
 *                type: object
 *                properties:
 *                  defaultTimezone:
 *                    type: string
 *                  deviceTime:
 *                    type: number
 *                  cycleRation:
 *                    type: number
 *                  cycleTime:
 *                    type: number
 *                  No2AutoStop:
 *                    type: number
 *                  No2AutoStart:
 *                    type: number
 *     description: Update sensor configuration / settings
 *     responses:
 *      200:
 *         description: success
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Please Provide a valid settings
 *      405:
 *         description: Only PATCH requests are allowed.
 *
 */

import { connectMongoDB } from '../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../src/models/SensorModel';
import protectDeviceRoute from '../../../../../src/utils/protectDeviceRoutes';
export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	await connectMongoDB();
	console.log('!!DB CONNECTED SUCCCESSFULLY!!');

	protectDeviceRoute(req, res)
		.then(async (result) => {
			console.log({ result });
			if (result.statusCode === 401) {
				res.status(401).send({
					status: 'fail',
					message: result.message,
				});
			} else {
				if (req.method !== 'PATCH') {
					res.status(405).json({ message: 'Only PATCH requests are allowed.' });
					return;
				}

				if (!req.body.settings) {
					//TODO: ADD THIS BODY AND QUERY HANDLER TO ALL THE CALLS
					res.status(401).json({ message: 'Please Provide a valid settings' });
					return;
				}

				try {
					const sensor = await Sensor.findByIdAndUpdate(
						req.query.sensorId,
						{ settings: req.body.settings },
						{
							new: true,
							runValidators: true,
						}
					);

					// console.log({ sensor });

					if (!sensor) {
						res.status(404).send('No document found with this ID');

						// next(new AppError('', 404));
					} else {
						// const fullCompanyData = company.populate('sensors');
						// const devices = fullCompanyData?.sensors;
						// console.log(devices);
						res.status(200).send({
							status: 'success',
							message: 'Settings updated successfully',
						});
					}
				} catch (error) {
					console.log(error.message);
					res.status(400).send({ error, message: error.message });
				}
			}
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: err.message });
		});
}

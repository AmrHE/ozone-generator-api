/**
 * @swagger
 * \api\v1\device\get-configuration\{sensor_id}:
 *   get:
 *     summary: Get sensor's configuration / Settings
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *     tags:
 *       - Device Endpoints
 *     description: Get sensor's configuration / Settings
 *     responses:
 *      200:
 *         description: Success
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Unauthorized
 *      404:
 *         description: No document found with this ID
 *      405:
 *         description: Only GET requests are allowed.
 *
 */

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
				res.status(401).send({
					status: 'fail',
					message: result.message,
				});
			} else {
				if (req.method !== 'GET') {
					res.status(405).json({ message: 'Only GET requests are allowed.' });
					return;
				}

				try {
					const settings = await Sensor.findById(req.query.sensorId).select(
						'settings'
					);

					if (!settings) {
						res.status(404).send('No document found with this ID');
					} else {
						res.status(200).send({
							status: 'success',
							defaultTimezone: settings.settings.defaultTimezone,
							deviceTime: settings.settings.deviceTime,
							cycleRation: settings.settings.cycleRation,
							cycleTime: settings.settings.cycleTime,
							No2AutoStop: settings.settings.No2AutoStop,
							No2AutoStart: settings.settings.No2AutoStart,
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

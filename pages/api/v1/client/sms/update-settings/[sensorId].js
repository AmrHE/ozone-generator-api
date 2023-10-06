/**
 * @swagger
 * \api\v1\client\sms\update-settings\{sensor_id}:
 *   patch:
 *     security:
 *       - authorization: []
 *     summary: Update sensor's settings
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *     tags:
 *       - Client Endpoints
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
 *     description: Update sensor settings
 *     responses:
 *      200:
 *         description: Data updated successfully
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Please Provide a valid data
 *      404:
 *         description: No document found with this ID
 *      405:
 *         description: Only PATCH requests are allowed.
 *
 */

import { connectMongoDB } from '../../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../../src/models/SensorModel';
import protectClientRoute from '../../../../../../src/utils/protectClientRoutes';
export default async function handler(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	await connectMongoDB();
	console.log('!!DB CONNECTED SUCCCESSFULLY!!');

	protectClientRoute(req, res)
		.then(async (result) => {
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

				console.log(req.body.settings);
				try {
					const sensor = await Sensor.findByIdAndUpdate(
						req.query.sensorId,
						{ settings: req.body.settings },
						{
							new: true,
							runValidators: true,
						}
					);

					if (!sensor) {
						res.status(404).send('No document found with this ID');
					} else {
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

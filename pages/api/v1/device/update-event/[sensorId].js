/**
 * @swagger
 * \api\v1\device\update-event\{sensor_id}:
 *   patch:
 *     summary: Update sensor's Event
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
 *              events:
 *                type: object
 *                properties:
 *                  deviceTime:
 *                    type: number
 *                  eventName:
 *                    type: string
 *     description: Update sensor Event Data
 *     responses:
 *      200:
 *         description: Events updated successfully
 *      400:
 *         description: something went wrong!!.
 *      401:
 *         description: Please Provide a valid Event Data
 *      404:
 *         description: No document found with this ID
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

				if (!req.body.events) {
					//TODO: ADD THIS BODY AND QUERY HANDLER TO ALL THE CALLS
					res.status(401).json({ message: 'Please Provide a valid events' });
					return;
				}

				try {
					const sensor = await Sensor.findByIdAndUpdate(
						req.query.sensorId,
						{ events: req.body.events },
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
							message: 'Events updated successfully',
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

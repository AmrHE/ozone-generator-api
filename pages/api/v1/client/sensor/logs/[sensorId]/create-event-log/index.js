/**
 * @swagger
 * \api\v1\client\sensor\logs\{sensor_id}\create-event-log:
 *   post:
 *     security:
 *       - authorization: []
 *     summary: Create new sensor's event log
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
 *              eventName:
 *                type: string
 *              eventData:
 *                type: object
 *                properties:
 *                  tempData:
 *                    type: object
 *                  maxOperatingTimePercentage:
 *                    type: number
 *                  deviceStatus:
 *                    type: number
 *     description: Create new sensor's event log
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

import { connectMongoDB } from '../../../../../../../../src/libs/MongoConnect';
import EventLog from '../../../../../../../../src/models/EventLogModel';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	let { eventName, eventData } = req.body;

	const { sensorId } = req.query;
	// console.log({ sensorId });

	try {
		await connectMongoDB();

		const log = await EventLog.create({
			eventName,
			sensor: sensorId,
			eventData,
		});
		// .then((data) => {
		// console.log(log);
		res.status(201).send(log);
		// });
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: 'something went wrong!!' });
	}
}

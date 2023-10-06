/**
 * @swagger
 * \api\v1\client\sensor\logs\{sensor_id}\get-event-logs:
 *   get:
 *     security:
 *       - authorization: []
 *     parameters:
 *       - in: path
 *         name: sensor_id
 *     summary: Get sensor's event logs
 *     tags:
 *       - Client Endpoints
 *     description: Get sensor's event logs
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

import { connectMongoDB } from '../../../../../../../../src/libs/MongoConnect';
import protectClientRoute from '../../../../../../../../src/utils/protectClientRoutes';

// import protectClientRoute from '../../../src/utils'
import EventLog from '../../../../../../../../src/models/EventLogModel';

export default async function handler(req, res) {
	// res.status(201).send('Hi there !!!');
	res.setHeader('Access-Control-Allow-Origin', '*');

	protectClientRoute(req, res)
		.then(async (result) => {
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

				const { sensorId } = req.query;

				try {
					await connectMongoDB();

					// console.log('!!DB CONNECTED SUCCCESSFULLY!!');

					const eventLogs = await EventLog.find({ sensor: sensorId });

					// Log.create({ log }).then((data) => {
					console.log({ eventLogs });
					res.status(200).send(eventLogs);
					// });
				} catch (error) {
					console.log(error.message);
					res.status(400).send({ error, message: 'something went wrong!!' });
				}
			}
		})
		.catch((err) => {
			console.log(err.message);
			res.status(400).send({ err, message: 'something went wrong!!' });
		});
}

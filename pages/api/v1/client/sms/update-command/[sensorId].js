/**
 * @swagger
 * \api\v1\client\sms\update-command\{sensor_id}:
 *   patch:
 *     security:
 *       - authorization: []
 *     summary: Update sensor's command
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
 *              command:
 *                type: number
 *     description: Update sensor's command
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

	// console.log(req.query.companyId);

	protectClientRoute(req, res)
		.then(async (result) => {
			console.log({ result });
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

				if (req.body.command === undefined) {
					//TODO: ADD THIS BODY AND QUERY HANDLER TO ALL THE CALLS
					res.status(405).json({ message: 'Please Provide a valid command' });
					return;
				}

				const createdAt = Date.now();

				try {
					const sensor = await Sensor.findByIdAndUpdate(
						req.query.sensorId,
						{
							commands: {
								command: req.body.command,
								createdAt,
							},
						},
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
							message: 'Command updated successfully',
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

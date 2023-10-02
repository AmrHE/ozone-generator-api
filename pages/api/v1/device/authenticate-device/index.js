/**
 * @swagger
 * https://github.com/AmrHE/ozone-generator-api/api/v1/{device_Id}/authenticate-device:
 *   post:
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: device_Id
 *     requestBody:
 *      content:
 *        multipart/form-data: # Media type
 *          schema:            # Request payload
 *            type: object
 *            properties:      # Request parts
 *              companyName:
 *                type: string
 *              password:
 *                type: password
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */

import { connectMongoDB } from '../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../src/models/SensorModel';
// import AppError from '../../../../../src/utils/appError';
import { createAndSendToken } from '../../../../../src/utils/createAndSendSensorJWT';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		console.log(req.method);
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	const { Username, Password } = req.body;

	console.log();

	try {
		await connectMongoDB();

		//1) Check if sensor name and password exist
		if (!Username || !Password) {
			return res
				.status(400)
				.send({ message: 'Please provide your sensor name and password' });
		}

		//2)Check if the comapny exists && if the password is correct
		const sensor = await Sensor.findOne({ sensorName: Username }).select(
			'+password'
		);

		if (!sensor || !(await sensor.correctPassword(Password, sensor.password))) {
			res.status(401).send({ message: 'Incorrect username or password' });
		}

		//3)If everything is ok, send token to client
		createAndSendToken(sensor, 200, req, res);
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: 'something went wrong!!' });
	}
}

// /**
//  * @swagger
//  * https://github.com/AmrHE/ozone-generator-api/api/v1/{device_Id}/authenticate-device:
//  *   post:
//  *     summary: Get a user by ID
//  *     parameters:
//  *       - in: path
//  *         name: device_Id
//  *     requestBody:
//  *      content:
//  *        multipart/form-data: # Media type
//  *          schema:            # Request payload
//  *            type: object
//  *            properties:      # Request parts
//  *              id:            # Part 1 (string value)
//  *                type: string
//  *              address:       # Part2 (object)
//  *                type: object
//  *                properties:
//  *                  street:
//  *                    type: string
//  *                  city:
//  *                    type: string
//  *              profileImage:  # Part 3 (an image)
//  *                type: string
//  *                format: binary
//  *     description: Returns the hello world
//  *     responses:
//  *       200:
//  *         description: hello world
//  */

import { connectMongoDB } from '../../../../../src/libs/MongoConnect';
import Sensor from '../../../../../src/models/SensorModel';
// import AppError from '../../../../../src/utils/appError';
import { createAndSendToken } from '../../../../../src/utils/createAndSendSensorJWT';

export default async function handler(req, res) {
	// console.log(req.method);
	// res.status(405).send({ message: 'Only POST requests are allowed.' });
	if (req.method !== 'POST') {
		console.log(req.method);
		res.status(405).send({ message: 'Only POST requests are allowed.' });
		return;
	}

	const { sensorName, password } = req.body;

	try {
		await connectMongoDB();

		//1) Check if sensor name and password exist
		if (!sensorName || !password) {
			return res
				.status(400)
				.send({ message: 'Please provide your sensor name and password' });

			// return new AppError('Please provide your sensor name and password', 400);
		}

		//2)Check if the comapny exists && if the password is correct
		const sensor = await Sensor.findOne({ sensorName: sensorName }).select(
			'+password'
		);

		if (!sensor || !(await sensor.correctPassword(password, sensor.password))) {
			// return new AppError('Incorrect Email or password', 401);
			res.status(401).send({ message: 'Incorrect Email or password' });
		}

		//3)If everything is ok, send token to client
		createAndSendToken(sensor, 200, req, res);
	} catch (error) {
		console.log(error.message);
		res.status(400).send({ error, message: 'something went wrong!!' });
	}
}
